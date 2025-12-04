document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('clientTableBody');

    // Fungsi Fetch Data Klien
    async function fetchClients() {
        try {
            const response = await fetch('/api/clients', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');

            const data = await response.json();
            renderTable(data.data); // Laravel pagination membungkus data dalam properti .data

        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal memuat data. Pastikan Anda login.</td></tr>`;
        }
    }

    // Fungsi Render Tabel
    function renderTable(clients) {
        tableBody.innerHTML = '';
        
        if (clients.length === 0) {
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
                    
                    // --- PERUBAHAN: Cara menutup modal yang lebih aman ---
                    // Kita cari tombol "X" (close) di dalam modal, lalu kita klik secara programatis
                    const closeBtn = document.querySelector('#createClientModal .btn-close');
                    if (closeBtn) closeBtn.click();
                    // ----------------------------------------------------

                    // Refresh tabel
                    fetchClients();
                    
                    // Opsional: Ganti alert standar dengan SweetAlert nanti jika mau, 
                    // tapi alert bawaan browser cukup untuk debug.
                    alert('Klien berhasil ditambahkan!'); 
                } else {
                    // 5. Gagal Validasi: Tampilkan Error
                    // Jika error validasi Laravel (422)
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

    // Jalankan saat halaman dimuat
    fetchClients();
});