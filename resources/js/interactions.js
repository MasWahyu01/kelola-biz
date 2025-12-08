import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('logTableBody');
    const paginationContainer = document.getElementById('paginationContainer');

    // ==========================================
    // FUNGSI GLOBAL
    // ==========================================

    // Helper: Load Klien Edit
    async function loadEditClientOptions(selectedId) {
        const select = document.getElementById('editClientSelect');
        if(!select) return;

        if (select.options.length <= 1) {
            try {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` } });
                const result = await response.json();
                select.innerHTML = '<option value="">-- Pilih Klien --</option>';
                result.data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.name;
                    select.appendChild(option);
                });
            } catch (e) { console.error(e); }
        }
        select.value = selectedId;
    }

    // FUNGSI 1: Buka Modal Edit
    window.openEditLog = async (id) => {
        console.log('Edit Log diklik ID:', id);

        try {
            document.getElementById('editLogForm').reset();
            document.getElementById('currentAttachment').innerHTML = '';

            const response = await fetch(`/api/interactions/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const log = await response.json();

            // Isi Form
            document.getElementById('editLogId').value = log.id;
            document.getElementById('editType').value = log.type;
            document.getElementById('editNotes').value = log.notes;
            document.getElementById('editNextAction').value = log.next_action || '';
            document.getElementById('editDueDate').value = log.due_date || '';

            // Info File Lama
            if (log.attachment) {
                document.getElementById('currentAttachment').innerHTML = 
                    `<small>File saat ini: <a href="/storage/${log.attachment}" target="_blank">Lihat File</a></small>`;
            }

            // Load Klien
            await loadEditClientOptions(log.client_id);

            // Show Modal
            const modal = new bootstrap.Modal(document.getElementById('editLogModal'));
            modal.show();
        } catch (error) {
            console.error(error);
            alert('Gagal load log.');
        }
    };

    // FUNGSI 2: Hapus Log
    window.deleteLog = async (id) => {
        console.log('Delete Log diklik ID:', id);
        if (!confirm('Yakin ingin menghapus log ini?')) return;

        try {
            const response = await fetch(`/api/interactions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Log dihapus.');
                fetchLogs();
            } else { alert('Gagal hapus.'); }
        } catch (error) { console.error(error); }
    };

    // FUNGSI 3: Paging
    window.loadPage = (url) => { if (url && url !== 'null') fetchLogs(url); };


    // ==========================================
    // LOGIKA UTAMA
    // ==========================================

    async function fetchLogs(url = '/api/interactions') {
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            const result = await response.json();
            renderTable(result.data);
            renderPagination(result);
        } catch (error) { console.error(error); }
    }

    function renderTable(logs) {
        tableBody.innerHTML = '';
        const user = window.currentUser;

        const icons = {
            'call': '<i class="bi bi-telephone text-primary"></i>',
            'email': '<i class="bi bi-envelope text-warning"></i>',
            'meeting': '<i class="bi bi-people-fill text-success"></i>',
            'whatsapp': '<i class="bi bi-whatsapp text-success"></i>',
            'other': '<i class="bi bi-journal-text text-secondary"></i>'
        };

        logs.forEach((log, index) => {
            let actionButtons = '';
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openEditLog(${log.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLog(${log.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            } else {
                actionButtons = `<span class="badge bg-secondary">View Only</span>`;
            }

            let attachmentBtn = log.attachment ? `<a href="/storage/${log.attachment}" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="bi bi-paperclip"></i> Lihat</a>` : '-';
            let nextAction = log.next_action ? `<div class="fw-bold">${log.next_action}</div><small class="text-danger">Due: ${log.due_date}</small>` : '-';

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${log.client ? log.client.name : 'Unknown'}</div>
                        <small class="text-muted">${log.created_at.substring(0, 10)}</small>
                    </td>
                    <td><div class="d-flex align-items-center gap-2">${icons[log.type] || ''} <span class="text-capitalize">${log.type}</span></div></td>
                    <td>${log.notes}</td>
                    <td>${nextAction}</td>
                    <td>${attachmentBtn}</td>
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
    fetchLogs();
    
    window.addEventListener('user-ready', () => {
        console.log('User detected (Logs), refreshing...');
        fetchLogs();
    });

    // --- FORM LISTENERS ---

    // 1. Create Modal Load Clients
    const createModalEl = document.getElementById('createLogModal');
    if(createModalEl) {
        createModalEl.addEventListener('show.bs.modal', async () => {
            const select = document.getElementById('clientSelect');
            if(select.options.length <= 1) {
                const response = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` } });
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
    const createForm = document.getElementById('createLogForm');
    if(createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createForm);
            try {
                const res = await fetch('/api/interactions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                    body: formData
                });
                if(res.ok) {
                    bootstrap.Modal.getInstance(createModalEl).hide();
                    createForm.reset();
                    fetchLogs();
                    alert('Log dicatat!');
                } else { alert('Gagal catat'); }
            } catch(e) { console.error(e); }
        });
    }

    // 3. Submit Update (Upload File via POST + _method:PUT)
    const editForm = document.getElementById('editLogForm');
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editLogId').value;
            const formData = new FormData(editForm);
            // Form HTML sudah punya <input name="_method" value="PUT"> kan?
            // Kalau belum yakin, kita append manual saja biar aman:
            formData.append('_method', 'PUT');

            try {
                const res = await fetch(`/api/interactions/${id}`, {
                    method: 'POST', // POST untuk Upload File
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                    body: formData
                });
                if(res.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('editLogModal')).hide();
                    fetchLogs();
                    alert('Log diupdate!');
                } else { alert('Gagal update'); }
            } catch(e) { console.error(e); }
        });
    }
});