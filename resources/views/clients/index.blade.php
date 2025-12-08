@extends('layouts.app')

@section('title', 'Manajemen Klien')

@section('content')
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 class="m-0 fw-bold text-primary">Daftar Klien</h5>

            <div class="d-flex gap-2">
                <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input type="text" id="searchInput" class="form-control border-start-0 ps-0"
                        placeholder="Cari nama atau email...">
                </div>

                <button class="btn btn-primary btn-sm text-nowrap" data-bs-toggle="modal"
                    data-bs-target="#createClientModal">
                    <i class="bi bi-plus-lg"></i> Tambah Klien
                </button>
            </div>
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
                            <th style="width: 15%">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="clientTableBody">
                        <tr>
                            <td colspan="6" class="text-center py-4">
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
        <div class="card-footer bg-white py-3">
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end mb-0" id="paginationContainer">
                </ul>
            </nav>
        </div>
    </div>

    @vite('resources/js/clients.js')

    <div class="modal fade" id="createClientModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Tambah Klien Baru</h5>
                </div>
                <form id="createClientForm">
                    <div class="modal-body">
                        <div id="formAlertContainer"></div>

                        <div class="mb-3">
                            <label class="form-label">Nama Klien / Perusahaan <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">No. Telepon</label>
                            <input type="text" class="form-control" name="phone">
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipe</label>
                                <select class="form-select" name="type">
                                    <option value="SME">SME (UMKM)</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="saveBtn">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editClientModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Edit Data Klien</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="editClientForm">
                    <input type="hidden" id="editClientId" name="id">

                    <div class="modal-body">
                        <div id="editFormAlertContainer"></div>

                        <div class="mb-3">
                            <label class="form-label">Nama Klien / Perusahaan <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="editName" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="editEmail" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">No. Telepon</label>
                            <input type="text" class="form-control" id="editPhone" name="phone">
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipe</label>
                                <select class="form-select" id="editType" name="type">
                                    <option value="SME">SME (UMKM)</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editStatus" name="status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="updateBtn">Update Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection