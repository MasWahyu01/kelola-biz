<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\ActivityLogController;

// Route untuk Login (Public / Tanpa Token)
Route::post('login', [AuthController::class, 'login']);

// Group Route yang butuh Token JWT (Middleware auth:api)
Route::middleware('auth:api')->group(function () {

    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Route User (Mengambil data user yang sedang login)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route API Resource Klien (Otomatis membuat url index, store, update, destroy)
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('interactions', InteractionController::class);
});