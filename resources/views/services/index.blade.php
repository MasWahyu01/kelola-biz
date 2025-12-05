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
                            <th>Aksi</th>
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
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Buat Layanan Baru</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="createServiceForm">
                    <div class="modal-body">
                        <div id="formAlertContainer"></div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Klien <span class="text-danger">*</span></label>
                                    <select class="form-select" name="client_id" id="clientSelect" required>
                                        <option value="">-- Pilih Klien --</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Nama Layanan <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="service_name"
                                        placeholder="Contoh: Audit Tahunan 2024" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">PIC (Penanggung Jawab) <span
                                            class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="pic" required>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Tgl Mulai <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" name="start_date" required>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Tgl Selesai (Est)</label>
                                        <input type="date" class="form-control" name="end_date">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Prioritas</label>
                                        <select class="form-select" name="priority">
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Status Awal</label>
                                        <select class="form-select" name="status">
                                            <option value="new">New</option>
                                            <option value="in_progress">In Progress</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Deskripsi Tambahan</label>
                                    <textarea class="form-control" name="description" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="saveBtn">Simpan Layanan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editServiceModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Edit Layanan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="editServiceForm">
                    <input type="hidden" id="editServiceId" name="id">
                    
                    <div class="modal-body">
                        <div id="editFormAlertContainer"></div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Klien</label>
                                    <select class="form-select" name="client_id" id="editClientSelect" required>
                                        <option value="">-- Pilih Klien --</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Nama Layanan</label>
                                    <input type="text" class="form-control" id="editServiceName" name="service_name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">PIC</label>
                                    <input type="text" class="form-control" id="editPic" name="pic" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Tgl Mulai</label>
                                        <input type="date" class="form-control" id="editStartDate" name="start_date" required>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Tgl Selesai</label>
                                        <input type="date" class="form-control" id="editEndDate" name="end_date">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Prioritas</label>
                                        <select class="form-select" id="editPriority" name="priority">
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Status</label>
                                        <select class="form-select" id="editStatus" name="status">
                                            <option value="new">New</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="pending_client">Pending Client</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea class="form-control" id="editDescription" name="description" rows="3"></textarea>
                                </div>
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

    @vite('resources/js/services.js')
@endsection