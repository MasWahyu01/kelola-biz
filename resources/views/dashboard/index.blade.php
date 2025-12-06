@extends('layouts.app')

@section('title', 'Dashboard Utama')

@section('content')
    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 p-3 rounded me-3">
                        <i class="bi bi-people fs-3 text-primary"></i>
                    </div>
                    <div>
                        <h6 class="text-muted text-uppercase mb-1">Total Klien</h6>
                        <h2 class="fw-bold text-dark m-0">{{ $totalClients }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-warning bg-opacity-10 p-3 rounded me-3">
                        <i class="bi bi-gear-wide-connected fs-3 text-warning"></i>
                    </div>
                    <div>
                        <h6 class="text-muted text-uppercase mb-1">Layanan Aktif</h6>
                        <h2 class="fw-bold text-dark m-0">{{ $activeServices }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-danger bg-opacity-10 p-3 rounded me-3">
                        <i class="bi bi-exclamation-triangle fs-3 text-danger"></i>
                    </div>
                    <div>
                        <h6 class="text-muted text-uppercase mb-1">Action Overdue</h6>
                        <h2 class="fw-bold text-danger m-0">{{ $overdueActions }}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-4 mb-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white py-3">
                    <h6 class="m-0 fw-bold">Komposisi Status Layanan</h6>
                </div>
                <div class="card-body">
                    <canvas id="statusChart" style="max-height: 300px;"></canvas>
                </div>
            </div>
        </div>

        <div class="col-md-8 mb-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white py-3">
                    <h6 class="m-0 fw-bold">Tren Layanan Baru (6 Bulan Terakhir)</h6>
                </div>
                <div class="card-body">
                    <canvas id="trendChart" style="max-height: 300px;"></canvas>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Kita simpan data PHP ke variabel global JS agar bisa dibaca file dashboard.js
        window.dashboardData = {
            status: @json($serviceStatus),
            monthly: @json($monthlyServices)
        };
    </script>

    @vite('resources/js/dashboard.js')
@endsection