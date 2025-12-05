<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InteractionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // <--- PENTING: Untuk manajemen file

class InteractionController extends Controller
{
    /**
     * Tampilkan log interaksi (Filter per Client).
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
     * Simpan log baru (termasuk upload file).
     */
    public function store(Request $request)
    {
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
            // Fungsi store() otomatis men-generate nama unik agar tidak bentrok
            $path = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $path; // Simpan path-nya ke array data
        }

        $log = InteractionLog::create($validated);

        return response()->json(['message' => 'Log interaksi dicatat', 'data' => $log], 201);
    }

    /**
     * Hapus log & filenya.
     */
    public function destroy($id)
    {
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