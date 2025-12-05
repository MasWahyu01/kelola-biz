@extends('layouts.app')

@section('title', 'Interaction Logs')

@section('content')
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="m-0 fw-bold text-primary">Riwayat Interaksi</h5>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createLogModal">
                <i class="bi bi-plus-lg"></i> Catat Log Baru
            </button>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Klien & Tanggal</th>
                            <th>Tipe</th>
                            <th>Catatan</th>
                            <th>Next Action</th>
                            <th>Lampiran</th>
                        </tr>
                    </thead>
                    <tbody id="logTableBody">
                        </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white py-3">
             <nav><ul class="pagination justify-content-end mb-0" id="paginationContainer"></ul></nav>
        </div>
    </div>
    
    <div class="modal fade" id="createLogModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-body">Form soon...</div></div></div></div>

    @vite('resources/js/interactions.js')
@endsection