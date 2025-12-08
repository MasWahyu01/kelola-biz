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
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="logTableBody">
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

    <div class="modal fade" id="createLogModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Catat Interaksi Baru</h5>
                    <button class="btn btn-primary btn-sm d-none restricted-btn" data-bs-toggle="modal"
                        data-bs-target="#createClientModal">
                        <i class="bi bi-plus-lg"></i> Catatan Log Baru
                    </button>
                </div>
                <form id="createLogForm">
                    <div class="modal-body">
                        <div id="formAlertContainer"></div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Klien <span class="text-danger">*</span></label>
                                <select class="form-select" name="client_id" id="clientSelect" required>
                                    <option value="">-- Pilih Klien --</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipe Interaksi <span class="text-danger">*</span></label>
                                <select class="form-select" name="type">
                                    <option value="call">Panggilan Telepon</option>
                                    <option value="whatsapp">WhatsApp / Chat</option>
                                    <option value="meeting">Meeting Tatap Muka</option>
                                    <option value="email">Email</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Catatan Hasil <span class="text-danger">*</span></label>
                            <textarea class="form-control" name="notes" rows="4" placeholder="Apa hasil pembicaraan tadi?"
                                required></textarea>
                        </div>

                        <div class="card bg-light border-0 p-3 mb-3">
                            <h6 class="fw-bold text-muted mb-3">Tindak Lanjut (Opsional)</h6>
                            <div class="row">
                                <div class="col-md-8 mb-2">
                                    <input type="text" class="form-control" name="next_action"
                                        placeholder="Contoh: Kirim penawaran revisi">
                                </div>
                                <div class="col-md-4 mb-2">
                                    <input type="date" class="form-control" name="due_date">
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Lampiran Bukti (Max 2MB)</label>
                            <input type="file" class="form-control" name="attachment"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx">
                            <div class="form-text">Format: JPG, PNG, PDF, DOCX.</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="saveBtn">Simpan Log</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="editLogModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Edit Interaksi</h5>
                </div>
                <form id="editLogForm">
                    <input type="hidden" id="editLogId" name="id">
                    <input type="hidden" name="_method" value="PUT">

                    <div class="modal-body">
                        <div id="editFormAlertContainer"></div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Klien <span class="text-danger">*</span></label>
                                <select class="form-select" name="client_id" id="editClientSelect" required>
                                    <option value="">-- Pilih Klien --</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipe Interaksi <span class="text-danger">*</span></label>
                                <select class="form-select" name="type" id="editType">
                                    <option value="call">Panggilan Telepon</option>
                                    <option value="whatsapp">WhatsApp / Chat</option>
                                    <option value="meeting">Meeting Tatap Muka</option>
                                    <option value="email">Email</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Catatan Hasil <span class="text-danger">*</span></label>
                            <textarea class="form-control" name="notes" id="editNotes" rows="4" required></textarea>
                        </div>

                        <div class="card bg-light border-0 p-3 mb-3">
                            <h6 class="fw-bold text-muted mb-3">Tindak Lanjut (Opsional)</h6>
                            <div class="row">
                                <div class="col-md-8 mb-2">
                                    <input type="text" class="form-control" name="next_action" id="editNextAction"
                                        placeholder="Contoh: Kirim penawaran revisi">
                                </div>
                                <div class="col-md-4 mb-2">
                                    <input type="date" class="form-control" name="due_date" id="editDueDate">
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Ganti Lampiran (Max 2MB)</label>
                            <input type="file" class="form-control" name="attachment"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx">
                            <div class="form-text text-danger" id="currentAttachment"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="updateLogBtn">Update Log</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    @vite('resources/js/interactions.js')
@endsection