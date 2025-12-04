document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');

    // --- FUNGSI FETCH DATA KLIEN (UPDATE: Support Pagination) ---
    async function fetchClients(url = '/api/clients') {
        try {
            // Tampilkan loading saat pindah halaman
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');

            const result = await response.json();
            
            // Laravel Paginate mengembalikan structure: { data: [...], links: {...}, meta: {...} }
            // Kita render baris tabel
            renderTable(result.data);
            
            // Kita render tombol navigasi halaman
            renderPagination(result); 

        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal memuat data. Pastikan Anda login.</td></tr>`;
        }
    }

    // --- FUNGSI RENDER PAGINATION (BARU) ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        
        // Pastikan container pagination ada di HTML kamu sebelum diisi
        if (!container) return; 

        container.innerHTML = '';

        // Tombol Previous
        const prevDisabled = result.prev_page_url ? '' : 'disabled';
        const prevBtn = `
            <li class="page-item ${prevDisabled}">
                <button class="page-link" onclick="window.loadPage('${result.prev_page_url}')" ${prevDisabled}>Previous</button>
            </li>
        `;

        // Info Halaman (Contoh: "Page 1 of 5")
        // Catatan: result.last_page kadang null jika data sedikit, kita handle safe check
        const lastPage = result.last_page || 1; 
        const info = `
            <li class="page-item disabled">
                <span class="page-link text-dark">Page ${result.current_page} of ${lastPage}</span>
            </li>
        `;

        // Tombol Next
        const nextDisabled = result.next_page_url ? '' : 'disabled';
        const nextBtn = `
            <li class="page-item ${nextDisabled}">
                <button class="page-link" onclick="window.loadPage('${result.next_page_url}')" ${nextDisabled}>Next</button>
            </li>
        `;

        container.innerHTML = prevBtn + info + nextBtn;
    }

    // --- HELPER GLOBAL (Agar bisa dipanggil via onclick HTML) ---
    window.loadPage = (url) => {
        if (url && url !== 'null') {
            fetchClients(url);
        }
    };

    // --- FUNGSI RENDER TABEL ---
    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        if (!clients || clients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Belum ada data klien.</td></tr>`;
            return;
        }

        clients.forEach((client, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="fw-bold">${client.name}</div>
                        <small class="text-muted">${client.email}</small>
                    </td>
                    <td>${client.phone || '-'}</td>
                    <td>
                        <span class="badge bg-${client.type === 'VIP' ? 'warning' : 'info'}">
                            ${client.type}
                        </span>
                    </td>
                    <td>
                        <span class="badge bg-${client.status === 'active' ? 'success' : 'secondary'}">
                            ${client.status}
                        </span>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // --- LOGIKA TAMBAH KLIEN ---
    const createForm = document.getElementById('createClientForm');
    const formAlert = document.getElementById('formAlertContainer');
    const saveBtn = document.getElementById('saveBtn');

    if (createForm) { 
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. UI Loading State
            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Menyimpan...';
            formAlert.innerHTML = '';

            // 2. Ambil Data Form
            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // 3. Kirim ke API
                const response = await fetch('/api/clients', {
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
                    // 4. Sukses: Tutup Modal, Reset Form, Refresh Tabel
                    createForm.reset();
                    
                    const closeBtn = document.querySelector('#createClientModal .btn-close');
                    if (closeBtn) closeBtn.click();

                    // Refresh tabel (kembali ke halaman 1 atau refresh data)
                    fetchClients();
                    
                    alert('Klien berhasil ditambahkan!'); 
                } else {
                    // 5. Gagal Validasi
                    if (result.message) {
                        formAlert.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    }
                }

            } catch (error) {
                console.error(error);
                formAlert.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan sistem.</div>`;
            } finally {
                // 6. Reset Tombol
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Simpan';
            }
        });
    }

    // Jalankan saat halaman dimuat (Load halaman 1)
    fetchClients();
});