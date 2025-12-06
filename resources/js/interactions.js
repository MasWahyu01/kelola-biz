import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('logTableBody');

    // --- 1. FETCH LOGS ---
    async function fetchLogs(url = '/api/interactions') {
        try {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

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
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. RENDER TABLE ---
    function renderTable(logs) {
        tableBody.innerHTML = '';

        if (logs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center">Belum ada riwayat interaksi.</td></tr>`;
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

            const actionButtons = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="window.openEditLog(${log.id})" title="Edit">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLog(${log.id})" title="Hapus">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;

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
                    <td>${actionButtons}</td> 
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

    // --- 4. LOAD CLIENTS (Untuk Dropdown Create) ---
    const clientSelect = document.getElementById('clientSelect');
    const modalEl = document.getElementById('createLogModal');

    if (modalEl && clientSelect) {
        modalEl.addEventListener('show.bs.modal', async () => {
            if (clientSelect.options.length > 1) return; 

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

    // --- 5. SUBMIT FORM (CREATE - UPLOAD FILE) ---
    const createForm = document.getElementById('createLogForm');
    const saveBtn = document.getElementById('saveBtn');
    const alertBox = document.getElementById('formAlertContainer');

    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Mengupload...';
            alertBox.innerHTML = '';

            const formData = new FormData(createForm);

            try {
                const response = await fetch('/api/interactions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json' 
                    },
                    body: formData 
                });

                const result = await response.json();

                if (response.ok) {
                    createForm.reset();
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();
                    fetchLogs(); 
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

    // --- 6. LOGIKA EDIT INTERAKSI ---
    const editModalEl = document.getElementById('editLogModal');
    // Pastikan modal element ada sebelum inisialisasi Bootstrap Modal
    let editModal;
    if (editModalEl) {
        editModal = new bootstrap.Modal(editModalEl);
    }
    
    const editForm = document.getElementById('editLogForm');
    const editClientSelect = document.getElementById('editClientSelect');

    // Helper: Load Klien untuk Dropdown Edit
    async function loadEditClientOptions(selectedId) {
        if (!editClientSelect) return;
        
        if (editClientSelect.options.length <= 1) {
            try {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` } });
                const result = await response.json();
                
                // Reset dan isi ulang
                editClientSelect.innerHTML = '<option value="">-- Pilih Klien --</option>';
                result.data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.name;
                    editClientSelect.appendChild(option);
                });
            } catch (e) { console.error(e); }
        }
        editClientSelect.value = selectedId;
    }

    // Fungsi Buka Modal Edit (Diakses global via window)
    window.openEditLog = async (id) => {
        if (!editModal || !editForm) return;

        try {
            editForm.reset();
            const attachmentInfo = document.getElementById('currentAttachment');
            if(attachmentInfo) attachmentInfo.innerHTML = ''; 

            const response = await fetch(`/api/interactions/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const log = await response.json();

            // Isi Form
            document.getElementById('editLogId').value = log.id;
            document.getElementById('editType').value = log.type;
            document.getElementById('editNotes').value = log.notes;
            
            const nextActionEl = document.getElementById('editNextAction');
            if(nextActionEl) nextActionEl.value = log.next_action || '';
            
            const dueDateEl = document.getElementById('editDueDate');
            if(dueDateEl) dueDateEl.value = log.due_date || '';
            
            // Info File Lama (Jika ada)
            if (log.attachment && attachmentInfo) {
                attachmentInfo.innerHTML = 
                    `<small class="text-success"><i class="bi bi-file-earmark-check"></i> File saat ini: <a href="/storage/${log.attachment}" target="_blank">Lihat File</a> (Upload baru untuk mengganti)</small>`;
            }

            // Load Klien
            await loadEditClientOptions(log.client_id);
            
            editModal.show();
        } catch (error) {
            console.error(error);
            alert('Gagal memuat data log.');
        }
    };

    // Listener Update (PENTING: Gunakan FormData untuk File Upload)
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editLogId').value;
            const btn = document.getElementById('updateLogBtn');
            
            btn.disabled = true;
            btn.innerHTML = 'Menyimpan...';

            const formData = new FormData(editForm);
            // Laravel butuh method spoofing untuk file upload via PUT
            formData.append('_method', 'PUT');

            try {
                const response = await fetch(`/api/interactions/${id}`, {
                    method: 'POST', // Gunakan POST + _method:PUT
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    editModal.hide();
                    fetchLogs();
                    alert('Log berhasil diperbarui!');
                } else {
                    alert(result.message || 'Gagal update log.');
                }
            } catch (error) {
                console.error(error);
                alert('Error sistem.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Update Log';
            }
        });
    }

    // --- 7. LOGIKA HAPUS LOG ---
    window.deleteLog = async (id) => {
        if (!confirm('Yakin ingin menghapus log interaksi ini? File lampiran juga akan dihapus.')) return;

        try {
            const response = await fetch(`/api/interactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Log dihapus.');
                fetchLogs();
            } else {
                alert('Gagal menghapus log.');
            }
        } catch (error) {
            console.error(error);
            alert('Error sistem.');
        }
    };

    // Jalankan awal
    fetchLogs();
});