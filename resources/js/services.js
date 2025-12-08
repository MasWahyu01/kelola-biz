import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('serviceTableBody');
    const paginationContainer = document.getElementById('paginationContainer');

    // ==========================================
    // FUNGSI GLOBAL (Untuk Akses HTML)
    // ==========================================

    // Helper: Load Klien untuk Dropdown Edit
    async function loadEditClientOptions(selectedClientId) {
        const select = document.getElementById('editClientSelect');
        if (!select) return;
        
        // Hanya load jika belum ada isinya
        if (select.options.length <= 1) {
            try {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` }});
                const result = await response.json();
                
                select.innerHTML = '<option value="">-- Pilih Klien --</option>';
                result.data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = `${client.name} (${client.type})`;
                    select.appendChild(option);
                });
            } catch (e) { console.error(e); }
        }
        select.value = selectedClientId;
    }

    // FUNGSI 1: Buka Modal Edit
    window.openEditService = async (id) => {
        console.log('Edit Service diklik ID:', id);

        try {
            document.getElementById('editServiceForm').reset();
            
            const response = await fetch(`/api/services/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const service = await response.json();

            // Isi Form
            document.getElementById('editServiceId').value = service.id;
            document.getElementById('editServiceName').value = service.service_name;
            document.getElementById('editPic').value = service.pic;
            document.getElementById('editStartDate').value = service.start_date;
            document.getElementById('editEndDate').value = service.end_date || '';
            document.getElementById('editPriority').value = service.priority;
            document.getElementById('editStatus').value = service.status;
            document.getElementById('editDescription').value = service.description || '';

            // Load Klien
            await loadEditClientOptions(service.client_id);

            // Show Modal
            const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
            modal.show();

        } catch (error) {
            console.error(error);
            alert('Gagal memuat data layanan');
        }
    };

    // FUNGSI 2: Hapus Service
    window.deleteService = async (id) => {
        console.log('Delete Service diklik ID:', id);
        if (!confirm('Yakin ingin menghapus layanan ini?')) return;

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Layanan dihapus.');
                fetchServices();
            } else {
                alert('Gagal menghapus.');
            }
        } catch (error) { console.error(error); }
    };

    // FUNGSI 3: Navigasi Halaman
    window.loadPage = (url) => { if (url && url !== 'null') fetchServices(url); };


    // ==========================================
    // LOGIKA UTAMA & RENDER
    // ==========================================

    async function fetchServices(url = '/api/services') {
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            renderTable(result.data);
            renderPagination(result);
        } catch (error) { console.error(error); }
    }

    function renderTable(services) {
        tableBody.innerHTML = '';
        const user = window.currentUser; // Dari app.js

        const statusColors = {
            'new': 'bg-primary', 'in_progress': 'bg-info text-dark',
            'pending_client': 'bg-warning text-dark', 'completed': 'bg-success', 'cancelled': 'bg-secondary'
        };

        services.forEach((service, index) => {
            // Logika Tombol Aksi
            let actionButtons = '';
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openEditService(${service.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteService(${service.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            } else {
                actionButtons = `<span class="badge bg-secondary">View Only</span>`;
            }

            let priorityBadge = service.priority === 'high' ? 'bg-danger' : (service.priority === 'medium' ? 'bg-warning text-dark' : 'bg-info text-dark');

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${service.service_name}</div>
                        <small class="text-muted"><i class="bi bi-building"></i> ${service.client ? service.client.name : 'Klien Dihapus'}</small>
                    </td>
                    <td>${service.pic}</td>
                    <td><span class="badge ${priorityBadge}">${service.priority.toUpperCase()}</span></td>
                    <td><span class="badge ${statusColors[service.status]}">${service.status.replace('_', ' ').toUpperCase()}</span></td>
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

    function renderPagination(result) {
        if(!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        paginationContainer.innerHTML = prevBtn + nextBtn;
    }

    // --- EXECUTION ---
    fetchServices();
    
    // Auto-refresh saat user data loaded
    window.addEventListener('user-ready', () => {
        console.log('User detected (Services), refreshing...');
        fetchServices();
    });

    // --- FORM LISTENERS ---
    
    // 1. Load Client untuk Create Modal
    const createModalEl = document.getElementById('createServiceModal');
    if(createModalEl) {
        createModalEl.addEventListener('show.bs.modal', async () => {
            const select = document.getElementById('clientSelect');
            if (select.options.length <= 1) {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` }});
                const res = await response.json();
                res.data.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    select.appendChild(opt);
                });
            }
        });
    }

    // 2. Submit Create
    const createForm = document.getElementById('createServiceForm');
    if(createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if(res.ok) {
                    bootstrap.Modal.getInstance(createModalEl).hide();
                    createForm.reset();
                    fetchServices();
                    alert('Layanan dibuat!');
                } else { alert('Gagal buat layanan'); }
            } catch(e) { console.error(e); }
        });
    }

    // 3. Submit Update
    const editForm = document.getElementById('editServiceForm');
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editServiceId').value;
            const formData = new FormData(editForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch(`/api/services/${id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if(res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('editServiceModal')).hide();
                    fetchServices();
                    alert('Layanan diupdate!');
                } else { alert('Gagal update'); }
            } catch(e) { console.error(e); }
        });
    }
});