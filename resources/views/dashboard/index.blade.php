@extends('layouts.app')

@section('title', 'Dashboard Utama')

@section('content')
    <div class="row">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h6 class="text-muted text-uppercase">Total Klien</h6>
                    <h2 class="fw-bold text-primary">0</h2>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h6 class="text-muted text-uppercase">Layanan Aktif</h6>
                    <h2 class="fw-bold text-warning">0</h2>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h6 class="text-muted text-uppercase">Action Overdue</h6>
                    <h2 class="fw-bold text-danger">0</h2>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-sm">
        <div class="card-body">
            <h5>Selamat Datang, Admin!</h5>
            <p class="text-muted">Sistem siap digunakan. Pilih menu di sebelah kiri untuk memulai pengelolaan.</p>
        </div>
    </div>
@endsection