import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('serviceTableBody');

    // --- 1. FETCH DATA ---
    async function fetchServices(url = '/api/services') {
        try {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('Gagal mengambil data');
            const result = await response.json();
            renderTable(result.data);
            renderPagination(result);
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. RENDER TABEL (UPDATED RBAC) ---
    function renderTable(services) {
        tableBody.innerHTML = '';
        if (services.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Belum ada layanan yang terdaftar.</td></tr>`;
            return;
        }

        const user = window.currentUser; // Ambil user global

        services.forEach((service, index) => {
            let priorityBadge = service.priority === 'high' ? 'bg-danger' : (service.priority === 'medium' ? 'bg-warning text-dark' : 'bg-info text-dark');
            
            const statusColors = {
                'new': 'bg-primary', 'in_progress': 'bg-info text-dark', 'pending_client': 'bg-warning text-dark',
                'completed': 'bg-success', 'cancelled': 'bg-secondary'
            };

            // LOGIKA IZIN AKSES BARU
            let actionButtons = '';
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="window.openEditService(${service.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteService(${service.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
            } else {
                actionButtons = `<span class="text-muted fst-italic" style="font-size: 0.85rem;">View Only</span>`;
            }

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${service.service_name}</div>
                        <small class="text-muted"><i class="bi bi-building"></i> ${service.client ? service.client.name : 'Klien Dihapus'}</small>
                    </td>
                    <td>${service.pic}</td>
                    <td><span class="badge ${priorityBadge}">${service.priority.toUpperCase()}</span></td>
                    <td><span class="badge ${statusColors[service.status] || 'bg-secondary'}">${service.status.replace('_', ' ').toUpperCase()}</span></td>
                    <td>
                        <small class="d-block text-muted">Mulai: ${service.start_date}</small>
                        ${service.end_date ? `<small class="d-block text-muted">Selesai: ${service.end_date}</small>` : ''}
                    </td>
                    <td>${actionButtons}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- 3. PAGINATION & CRUD ---
    // (Pertahankan logika Pagination, Create, Edit, Delete yang sudah ada sebelumnya)
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if(!container) return;
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        container.innerHTML = prevBtn + nextBtn;
    }
    window.loadPage = (url) => { if (url && url !== 'null') fetchServices(url); };

    // ... [Kode logic Create, Edit, Delete Service tetap sama] ...
    
    const editModalEl = document.getElementById('editServiceModal');
    let editModal = null;
    if (editModalEl) editModal = new bootstrap.Modal(editModalEl);
    
    window.openEditService = async (id) => { /* ... */ };
    window.deleteService = async (id) => { /* ... */ };

    // --- EKSEKUSI PERTAMA KALI (UPDATED ASYNC WAIT) ---
    if (window.currentUser) {
        fetchServices();
    } else {
        window.addEventListener('user-ready', () => {
            fetchServices();
        });
    }
});