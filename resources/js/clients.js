document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');
    const searchInput = document.getElementById('searchInput');

    // --- 1. FUNGSI FETCH DATA KLIEN ---
    async function fetchClients(url = '/api/clients') {
        const search = searchInput ? searchInput.value : '';
        const urlObj = new URL(url, window.location.origin);
        
        if (search) urlObj.searchParams.set('search', search);

        try {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;
            
            const response = await fetch(urlObj.toString(), {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');
            const result = await response.json();
            
            renderTable(result.data);
            renderPagination(result); 
        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. LOGIKA PENCARIAN (DEBOUNCE) ---
    let timeout = null;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => { fetchClients('/api/clients'); }, 500);
        });
    }

    // --- 3. PAGINATION & HELPER ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if (!container) return; 
        container.innerHTML = '';

        const prevDisabled = result.prev_page_url ? '' : 'disabled';
        const nextDisabled = result.next_page_url ? '' : 'disabled';
        
        container.innerHTML = `
            <li class="page-item ${prevDisabled}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Previous</button></li>
            <li class="page-item disabled"><span class="page-link text-dark">Page ${result.current_page}</span></li>
            <li class="page-item ${nextDisabled}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>
        `;
    }

    window.loadPage = (url) => { if (url && url !== 'null') fetchClients(url); };

    // --- 4. FUNGSI RENDER TABEL (UPDATED RBAC) ---
    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        if (!clients || clients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Data tidak ditemukan.</td></tr>`;
            return;
        }

        // Ambil data user dari window.currentUser (diset oleh app.js)
        const user = window.currentUser;

        clients.forEach((client, index) => {
            let actionButtons = '';

            // Cek apakah user ada DAN role-nya bukan viewer
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="window.openEditModal(${client.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteClient(${client.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
            } else {
                // Tampilan untuk Viewer
                actionButtons = `<span class="text-muted fst-italic" style="font-size: 0.85rem;"><i class="bi bi-eye"></i> View Only</span>`;
            }

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${client.name}</div>
                        <small class="text-muted">${client.email}</small>
                    </td>
                    <td>${client.phone || '-'}</td>
                    <td><span class="badge bg-${client.type === 'VIP' ? 'warning' : 'info'}">${client.type}</span></td>
                    <td><span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">${client.status}</span></td>
                    <td>${actionButtons}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- 5. LOGIKA CRUD (Create, Edit, Delete) ---
    // (Kode Create, Edit, Delete tetap sama seperti sebelumnya, tidak perlu diubah logic-nya)
    // ... [Bagian Create, Edit, Delete Client disembunyikan untuk ringkas, gunakan kode lama Anda] ...
    
    // Pastikan fungsi window.openEditModal dan window.deleteClient ada di sini (copy dari file lama)
    // Serta event listener form submit create/edit.
    // ...

    // --- CRUD REFERENCE (Simpan bagian ini dari file lama Anda) ---
    const createForm = document.getElementById('createClientForm');
    if (createForm) { /* ...logic create... */ }

    const editForm = document.getElementById('editClientForm');
    const editModalEl = document.getElementById('editClientModal');
    const editModal = (typeof bootstrap !== 'undefined' && editModalEl) ? new bootstrap.Modal(editModalEl) : null;
    
    window.openEditModal = async (id) => { /* ...logic open edit... */ };
    if (editForm) { /* ...logic submit edit... */ }

    window.deleteClient = async (id) => { /* ...logic delete... */ };

    // --- 6. EKSEKUSI PERTAMA KALI (UPDATED ASYNC WAIT) ---
    // Kita menunggu 'user-ready' agar window.currentUser tidak null saat renderTable dipanggil
    if (window.currentUser) {
        fetchClients();
    } else {
        window.addEventListener('user-ready', () => {
            console.log('User data loaded, fetching clients...');
            fetchClients();
        });
    }
});