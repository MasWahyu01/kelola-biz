# Kelola.Biz - Sistem Informasi Klien & Service Tracking

**Kelola.Biz** adalah aplikasi web berbasis CRM *(Customer Relationship Management)* yang dirancang untuk membantu perusahaan mengelola database klien, memantau progres layanan *(Service Tracking)*, dan merekam riwayat interaksi bisnis secara terpusat.

Sistem ini dibangun menggunakan arsitektur **Monolith Modern** dengan **Laravel 12** sebagai backend core yang kuat dan **Bootstrap 5** untuk antarmuka yang responsif, serta dilengkapi sistem keamanan **RBAC** *(Role-Based Access Control)*.

---

## 🛠️ Teknologi (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi web modern standar industri:

* **Backend:** Laravel 12 (PHP 8.3)
* **Frontend:** Blade Templates, Bootstrap 5 (SASS), Vanilla JS (ES6+)
* **Database:** MySQL 8.0
* **Authentication:** JWT *(JSON Web Token)* via `tymon/jwt-auth`
* **Build Tool:** Vite
* **Features:** Chart.js (Visualisasi Data), Observers (Audit Trail)

---

## 📸 Galeri Aplikasi

Berikut adalah tampilan antarmuka aplikasi.

### 1. Halaman Login
Halaman masuk yang aman dengan validasi JWT.
![Halaman Login](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20210226.png)

### 2. Dashboard Utama
Menampilkan statistik ringkas, grafik komposisi status layanan *(Pie Chart)*, dan tren layanan baru bulanan *(Bar Chart)*.
![Dashboard Admin](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20210941.png)

### 3. Manajemen Klien (Admin/Staff)
Fitur CRUD lengkap untuk mengelola data perusahaan klien dengan fitur pencarian *real-time*.
![Halaman Manajemen Klien](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20211030.png)

### 4. Service Tracking (Pelacakan Layanan)
Memantau status pengerjaan layanan *(New, In Progress, Completed)* lengkap dengan prioritas dan timeline.
![Halaman Service Tracking](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20211103.png)

### 5. Interaction Logs (Riwayat Komunikasi)
Mencatat hasil meeting atau telepon dengan klien. Mendukung **Upload Bukti Foto/Dokumen**.
![Halaman Interaction Logs](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20211131.png)

### 6. Audit Trail / Activity Logs (Super Admin Only)
Fitur "CCTV" sistem yang mencatat siapa melakukan apa, lengkap dengan detail perubahan data *(Before vs After)*.
![Halaman Audit Trail](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20211207.png)

---

## 🛡️ Tampilan Khusus Manager (Role: Viewer)

Sistem ini memiliki proteksi **RBAC**. Jika user login sebagai **Manager**, aplikasi otomatis masuk ke mode **"View Only"**.

* **Tombol Tambah** di pojok kanan atas disembunyikan.
* **Tombol Aksi (Edit & Delete)** di tabel diganti menjadi label "View Only".
* Menu **Activity Logs** di sidebar dihilangkan.

**Bukti Tampilan Manager:**
![Tampilan Klien Mode Manager](https://github.com/MasWahyu01/kelola-biz/blob/master/HasilGambar/Screenshot%202025-12-10%20211755.png)

---

## 🚀 Fitur Unggulan

1.  **Sistem Autentikasi Hibrida:** Menggabungkan kenyamanan sesi web dengan keamanan Token JWT.
2.  **Role-Based Access Control (RBAC):**
    * **Super Admin:** Akses penuh + Audit Log.
    * **Staff Operasional:** Bisa Input/Edit/Hapus data operasional.
    * **Manager/Viewer:** Hanya bisa melihat data (Read-Only).
3.  **Audit Trail System:** Menggunakan *Laravel Observers* untuk memantau integritas data secara otomatis.
4.  **File Upload:** Penyimpanan bukti lampiran interaksi yang aman.
5.  **Auto Backup:** Perintah terminal kustom untuk backup database MySQL ke penyimpanan lokal.

---

## ⚙️ Cara Instalasi (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer Anda:

**1. Clone Repository**
```bash
git clone [https://github.com/MasWahyu01/kelola-biz.git](https://github.com/MasWahyu01/kelola-biz.git)
cd kelola-biz
