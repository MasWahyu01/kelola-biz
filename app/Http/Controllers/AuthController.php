<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        // Ambil hanya email dan password dari request yang sudah divalidasi
        $credentials = $request->only('email', 'password');

        // Coba login menggunakan guard 'api'
        // method attempt() otomatis mengecek password hash
        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Jika berhasil, kembalikan struktur token
        return $this->respondWithToken($token);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            // Mengambil waktu kadaluarsa dari konfigurasi JWT (default 60 menit)
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}