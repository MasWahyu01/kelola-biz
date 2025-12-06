import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('logTableBody');

    // --- 1. FETCH LOGS ---
    async function fetchLogs(url = '/api/interactions') {
        try {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('Gagal mengambil data');
            const result = await response.json();
            renderTable(result.data);
            renderPagination(result);
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. RENDER TABLE (UPDATED RBAC) ---
    function renderTable(logs) {
        tableBody.innerHTML = '';
        if (logs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center">Belum ada riwayat interaksi.</td></tr>`;
            return;
        }

        const user = window.currentUser; // Ambil user global

        logs.forEach((log, index) => {
            const icons = {
                'call': '<i class="bi bi-telephone text-primary"></i>',
                'email': '<i class="bi bi-envelope text-warning"></i>',
                'meeting': '<i class="bi bi-people-fill text-success"></i>',
                'whatsapp': '<i class="bi bi-whatsapp text-success"></i>',
                'other': '<i class="bi bi-journal-text text-secondary"></i>'
            };

            let attachmentBtn = log.attachment 
                ? `<a href="/storage/${log.attachment}" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="bi bi-paperclip"></i> File</a>` 
                : '-';

            let nextAction = log.next_action 
                ? `<div class="fw-bold">${log.next_action}</div><small class="text-danger">Due: ${log.due_date || 'N/A'}</small>` 
                : '-';

            // LOGIKA IZIN AKSES BARU
            let actionButtons = '';
            if (user && user.role !== 'viewer') {
                actionButtons = `
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openEditLog(${log.id})" title="Edit"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLog(${log.id})" title="Hapus"><i class="bi bi-trash"></i></button>
                    </div>
                `;
            } else {
                actionButtons = `<span class="text-muted fst-italic" style="font-size: 0.85rem;">View Only</span>`;
            }

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

    // --- 3. PAGINATION ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if(!container) return;
        container.innerHTML = `
            <li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>
            <li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>
        `;
    }
    window.loadPage = (url) => { if (url && url !== 'null') fetchLogs(url); };

    // --- BAGIAN CRUD (CREATE, EDIT, DELETE) TETAP SAMA ---
    // (Pertahankan kode logika Create, Edit, Load Client Options, Delete dari file interactions.js sebelumnya)
    // ... 
    
    // Pastikan definisi window.openEditLog, window.deleteLog, dan event listener form submit ada.
    const editModalEl = document.getElementById('editLogModal');
    let editModal;
    if (editModalEl) editModal = new bootstrap.Modal(editModalEl);
    
    const editForm = document.getElementById('editLogForm');
    const editClientSelect = document.getElementById('editClientSelect');
    
    // Helper: Load Klien untuk Edit
    async function loadEditClientOptions(selectedId) { /* ... code ... */ }
    window.openEditLog = async (id) => { /* ... code ... */ };
    if (editForm) { /* ... listener submit edit ... */ }
    window.deleteLog = async (id) => { /* ... code ... */ };
    
    // Kode untuk Create Log (Listener show modal & submit) juga tetap dipertahankan
    // ...

    // --- EKSEKUSI PERTAMA KALI (UPDATED ASYNC WAIT) ---
    if (window.currentUser) {
        fetchLogs();
    } else {
        window.addEventListener('user-ready', () => {
            fetchLogs();
        });
    }
});