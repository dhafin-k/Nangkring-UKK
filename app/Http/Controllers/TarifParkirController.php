<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use App\Models\TarifParkir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TarifParkirController extends Controller
{
    public function index(Request $request)
    {
        $query = TarifParkir::with('jenisKendaraan');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('jenisKendaraan', function ($q) use ($search) {
                $q->where('nama_jenis_kendaraan', 'like', '%' . $search . '%');
            });
        }

        $tarifParkir = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $jenisKendaraan = \App\Models\JenisKendaraan::all();

        return Inertia::render('admin/tarif_parkir/index', [
            'tarifParkir' => $tarifParkir,
            'jenisKendaraan' => $jenisKendaraan,
            'filters' => [
                'search' => $request->search ?? '',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_kendaraan_id' => 'required|exists:jenis_kendaraans,id|unique:tarif_parkirs,jenis_kendaraan_id',
            'tarif_per_jam' => 'required|numeric|min:0',
        ], [
            'jenis_kendaraan_id.required' => 'Jenis kendaraan harus dipilih',
            'jenis_kendaraan_id.exists' => 'Jenis kendaraan tidak valid',
            'jenis_kendaraan_id.unique' => 'Tarif untuk jenis kendaraan ini sudah ada',
            'tarif_per_jam.required' => 'Tarif parkir harus diisi',
            'tarif_per_jam.numeric' => 'Tarif parkir harus berupa angka',
            'tarif_per_jam.min' => 'Tarif parkir minimal 0',
        ]);

        TarifParkir::create([
            'jenis_kendaraan_id' => $validated['jenis_kendaraan_id'],
            'tarif_per_jam' => $validated['tarif_per_jam'],
        ]);

        LogAktivitas::create([
            'user_id' => Auth::id(),
            'aktivitas' => 'Menambahkan tarif parkir baru',
            'waktu_aktivitas' => now(),
        ]);

        return redirect()->back()->with('success', 'Tarif parkir berhasil ditambahkan.');
    }

    public function update(Request $request, TarifParkir $tarifParkir)
    {
        $validated = $request->validate([
            'jenis_kendaraan_id' => 'required|exists:jenis_kendaraans,id|unique:tarif_parkirs,jenis_kendaraan_id,' . $tarifParkir->id,
            'tarif_per_jam' => 'required|numeric|min:0',
        ], [
            'jenis_kendaraan_id.required' => 'Jenis kendaraan harus dipilih',
            'jenis_kendaraan_id.exists' => 'Jenis kendaraan tidak valid',
            'jenis_kendaraan_id.unique' => 'Tarif untuk jenis kendaraan ini sudah ada',
            'tarif_per_jam.required' => 'Tarif parkir harus diisi',
            'tarif_per_jam.numeric' => 'Tarif parkir harus berupa angka',
            'tarif_per_jam.min' => 'Tarif parkir minimal 0',
        ]);

        $tarifParkir->update([
            'jenis_kendaraan_id' => $validated['jenis_kendaraan_id'],
            'tarif_per_jam' => $validated['tarif_per_jam'],
        ]);

        LogAktivitas::create([
            'user_id' => Auth::id(),
            'aktivitas' => 'Memperbarui tarif parkir ID ' . $tarifParkir->id,
            'waktu_aktivitas' => now(),
        ]);

        return redirect()->back()->with('success', 'Tarif parkir berhasil diperbarui.');
    }

    public function destroy(TarifParkir $tarifParkir)
    {
        $id = $tarifParkir->id;
        $tarifParkir->delete();

        LogAktivitas::create([
            'user_id' => Auth::id(),
            'aktivitas' => 'Menghapus tarif parkir ID ' . $id,
            'waktu_aktivitas' => now(),
        ]);

        return redirect()->back()->with('success', 'Tarif parkir berhasil dihapus.');
    }
}
