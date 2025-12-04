@extends('layouts.app')

@section('title', 'Service Tracking')

@section('content')
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="m-0 fw-bold text-primary">Daftar Layanan</h5>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createServiceModal">
                <i class="bi bi-plus-lg"></i> Buat Layanan
            </button>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Layanan & Klien</th>
                            <th>PIC</th>
                            <th>Prioritas</th>
                            <th>Status</th>
                            <th>Timeline</th>
                        </tr>
                    </thead>
                    <tbody id="serviceTableBody">
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white py-3">
            <nav>
                <ul class="pagination justify-content-end mb-0" id="paginationContainer"></ul>
            </nav>
        </div>
    </div>

    <div class="modal fade" id="createServiceModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">Form soon...</div>
            </div>
        </div>
    </div>

    @vite('resources/js/services.js')
@endsection