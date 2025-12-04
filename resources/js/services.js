import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('serviceTableBody');

    // --- 1. FETCH DATA ---
    async function fetchServices(url = '/api/services') {
        try {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

            const response = await fetch(url, {
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
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. RENDER TABEL ---
    function renderTable(services) {
        tableBody.innerHTML = '';

        if (services.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Belum ada layanan yang terdaftar.</td></tr>`;
            return;
        }

        services.forEach((service, index) => {
            // Warna badge berdasarkan prioritas
            let priorityBadge = 'bg-secondary';
            if (service.priority === 'high') priorityBadge = 'bg-danger';
            else if (service.priority === 'medium') priorityBadge = 'bg-warning text-dark';
            else priorityBadge = 'bg-info text-dark';

            // Warna badge status
            const statusColors = {
                'new': 'bg-primary',
                'in_progress': 'bg-info text-dark',
                'pending_client': 'bg-warning text-dark',
                'completed': 'bg-success',
                'cancelled': 'bg-secondary'
            };

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${service.service_name}</div>
                        <small class="text-muted"><i class="bi bi-building"></i> ${service.client ? service.client.name : 'Klien Dihapus'}</small>
                    </td>
                    <td>${service.pic}</td>
                    <td>
                        <span class="badge ${priorityBadge}">${service.priority.toUpperCase()}</span>
                    </td>
                    <td>
                        <span class="badge ${statusColors[service.status] || 'bg-secondary'}">
                            ${service.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <small class="d-block text-muted">Mulai: ${service.start_date}</small>
                        ${service.end_date ? `<small class="d-block text-muted">Selesai: ${service.end_date}</small>` : ''}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- 3. PAGINATION (Copy logic dari clients.js atau buat global helper nanti) ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if(!container) return;
        
        container.innerHTML = '';
        
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        const info = `<li class="page-item disabled"><span class="page-link text-dark">Page ${result.current_page}</span></li>`;
        
        container.innerHTML = prevBtn + info + nextBtn;
    }

    window.loadPage = (url) => { if (url && url !== 'null') fetchServices(url); };

    // Jalankan awal
    fetchServices();
});