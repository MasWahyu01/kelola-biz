@extends('layouts.app')

@section('title', 'Manajemen Klien')

@section('content')
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="m-0 fw-bold text-primary">Daftar Klien</h5>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createClientModal">
                <i class="bi bi-plus-lg"></i> Tambah Klien
            </button>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th style="width: 5%">#</th>
                            <th style="width: 30%">Nama & Email</th>
                            <th style="width: 20%">Telepon</th>
                            <th style="width: 15%">Tipe</th>
                            <th style="width: 15%">Status</th>
                        </tr>
                    </thead>
                    <tbody id="clientTableBody">
                        <tr>
                            <td colspan="5" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="text-muted mt-2">Memuat data...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    @vite('resources/js/clients.js')
@endsection