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

// ... (kode statusColors di atas) ...
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

    // --- 4. LOAD KLIEN UNTUK DROPDOWN ---
    const clientSelect = document.getElementById('clientSelect');

    async function loadClientOptions() {
        try {
            // Kita ambil data klien dari API yang sudah ada
            const response = await fetch('/api/clients', { // Default page 1
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            // Bersihkan opsi lama (kecuali default)
            clientSelect.innerHTML = '<option value="">-- Pilih Klien --</option>';

            // Loop data klien dan buat option
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

    // Panggil fungsi ini saat modal dibuka (Event Bootstrap)
    const modalEl = document.getElementById('createServiceModal');
    modalEl.addEventListener('show.bs.modal', loadClientOptions);


    // --- 5. SUBMIT FORM LAYANAN ---
    const createForm = document.getElementById('createServiceForm');
    const saveBtn = document.getElementById('saveBtn');
    const alertBox = document.getElementById('formAlertContainer');

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
                // Sukses
                createForm.reset();
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                
                fetchServices(); // Refresh tabel layanan
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

    window.loadPage = (url) => { if (url && url !== 'null') fetchServices(url); };

    // Jalankan awal
    fetchServices();
});