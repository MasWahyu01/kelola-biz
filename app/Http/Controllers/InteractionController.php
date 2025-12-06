<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InteractionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Untuk manajemen file
use Illuminate\Support\Facades\Gate;    // <--- 1. IMPORT FACADE GATE

class InteractionController extends Controller
{
    /**
     * Tampilkan log interaksi (Aman untuk Viewer, tanpa Gate).
     */
    public function index(Request $request)
    {
        $query = InteractionLog::with('client:id,name');

        // Filter berdasarkan Client ID
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Urutkan dari yang terbaru
        $logs = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($logs);
    }

    /**
     * Simpan log baru (Hanya user dengan akses edit).
     */
    public function store(Request $request)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'type' => 'required|in:call,email,meeting,whatsapp,other',
            'notes' => 'required|string',
            'next_action' => 'nullable|string|max:255',
            'due_date' => 'nullable|date|after_or_equal:today',
            // Validasi File: Wajib Gambar/PDF, Maks 2MB
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048', 
        ]);

        // --- LOGIKA UPLOAD FILE ---
        if ($request->hasFile('attachment')) {
            // Simpan ke folder 'storage/app/public/attachments'
            $path = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $path; 
        }

        $log = InteractionLog::create($validated);

        return response()->json(['message' => 'Log interaksi dicatat', 'data' => $log], 201);
    }

    /**
     * Tampilkan detail 1 log (Aman untuk Viewer, tanpa Gate).
     */
    public function show($id)
    {
        $log = InteractionLog::find($id);

        if (!$log) {
            return response()->json(['message' => 'Log not found'], 404);
        }

        return response()->json($log);
    }

    /**
     * Update log interaksi (Hanya user dengan akses edit).
     */
    public function update(Request $request, $id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $log = InteractionLog::find($id);

        if (!$log) {
            return response()->json(['message' => 'Log not found'], 404);
        }

        // Validasi input (gunakan 'sometimes' agar tidak wajib diisi semua ulang)
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'type' => 'sometimes|required|in:call,email,meeting,whatsapp,other',
            'notes' => 'sometimes|required|string',
            'next_action' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ]);

        // Cek jika user mengupload file baru pengganti
        if ($request->hasFile('attachment')) {
            // 1. Hapus file lama fisik dari server (agar tidak menumpuk sampah)
            if ($log->attachment) {
                Storage::disk('public')->delete($log->attachment);
            }
            // 2. Simpan file baru
            $path = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $path;
        }

        $log->update($validated);

        return response()->json(['message' => 'Log updated', 'data' => $log]);
    }

    /**
     * Hapus log & filenya (Hanya user dengan akses edit).
     */
    public function destroy($id)
    {
        Gate::authorize('can-edit'); // <--- SATPAM: Cek izin

        $log = InteractionLog::find($id);

        if (!$log) {
            return response()->json(['message' => 'Log not found'], 404);
        }

        // --- LOGIKA HAPUS FILE FISIK ---
        if ($log->attachment) {
            // Cek apakah file ada, lalu hapus dari penyimpanan server
            Storage::disk('public')->delete($log->attachment);
        }

        $log->delete();

        return response()->json(['message' => 'Log dihapus']);
    }
}