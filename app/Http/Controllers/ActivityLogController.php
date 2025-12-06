<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Ambil log beserta data User-nya
        // latest() = orderBy('created_at', 'desc')
        $logs = ActivityLog::with('user:id,name')->latest()->paginate(20);

        return response()->json($logs);
    }
}