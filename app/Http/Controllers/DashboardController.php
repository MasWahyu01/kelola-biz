<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Service;
use App\Models\InteractionLog;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. KARTU ATAS: Statistik Sederhana
        $totalClients = Client::count();
        $activeServices = Service::whereIn('status', ['new', 'in_progress', 'pending_client'])->count();
        // Menghitung next action yang sudah lewat tanggal (Overdue)
        $overdueActions = InteractionLog::whereNotNull('next_action')
                            ->where('due_date', '<', now())
                            ->count();

        // 2. PIE CHART: Layanan berdasarkan Status
        // Hasil: [{status: 'completed', total: 5}, {status: 'new', total: 2}, ...]
        $serviceStatus = Service::select('status', DB::raw('count(*) as total'))
                            ->groupBy('status')
                            ->get();

        // 3. BAR CHART: Tren Layanan 6 Bulan Terakhir
        // Kita ambil data layanan yang dibuat 6 bulan ke belakang
        $monthlyServices = Service::select(
                                DB::raw('DATE_FORMAT(created_at, "%M") as month'), // Nama Bulan (January, etc)
                                DB::raw('MONTH(created_at) as month_num'),
                                DB::raw('count(*) as total')
                            )
                            ->where('created_at', '>=', now()->subMonths(6))
                            ->groupBy('month', 'month_num')
                            ->orderBy('month_num')
                            ->get();

        // Kirim semua data ke View
        return view('dashboard.index', compact(
            'totalClients', 
            'activeServices', 
            'overdueActions',
            'serviceStatus',
            'monthlyServices'
        ));
    }
}