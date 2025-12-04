<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController; // Import controller ditambahkan

// Halaman Login (Hanya Tampilan)
Route::view('/login', 'auth.login')->name('login');

// Rute Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::view('/clients', 'clients.index')->name('clients.index');

// Redirect halaman utama ke login sementara waktu
Route::get('/', function () {
    return redirect()->route('login');
});