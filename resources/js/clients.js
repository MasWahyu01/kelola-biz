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

    // Jalankan saat halaman dimuat
    fetchClients();
});