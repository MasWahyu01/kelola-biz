document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');
    const searchInput = document.getElementById('searchInput');

    // --- 1. FUNGSI FETCH DATA KLIEN (Support Pagination & Search) ---
    async function fetchClients(url = '/api/clients') {
        const search = searchInput ? searchInput.value : '';
        const urlObj = new URL(url, window.location.origin);
        
        if (search) {
            urlObj.searchParams.set('search', search);
        }

        try {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

            const response = await fetch(urlObj.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');

            const result = await response.json();
            
            renderTable(result.data);
            renderPagination(result); 

        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data. Pastikan Anda login.</td></tr>`;
        }
    }

    // --- 2. LOGIKA PENCARIAN (DEBOUNCE) ---
    let timeout = null;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fetchClients('/api/clients'); 
            }, 500);
        });
    }

    // --- 3. FUNGSI RENDER PAGINATION ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if (!container) return; 

        container.innerHTML = '';

        const prevDisabled = result.prev_page_url ? '' : 'disabled';
        const prevBtn = `
            <li class="page-item ${prevDisabled}">
                <button class="page-link" onclick="window.loadPage('${result.prev_page_url}')" ${prevDisabled}>Previous</button>
            </li>
        `;

        const lastPage = result.last_page || 1; 
        const info = `
            <li class="page-item disabled">
                <span class="page-link text-dark">Page ${result.current_page} of ${lastPage}</span>
            </li>
        `;

        const nextDisabled = result.next_page_url ? '' : 'disabled';
        const nextBtn = `
            <li class="page-item ${nextDisabled}">
                <button class="page-link" onclick="window.loadPage('${result.next_page_url}')" ${nextDisabled}>Next</button>
            </li>
        `;

        container.innerHTML = prevBtn + info + nextBtn;
    }

    // --- 4. HELPER GLOBAL (Load Page) ---
    window.loadPage = (url) => {
        if (url && url !== 'null') {
            fetchClients(url);
        }
    };

    // --- 5. FUNGSI RENDER TABEL ---
    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        if (!clients || clients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Data tidak ditemukan.</td></tr>`;
            return;
        }

        clients.forEach((client, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${client.name}</div>
                        <small class="text-muted">${client.email}</small>
                    </td>
                    <td>${client.phone || '-'}</td>
                    <td>
                        <span class="badge bg-${client.type === 'VIP' ? 'warning' : 'info'}">
                            ${client.type}
                        </span>
                    </td>
                    <td>
                        <span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">
                            ${client.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.openEditModal(${client.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteClient(${client.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- 6. LOGIKA TAMBAH KLIEN (CREATE) ---
    const createForm = document.getElementById('createClientForm');
    const formAlert = document.getElementById('formAlertContainer');
    const saveBtn = document.getElementById('saveBtn');

    if (createForm) { 
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Menyimpan...';
            formAlert.innerHTML = '';

            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/clients', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    createForm.reset();
                    
                    const closeBtn = document.querySelector('#createClientModal .btn-close');
                    if (closeBtn) closeBtn.click();

                    fetchClients(); // Refresh tabel
                    alert('Klien berhasil ditambahkan!'); 
                } else {
                    if (result.message) {
                        formAlert.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    }
                }

            } catch (error) {
                console.error(error);
                formAlert.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan sistem.</div>`;
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Simpan';
            }
        });
    }

    // --- 7. LOGIKA EDIT KLIEN (UPDATE) ---
    
    // A. Variabel UI Modal Edit
    const editForm = document.getElementById('editClientForm');
    const editModalEl = document.getElementById('editClientModal');
    // Pastikan Bootstrap JS sudah di-load agar baris ini bekerja
    // Jika error "bootstrap is not defined", pastikan script bootstrap ada di file blade/html utama
    const editModal = (typeof bootstrap !== 'undefined') 
        ? new bootstrap.Modal(editModalEl) 
        : null; 

    // B. Helper: Buka Modal & Isi Data
    window.openEditModal = async (id) => {
        if (!editModal) {
            alert("Bootstrap JS belum dimuat dengan benar.");
            return;
        }

        try {
            editForm.reset();
            
            const response = await fetch(`/api/clients/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Gagal mengambil data');
            
            const result = await response.json();
            const client = result.data || result;

            document.getElementById('editClientId').value = client.id;
            document.getElementById('editName').value = client.name;
            document.getElementById('editEmail').value = client.email;
            document.getElementById('editPhone').value = client.phone || '';
            document.getElementById('editType').value = client.type;
            document.getElementById('editStatus').value = client.status;

            editModal.show();

        } catch (error) {
            console.error(error);
            alert('Gagal memuat data klien. Cek koneksi atau token.');
        }
    };

    // C. Listener: Simpan Perubahan (Update)
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('editClientId').value;
            const btn = document.getElementById('updateBtn');
            const alertBox = document.getElementById('editFormAlertContainer');
            
            btn.disabled = true;
            btn.innerHTML = 'Menyimpan...';
            if(alertBox) alertBox.innerHTML = '';

            const formData = new FormData(editForm);
            const data = Object.fromEntries(formData.entries());
            data._method = 'PUT'; 

            try {
                const response = await fetch(`/api/clients/${id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    editModal.hide();
                    fetchClients();
                    alert('Data berhasil diperbarui!');
                } else {
                    if (result.message && alertBox) {
                        alertBox.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    } else {
                        alert('Gagal update data.');
                    }
                }

            } catch (error) {
                console.error(error);
                alert('Terjadi kesalahan sistem saat update.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Update Perubahan';
            }
        });
    }

    // --- 9. FUNGSI HAPUS KLIEN (DELETE) ---
    // (Kode baru ditambahkan di sini)
    window.deleteClient = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data klien ini? Tindakan ini tidak bisa dibatalkan.')) {
            return;
        }

        try {
            const response = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Data berhasil dihapus.');
                fetchClients(); // Refresh tabel
            } else {
                alert(result.message || 'Gagal menghapus data.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan sistem saat menghapus data.');
        }
    };

    // --- 8. EXECUTE PERTAMA KALI ---
    fetchClients();
});