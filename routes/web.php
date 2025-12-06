<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController; // Import controller ditambahkan

// Halaman Login (Hanya Tampilan)
Route::view('/login', 'auth.login')->name('login');
Route::view('/services', 'services.index')->name('services.index');
Route::view('/interactions', 'interactions.index')->name('interactions.index');
Route::view('/activity-logs', 'activity_logs.index')->name('activity_logs.index');

// Rute Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::view('/clients', 'clients.index')->name('clients.index');

// Redirect halaman utama ke login sementara waktu
Route::get('/', function () {
    return redirect()->route('login');
});