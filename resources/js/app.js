import './bootstrap';

// --- PERUBAHAN DI SINI ---
// Kita import semua fitur Bootstrap dan simpan ke variabel global 'window'
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
        // Simpan data user ke variabel global agar bisa diakses script lain (clients.js, dll)
        window.currentUser = user;

        // --- PROTEKSI 1: SIDEBAR MENU ---
        // Cari elemen yang khusus Admin
        const adminMenus = document.querySelectorAll('.admin-only');
        
        // Jika bukan admin, hapus elemen tersebut dari layar
        if (user.role !== 'admin') {
            adminMenus.forEach(el => el.remove());
        }

        // Trigger event custom untuk memberitahu script lain bahwa data user sudah siap
        window.dispatchEvent(new Event('user-ready'));
    })
    .catch(error => console.error('Gagal load user:', error));
}