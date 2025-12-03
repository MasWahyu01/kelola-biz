<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // <--- Import Controller Anda

// Route untuk Login (Public / Tanpa Token)
Route::post('login', [AuthController::class, 'login']);

// Contoh Route yang diproteksi (Hanya bisa diakses jika punya Token)
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});