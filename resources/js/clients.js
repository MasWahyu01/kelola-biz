import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Variabel
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');
    const paginationContainer = document.getElementById('paginationContainer');

    // ==========================================
    // FUNGSI UTAMA (Diakses oleh HTML onclick)
    // ==========================================

    // FUNGSI 1: Buka Modal Edit
    window.openEditModal = async (id) => {
        console.log('Tombol Edit diklik untuk ID:', id); // <--- DEBUG POINT

        try {
            // Reset Form
            const form = document.getElementById('editClientForm');
            if(form) form.reset();

            // Fetch Data
            const response = await fetch(`/api/clients/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Gagal ambil data');

            const client = await response.json();

            // Isi Form
            document.getElementById('editClientId').value = client.id;
            document.getElementById('editName').value = client.name;
            document.getElementById('editEmail').value = client.email;
            document.getElementById('editPhone').value = client.phone || '';
            document.getElementById('editType').value = client.type;
            document.getElementById('editStatus').value = client.status;

            // Tampilkan Modal
            const modalEl = document.getElementById('editClientModal');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();

        } catch (error) {
            console.error('Error openEditModal:', error);
            alert('Gagal membuka data klien.');
        }
    };

    // FUNGSI 2: Hapus Klien
    window.deleteClient = async (id) => {
        console.log('Tombol Delete diklik untuk ID:', id); // <--- DEBUG POINT

        if (!confirm('Yakin ingin menghapus data ini?')) return;

        try {
            const response = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Data berhasil dihapus');
                fetchClients(); // Refresh tabel
            } else {
                alert('Gagal menghapus data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // FUNGSI 3: Helper Navigasi Halaman
    window.loadPage = (url) => {
        if (url && url !== 'null') fetchClients(url);
    };


    // ==========================================
    // LOGIKA RENDER TABEL
    // ==========================================

    async function fetchClients(url = '/api/clients') {
        // Cek search param
        const searchInput = document.getElementById('searchInput');
        const search = searchInput ? searchInput.value : '';
        
        const urlObj = new URL(url, window.location.origin);
        if (search) urlObj.searchParams.set('search', search);

        try {
            const response = await fetch(urlObj.toString(), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            renderTable(result.data);
            renderPagination(result);

        } catch (error) {
            console.error('Error fetchClients:', error);
        }
    }

    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        // Ambil data user dari Global Variable (diset oleh app.js)
        const user = window.currentUser;

        clients.forEach((client, index) => {
            // Tentukan Tombol Aksi
            let actionButtons = '';
            
            // Cek Role: Jika User ADA dan Role BUKAN Viewer -> Tampilkan Tombol
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openEditModal(${client.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteClient(${client.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            } else {
                actionButtons = `<span class="badge bg-secondary">View Only</span>`;
            }

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${client.name}</div>
                        <small class="text-muted">${client.email}</small>
                    </td>
                    <td>${client.phone || '-'}</td>
                    <td><span class="badge bg-info text-dark">${client.type}</span></td>
                    <td><span class="badge bg-success">${client.status}</span></td>
                    <td>${actionButtons}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    function renderPagination(result) {
        if(!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        paginationContainer.innerHTML = prevBtn + nextBtn;
    }

    // ==========================================
    // EKSEKUSI UTAMA
    // ==========================================
    
    // 1. Load data pertama kali (mungkin tombol aksi belum muncul karena user belum load)
    fetchClients();

    // 2. Event Listener: Jika app.js selesai load user, refresh tabel agar tombol muncul
    window.addEventListener('user-ready', () => {
        console.log('User detected (Clients), refreshing table access...');
        fetchClients();
    });

    // 3. Listener Search
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        let timeout = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fetchClients(), 500);
        });
    }

    // 4. Listener Submit Create & Edit (Opsional, pastikan ID form sesuai blade Anda)
    // ... Tambahkan listener form create/edit di sini jika belum ada ...
    
    // Listener Edit Form Submit
    const editForm = document.getElementById('editClientForm');
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editClientId').value;
            const formData = new FormData(editForm);
            // Convert formData to JSON object for PUT
            const data = Object.fromEntries(formData.entries());
            data._method = 'PUT';

            try {
                const res = await fetch(`/api/clients/${id}`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(data)
                });
                if(res.ok) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
                    modal.hide();
                    fetchClients();
                    alert('Update Berhasil');
                } else {
                    alert('Gagal Update');
                }
            } catch(err) { console.error(err); }
        });
    }
});