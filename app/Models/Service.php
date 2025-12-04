<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'service_name',
        'description',
        'pic',
        'start_date',
        'end_date',
        'priority',
        'status',
    ];

    // Relasi Kebalikan: Service milik satu Client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}