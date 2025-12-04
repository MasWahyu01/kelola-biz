document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const alertContainer = document.getElementById('alert-container');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah reload halaman

        // 1. Reset State (Hapus error lama & disable tombol)
        alertContainer.innerHTML = '';
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

        // 2. Ambil data form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // 3. Kirim Request ke API Backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // 4. Cek Hasil
            if (response.ok) {
                // SUKSES: Simpan Token & Redirect
                localStorage.setItem('jwt_token', data.access_token);
                
                // Tampilkan pesan sukses sebentar
                alertContainer.innerHTML = `<div class="alert alert-success">Login Berhasil! Mengalihkan...</div>`;
                
                setTimeout(() => {
                    window.location.href = '/dashboard'; // Kita akan buat halaman ini nanti
                }, 1000);

            } else {
                // GAGAL: Tampilkan Error
                throw new Error(data.error || 'Login gagal. Periksa email/password.');
            }

        } catch (error) {
            // Handle Error Koneksi atau Validasi
            alertContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            btnLogin.disabled = false;
            btnLogin.innerText = 'Sign In';
        }
    });
});