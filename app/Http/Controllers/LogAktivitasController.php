<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogAktivitasController extends Controller
{
    public function index(Request $request)
    {
        $logs = LogAktivitas::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('aktivitas', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    });
            })
            ->orderBy('waktu_aktivitas', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/log_aktivitas/index', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }

}