<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InteractionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'type',
        'notes',
        'next_action',
        'due_date',
        'attachment',
    ];

    // Relasi: Log ini milik satu Client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}