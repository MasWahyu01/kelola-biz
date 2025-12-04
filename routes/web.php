<?php

use Illuminate\Support\Facades\Route;

// Halaman Login (Hanya Tampilan)
Route::view('/login', 'auth.login')->name('login');

// Redirect halaman utama ke login sementara waktu
Route::get('/', function () {
    return redirect()->route('login');
});