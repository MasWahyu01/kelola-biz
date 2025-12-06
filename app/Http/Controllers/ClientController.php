<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate; // <--- 1. IMPORT FACADE GATE

class ClientController extends Controller
{
    /**
     * Tampilkan semua data klien (Aman untuk Viewer, tidak perlu Gate edit).
     */
    public function index(Request $request)
    {
        $query = Client::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $clients = $query->paginate(10);
        
        return response()->json($clients);
    }

    /**
     * Simpan klien baru (Hanya user dengan akses edit).
     */
    public function store(Request $request)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        // Validasi Sederhana
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'type' => 'required|in:VIP,SME,Corporate',
            'status' => 'required|in:active,inactive',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'message' => 'Klien berhasil ditambahkan!',
            'data' => $client
        ], 201);
    }

    /**
     * Tampilkan detail 1 klien (Aman untuk Viewer).
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
     * Update data klien (Hanya user dengan akses edit).
     */
    public function update(Request $request, $id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:clients,email,' . $id,
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
     * Hapus klien (Hanya user dengan akses edit).
     */
    public function destroy($id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Klien dihapus']);
    }
}