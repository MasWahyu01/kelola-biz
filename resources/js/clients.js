document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');
    const searchInput = document.getElementById('searchInput'); // Ambil elemen input search

    // --- FUNGSI FETCH DATA KLIEN (UPDATE: Support Pagination & Search) ---
    async function fetchClients(url = '/api/clients') {
        // 1. Ambil kata kunci pencarian
        const search = searchInput ? searchInput.value : '';

        // 2. Manipulasi URL untuk menyertakan search query
        // Kita gunakan URL object agar aman menggabungkan parameter page & search
        const urlObj = new URL(url, window.location.origin);
        
        if (search) {
            // Jika ada pencarian, tambahkan ?search=... ke URL
            urlObj.searchParams.set('search', search);
        }

        try {
            // Tampilkan loading saat proses fetch
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>`;

            const response = await fetch(urlObj.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');

            const result = await response.json();
            
            // Render baris tabel
            renderTable(result.data);
            
            // Render tombol navigasi halaman
            renderPagination(result); 

        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal memuat data. Pastikan Anda login.</td></tr>`;
        }
    }

    // --- LOGIKA PENCARIAN (DEBOUNCE) ---
    // Agar tidak request ke server setiap kali satu huruf diketik
    let timeout = null;
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Hapus timer sebelumnya jika user masih mengetik
            clearTimeout(timeout);
            
            // Tunggu 500ms setelah user berhenti mengetik, baru cari
            timeout = setTimeout(() => {
                // Reset ke halaman 1 (/api/clients) dengan kata kunci baru
                fetchClients('/api/clients'); 
            }, 500);
        });
    }

    // --- FUNGSI RENDER PAGINATION ---
    function renderPagination(result) {
        const container = document.getElementById('paginationContainer');
        
        if (!container) return; 

        container.innerHTML = '';

        // Tombol Previous
        const prevDisabled = result.prev_page_url ? '' : 'disabled';
        const prevBtn = `
            <li class="page-item ${prevDisabled}">
                <button class="page-link" onclick="window.loadPage('${result.prev_page_url}')" ${prevDisabled}>Previous</button>
            </li>
        `;

        // Info Halaman
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

    // --- HELPER GLOBAL ---
    window.loadPage = (url) => {
        if (url && url !== 'null') {
            fetchClients(url);
        }
    };

    // --- FUNGSI RENDER TABEL ---
    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        if (!clients || clients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Data tidak ditemukan.</td></tr>`;
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
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="window.openEditModal(${client.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.deleteClient(${client.id})">
                        <i class="bi bi-trash"></i>
                    </button>
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

            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Menyimpan...';
            formAlert.innerHTML = '';

            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData.entries());

            try {
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
                    createForm.reset();
                    
                    const closeBtn = document.querySelector('#createClientModal .btn-close');
                    if (closeBtn) closeBtn.click();

                    // Refresh tabel (pencarian juga akan terbawa jika ada input text)
                    fetchClients();
                    
                    alert('Klien berhasil ditambahkan!'); 
                } else {
                    if (result.message) {
                        formAlert.innerHTML = `<div class="alert alert-danger p-2">${result.message}</div>`;
                    }
                }

            } catch (error) {
                console.error(error);
                formAlert.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan sistem.</div>`;
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Simpan';
            }
        });
    }

    // Jalankan fetch pertama kali saat halaman dimuat
    fetchClients();
});