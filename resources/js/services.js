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
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.openEditService(${service.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteService(${service.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- 3. PAGINATION ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if(!container) return;
        
        container.innerHTML = '';
        
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        const info = `<li class="page-item disabled"><span class="page-link text-dark">Page ${result.current_page}</span></li>`;
        
        container.innerHTML = prevBtn + info + nextBtn;
    }

    // --- 4. LOAD KLIEN UNTUK DROPDOWN CREATE ---
    const clientSelect = document.getElementById('clientSelect');

    async function loadClientOptions() {
        try {
            const response = await fetch('/api/clients', { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            clientSelect.innerHTML = '<option value="">-- Pilih Klien --</option>';

            result.data.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = `${client.name} (${client.type})`;
                clientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Gagal memuat list klien', error);
        }
    }

    const modalEl = document.getElementById('createServiceModal');
    if(modalEl) {
        modalEl.addEventListener('show.bs.modal', loadClientOptions);
    }

    // --- 5. SUBMIT FORM CREATE LAYANAN ---
    const createForm = document.getElementById('createServiceForm');
    const saveBtn = document.getElementById('saveBtn');
    const alertBox = document.getElementById('formAlertContainer');

    if(createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Menyimpan...';
            alertBox.innerHTML = '';

            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/services', {
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
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();
                    
                    fetchServices(); 
                    alert('Layanan berhasil dibuat!');
                } else {
                    if (result.message) {
                        alertBox.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    }
                }
            } catch (error) {
                console.error(error);
                alert('Error sistem.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Simpan Layanan';
            }
        });
    }

    // --- 6. LOGIKA EDIT LAYANAN ---
    const editModalEl = document.getElementById('editServiceModal');
    // Inisialisasi modal edit jika elemennya ada
    let editModal = null;
    if (editModalEl) {
        editModal = new bootstrap.Modal(editModalEl);
    }
    
    const editForm = document.getElementById('editServiceForm');
    const editClientSelect = document.getElementById('editClientSelect');

    // Helper: Load Klien khusus untuk Dropdown Edit
    async function loadEditClientOptions(selectedClientId) {
        try {
            // Cek jika dropdown masih kosong (kecuali default), baru fetch ulang
            if (editClientSelect.options.length <= 1) {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` }});
                const result = await response.json();
                
                editClientSelect.innerHTML = '<option value="">-- Pilih Klien --</option>';
                result.data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = `${client.name} (${client.type})`;
                    editClientSelect.appendChild(option);
                });
            }
            // Set nilai terpilih
            editClientSelect.value = selectedClientId;
        } catch (error) {
            console.error('Gagal load klien edit', error);
        }
    }

    // Fungsi Buka Modal Edit (Global Scope)
    window.openEditService = async (id) => {
        try {
            if(!editModal) return;
            editForm.reset();
            
            // 1. Ambil Data Service
            const response = await fetch(`/api/services/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const service = await response.json();

            // 2. Isi Form (Mapping ID dari HTML editServiceModal)
            document.getElementById('editServiceId').value = service.id;
            document.getElementById('editServiceName').value = service.service_name;
            document.getElementById('editPic').value = service.pic;
            document.getElementById('editStartDate').value = service.start_date;
            document.getElementById('editEndDate').value = service.end_date || '';
            document.getElementById('editPriority').value = service.priority;
            document.getElementById('editStatus').value = service.status;
            document.getElementById('editDescription').value = service.description || '';

            // 3. Load Dropdown Klien & Pilih yang sesuai
            await loadEditClientOptions(service.client_id);

            // 4. Tampilkan Modal
            editModal.show();

        } catch (error) {
            console.error(error);
            alert('Gagal memuat data layanan.');
        }
    };

    // Listener Submit Update
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('editServiceId').value;
            const btn = document.getElementById('updateBtn');
            btn.disabled = true; 
            btn.innerText = 'Menyimpan...';

            const formData = new FormData(editForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`/api/services/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    editModal.hide();
                    fetchServices(); // Refresh tabel
                    alert('Layanan berhasil diperbarui!');
                } else {
                    const res = await response.json();
                    alert(res.message || 'Gagal update data.');
                }
            } catch (error) {
                console.error(error);
                alert('Error sistem.');
            } finally {
                btn.disabled = false;
                btn.innerText = 'Update Perubahan';
            }
        });
    }

    // --- 7. LOGIKA HAPUS LAYANAN ---
    window.deleteService = async (id) => {
        if (!confirm('Yakin ingin menghapus layanan ini? Data yang dihapus tidak bisa dikembalikan.')) return;

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Layanan dihapus.');
                fetchServices();
            } else {
                alert('Gagal menghapus layanan.');
            }
        } catch (error) {
            console.error(error);
            alert('Error sistem.');
        }
    };

    // Global Pagination Handler
    window.loadPage = (url) => { if (url && url !== 'null') fetchServices(url); };

    // Jalankan awal
    fetchServices();
});