import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('activityTableBody');

    // --- 1. FETCH LOGS ---
    async function fetchLogs(url = '/api/activity-logs') {
        try {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' 
                }
            });

            const result = await response.json();
            renderTable(result.data);
            renderPagination(result);

        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal memuat data.</td></tr>`;
        }
    }

    // --- 2. RENDER TABLE ---
    function renderTable(logs) {
        tableBody.innerHTML = '';

        if (logs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Belum ada aktivitas terekam.</td></tr>`;
            return;
        }

        logs.forEach((log, index) => {
            // Tentukan warna badge aksi
            let badgeClass = 'bg-secondary';
            if (log.action === 'created') badgeClass = 'bg-success';
            else if (log.action === 'updated') badgeClass = 'bg-primary';
            else if (log.action === 'deleted') badgeClass = 'bg-danger';

            // Bersihkan nama Subject (misal: App\Models\Client -> Client)
            const subjectName = log.subject_type ? log.subject_type.split('\\').pop() : '-';

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${log.user ? log.user.name : 'Sistem'}</div>
                        <small class="text-muted">${log.created_at.substring(0, 16).replace('T', ' ')}</small>
                    </td>
                    <td>
                        <span class="badge ${badgeClass} text-uppercase">${log.action}</span>
                    </td>
                    <td>
                        <div class="fw-bold">${log.description}</div>
                        <small class="text-muted">ID: ${log.subject_id} (${subjectName})</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick='window.showDetail(${JSON.stringify(log.properties)})'>
                            <i class="bi bi-eye"></i> Detail
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

// --- 3. SHOW DETAIL (FORMATTER PINTAR) ---
    const detailModalEl = document.getElementById('detailModal');
    const detailModal = new bootstrap.Modal(detailModalEl);
    const detailContent = document.getElementById('detailContent');

    window.showDetail = (properties) => {
        if (!properties) {
            detailContent.innerHTML = '<p class="text-muted">Tidak ada data properti tambahan.</p>';
        } else {
            // 1. Parse JSON jika perlu
            const data = typeof properties === 'string' ? JSON.parse(properties) : properties;
            
            let html = '';

            // 2. Cek Tipe Data: Apakah ini Update (Ada 'old' dan 'new')?
            if (data.old && data.new) {
                // TAMPILAN PERBANDINGAN (BEFORE vs AFTER)
                html += `
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th width="30%">Kolom</th>
                                    <th width="35%" class="text-danger">Sebelum (Old)</th>
                                    <th width="35%" class="text-success">Sesudah (New)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                // Loop hanya key yang ada di data baru
                for (const key in data.new) {
                    html += `
                        <tr>
                            <td class="fw-bold">${key}</td>
                            <td class="text-muted">${data.old[key] || '-'}</td>
                            <td class="fw-bold text-dark">${data.new[key]}</td>
                        </tr>
                    `;
                }
                html += '</tbody></table></div>';

            } else {
                // TAMPILAN LIST BIASA (CREATE / DELETE)
                html += `
                    <div class="table-responsive">
                        <table class="table table-striped table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th width="40%">Nama Kolom</th>
                                    <th>Nilai Data</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                for (const [key, value] of Object.entries(data)) {
                    // Abaikan kolom teknis seperti created_at/updated_at agar lebih bersih
                    if (key === 'created_at' || key === 'updated_at' || key === 'id') continue;

                    html += `
                        <tr>
                            <td class="fw-bold">${key}</td>
                            <td>${value}</td>
                        </tr>
                    `;
                }
                html += '</tbody></table></div>';
            }

            detailContent.innerHTML = html;
        }
        detailModal.show();
    };

    // --- 4. PAGINATION ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        if(!container) return;
        container.innerHTML = '';
        const prevBtn = `<li class="page-item ${!result.prev_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.prev_page_url}')">Prev</button></li>`;
        const nextBtn = `<li class="page-item ${!result.next_page_url ? 'disabled' : ''}"><button class="page-link" onclick="window.loadPage('${result.next_page_url}')">Next</button></li>`;
        container.innerHTML = prevBtn + nextBtn;
    }
    window.loadPage = (url) => { if (url && url !== 'null') fetchLogs(url); };

    fetchLogs();
});