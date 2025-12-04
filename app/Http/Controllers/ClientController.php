<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Tampilkan semua data klien (dengan pagination dan filter pencarian).
     */
    public function index(Request $request)
    {
        $query = Client::latest();

        // Jika ada parameter pencarian (misal: /api/clients?search=budi)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Tetap gunakan pagination (10 per halaman)
        // Hasil pencarian akan otomatis ter-paginate juga
        $clients = $query->paginate(10);
        
        return response()->json($clients);
    }

    /**
     * Simpan klien baru.
     */
    public function store(Request $request)
    {
        // Validasi Sederhana
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'type' => 'required|in:VIP,SME,Corporate', // Sesuai Enum di database
            'status' => 'required|in:active,inactive',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'message' => 'Klien berhasil ditambahkan!',
            'data' => $client
        ], 201);
    }

    /**
     * Tampilkan detail 1 klien.
     */
    public function show($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        return response()->json($client);
    }

    /**
     * Update data klien.
     */
    public function update(Request $request, $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:clients,email,' . $id, // Pengecualian ID sendiri
            'phone' => 'nullable|string|max:20',
            'type' => 'sometimes|required|in:VIP,SME,Corporate',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        $client->update($validated);

        return response()->json([
            'message' => 'Data klien diperbarui',
            'data' => $client
        ]);
    }

    /**
     * Hapus klien.
     */
    public function destroy($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Klien dihapus']);
    }
}