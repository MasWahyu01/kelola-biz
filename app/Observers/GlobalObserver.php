<?php

namespace App\Observers;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class GlobalObserver
{
    /**
     * Helper untuk mendapatkan User ID (baik dari Web atau API JWT)
     */
    private function getUserId()
    {
        // Cek guard API dulu (karena kita pakai JWT), kalau null baru cek web
        return auth('api')->id() ?? auth('web')->id(); 
    }

    /**
     * Handle the Model "created" event.
     */
    public function created(Model $model): void
    {
        ActivityLog::create([
            'user_id'      => $this->getUserId(),
            'action'       => 'created',
            'description'  => 'Membuat data baru pada ' . class_basename($model),
            'subject_type' => get_class($model),
            'subject_id'   => $model->id,
            'properties'   => json_encode($model->getAttributes()), // Simpan data awal
        ]);
    }

    /**
     * Handle the Model "updated" event.
     */
    public function updated(Model $model): void
    {
        // Hanya catat jika ada perubahan (dirty)
        if ($model->wasChanged()) {
            ActivityLog::create([
                'user_id'      => $this->getUserId(),
                'action'       => 'updated',
                'description'  => 'Memperbarui data ' . class_basename($model),
                'subject_type' => get_class($model),
                'subject_id'   => $model->id,
                'properties'   => json_encode([
                    'old' => $model->getOriginal(), // Data sebelum edit
                    'new' => $model->getChanges(),  // Data setelah edit
                ]),
            ]);
        }
    }

    /**
     * Handle the Model "deleted" event.
     */
    public function deleted(Model $model): void
    {
        ActivityLog::create([
            'user_id'      => $this->getUserId(),
            'action'       => 'deleted',
            'description'  => 'Menghapus data ' . class_basename($model),
            'subject_type' => get_class($model),
            'subject_id'   => $model->id,
            'properties'   => json_encode($model->getAttributes()), // Simpan data terakhir sebelum hilang
        ]);
    }
}