import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('logTableBody');

    // --- 1. FETCH LOGS ---
    async function fetchLogs(url = '/api/interactions') {
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

    // --- 2. RENDER TABLE ---
    function renderTable(logs) {
        tableBody.innerHTML = '';

        if (logs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Belum ada riwayat interaksi.</td></tr>`;
            return;
        }

        logs.forEach((log, index) => {
            // Icon berdasarkan tipe
            const icons = {
                'call': '<i class="bi bi-telephone text-primary"></i>',
                'email': '<i class="bi bi-envelope text-warning"></i>',
                'meeting': '<i class="bi bi-people-fill text-success"></i>',
                'whatsapp': '<i class="bi bi-whatsapp text-success"></i>',
                'other': '<i class="bi bi-journal-text text-secondary"></i>'
            };

            // Tombol Attachment (Jika ada file)
            let attachmentBtn = '-';
            if (log.attachment) {
                // Kita gunakan URL storage publik
                const fileUrl = `/storage/${log.attachment}`;
                attachmentBtn = `<a href="${fileUrl}" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="bi bi-paperclip"></i> Lihat File</a>`;
            }

            // Format Tanggal Next Action
            let nextAction = '-';
            if (log.next_action) {
                nextAction = `
                    <div class="fw-bold">${log.next_action}</div>
                    <small class="text-danger"><i class="bi bi-calendar-event"></i> Due: ${log.due_date || 'N/A'}</small>
                `;
            }

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${log.client ? log.client.name : 'Unknown'}</div>
                        <small class="text-muted">${log.created_at.substring(0, 10)}</small>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            ${icons[log.type] || ''} <span class="text-capitalize">${log.type}</span>
                        </div>
                    </td>
                    <td>${log.notes}</td>
                    <td>${nextAction}</td>
                    <td>${attachmentBtn}</td>
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
        container.innerHTML = prevBtn + nextBtn;
    }
    
    window.loadPage = (url) => { if (url && url !== 'null') fetchLogs(url); };

    // --- 4. LOAD CLIENTS (Untuk Dropdown) ---
    const clientSelect = document.getElementById('clientSelect');
    const modalEl = document.getElementById('createLogModal');

    if (modalEl && clientSelect) {
        // Load data klien saat modal dibuka pertama kali
        modalEl.addEventListener('show.bs.modal', async () => {
            if (clientSelect.options.length > 1) return; // Sudah terisi, jangan load lagi

            try {
                const response = await fetch('/api/clients', { 
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                
                result.data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.name;
                    clientSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Gagal load klien', error);
            }
        });
    }

    // --- 5. SUBMIT FORM (UPLOAD FILE) ---
    const createForm = document.getElementById('createLogForm');
    const saveBtn = document.getElementById('saveBtn');
    const alertBox = document.getElementById('formAlertContainer');

    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Mengupload...';
            alertBox.innerHTML = '';

            // Gunakan FormData untuk menangani file
            const formData = new FormData(createForm);

            try {
                const response = await fetch('/api/interactions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // PENTING: Jangan set Content-Type header manual saat upload file!
                        // Browser akan otomatis mengaturnya menjadi 'multipart/form-data' dengan boundary yang benar.
                        'Accept': 'application/json' 
                    },
                    body: formData // Kirim objek FormData langsung (bukan JSON string)
                });

                const result = await response.json();

                if (response.ok) {
                    createForm.reset();
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();
                    fetchLogs(); // Refresh tabel
                    alert('Log berhasil disimpan!');
                } else {
                    if (result.message) {
                        alertBox.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    }
                }
            } catch (error) {
                console.error(error);
                alert('Gagal menyimpan data.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Simpan Log';
            }
        });
    }

    // Jalankan awal
    fetchLogs();
});