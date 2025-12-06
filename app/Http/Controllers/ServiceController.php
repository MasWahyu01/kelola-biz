<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate; // <--- 1. IMPORT FACADE GATE

class ServiceController extends Controller
{
    /**
     * Tampilkan layanan (Aman untuk Viewer, tanpa Gate).
     */
    public function index(Request $request)
    {
        // Mulai query dan "bawa" data client-nya sekalian (Eager Loading)
        $query = Service::with('client:id,name'); // Kita hanya butuh ID dan Nama klien

        // Jika ada request ?client_id=1, filter datanya
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Urutkan dari yang terbaru (tanggal mulai)
        $services = $query->orderBy('start_date', 'desc')->paginate(10);

        return response()->json($services);
    }

    /**
     * Buat layanan baru (Hanya user dengan akses edit).
     */
    public function store(Request $request)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id', // Pastikan kliennya ada
            'service_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pic' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:new,in_progress,pending_client,completed,cancelled',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Layanan berhasil dibuat',
            'data' => $service
        ], 201);
    }

    /**
     * Tampilkan detail 1 layanan (Aman untuk Viewer, tanpa Gate).
     */
    public function show($id)
    {
        // Cari service beserta data klien lengkapnya
        $service = Service::with('client')->find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    /**
     * Update layanan (Hanya user dengan akses edit).
     */
    public function update(Request $request, $id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $validated = $request->validate([
            'service_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'pic' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'sometimes|required|in:low,medium,high',
            'status' => 'sometimes|required|in:new,in_progress,pending_client,completed,cancelled',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Layanan diperbarui',
            'data' => $service
        ]);
    }

    /**
     * Hapus layanan (Hanya user dengan akses edit).
     */
    public function destroy($id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json(['message' => 'Layanan dihapus']);
    }
}