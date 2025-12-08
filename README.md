# Kelola.Biz - Client Information & Service Tracking System

Kelola.Biz adalah sistem manajemen hubungan pelanggan (CRM) sederhana namun powerful yang dibangun menggunakan **Laravel 12** dan **Bootstrap 5**. Sistem ini dirancang untuk membantu perusahaan skala menengah dalam mengelola data klien, melacak status layanan, serta merekam riwayat komunikasi bisnis secara terpusat dan aman.

![Dashboard Preview](https://placehold.co/800x400?text=Dashboard+Kelola.Biz+Preview) 
*(Ganti link di atas dengan screenshot dashboard asli Anda nanti)*

## 🚀 Fitur Utama

- **Dashboard Interaktif**: Statistik real-time, grafik tren layanan (Chart.js), dan notifikasi *overdue*.
- **Manajemen Klien**: Database klien lengkap dengan pencarian instan dan filter status.
- **Service Tracking**: Pelacakan status layanan (New, In Progress, Completed) dengan prioritas dan timeline.
- **Interaction Logs**: Riwayat komunikasi (Telepon, WA, Meeting) dengan dukungan **Upload Lampiran** (Bukti Chat/Dokumen).
- **Role-Based Access Control (RBAC)**:
  - **Super Admin**: Akses penuh termasuk melihat Audit Log.
  - **Staff Operasional**: Mengelola data klien dan layanan.
  - **Viewer/Manager**: Hanya bisa melihat data (Read-only), tombol aksi disembunyikan.
- **Audit Trail**: Pencatatan aktivitas sistem otomatis (Siapa mengubah apa) menggunakan Laravel Observers.
- **Database Backup**: Perintah kustom CLI untuk backup database lokal.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Laravel 12 (PHP 8.3+)
- **Frontend**: Blade, Bootstrap 5, SASS, Vite
- **Database**: MySQL
- **Auth**: JWT (JSON Web Token) via `tymon/jwt-auth`
- **Charts**: Chart.js
- **Icons**: Bootstrap Icons

## ⚙️ Persyaratan Sistem

Pastikan komputer Anda sudah terinstal:
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

## 📥 Cara Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username-anda/kelola-biz.git](https://github.com/username-anda/kelola-biz.git)
   cd kelola-biz
