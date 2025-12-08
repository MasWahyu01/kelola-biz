import './bootstrap';

// --- SETUP BOOTSTRAP GLOBAL ---
// Import semua fitur Bootstrap dan simpan ke variabel global 'window'
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
// -------------------------

import 'bootstrap-icons/font/bootstrap-icons.css';

// --- LOGIKA GLOBAL USER & RBAC ---
const token = localStorage.getItem('jwt_token');

if (token) {
    fetch('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(user => {
        // 1. Simpan data user ke variabel global
        window.currentUser = user;

        // 2. Update Nama di Navbar (Ganti tulisan "User Admin" jadi Nama User)
        const navName = document.getElementById('navUserName');
        // Jika kamu ingin tulisannya tetap "User" saja, ganti user.name menjadi "User"
        // Tapi lebih keren kalau muncul nama aslinya kan? :)
        if (navName) navName.innerText = user.name; 

        // 3. Proteksi Sidebar (Hapus menu Admin jika bukan admin)
        const adminMenus = document.querySelectorAll('.admin-only');
        if (user.role !== 'admin') {
            adminMenus.forEach(el => el.remove());
        }
        
        // 4. Proteksi Tombol Operasional (Hapus tombol edit/delete jika Viewer)
        // Logika: Jika user BUKAN viewer, maka tombol .restricted-btn dimunculkan
        // (Asumsi di HTML tombol ini default-nya class="d-none")
        if (user.role !== 'viewer') {
            const restrictedBtns = document.querySelectorAll('.restricted-btn');
            restrictedBtns.forEach(el => el.classList.remove('d-none'));
        }

        // 5. Logika Tombol Profile (POPUP MODAL)
        const btnProfile = document.getElementById('btnProfile');
        if (btnProfile) {
            btnProfile.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah link reload halaman
                
                // Isi data ke dalam span di modal
                document.getElementById('profileName').innerText = user.name;
                document.getElementById('profileEmail').innerText = user.email;
                document.getElementById('profileRole').innerText = user.role.toUpperCase();

                // Tampilkan modal menggunakan Bootstrap API
                const profileModalElement = document.getElementById('profileModal');
                const profileModal = new window.bootstrap.Modal(profileModalElement);
                profileModal.show();
            });
        }

        // Trigger event bahwa user sudah siap
        window.dispatchEvent(new Event('user-ready'));
    })
    .catch(error => {
        console.error('Gagal load user:', error);
        // Opsional: Redirect ke login jika token tidak valid
        // window.location.href = '/login'; 
    });
}