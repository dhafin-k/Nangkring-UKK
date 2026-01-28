<?php

namespace App\Http\Controllers;

use App\Models\AreaParkir;
use Illuminate\Http\Request;
use Termwind\Components\Raw;

class AreaParkirController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $areaParkir = AreaParkir::query()
            ->when($search, function ($query, $search) {
                $query->where('nama_area', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return inertia('admin/area_parkir/index', [
            'areaParkir' => $areaParkir,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return inertia('admin/area_parkir/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_area' => 'required|string|max:255|unique:area_parkirs,nama_area',
            'kapasitas' => 'required|integer|min:1'
        ], [
            'nama_area.required' => 'Nama area harus diisi',
            'nama_area.unique' => 'Nama area sudah digunakan',
            'nama_area.max' => 'Nama area maksimal 255 karakter',
            'kapasitas.required' => 'Kapasitas harus diisi',
            'kapasitas.integer' => 'Kapasitas harus berupa angka',
            'kapasitas.min' => 'Kapasitas minimal 1',
        ]);

        // Set default value untuk terisi = 0
        $validated['terisi'] = 0;

        AreaParkir::create($validated);

        return redirect('/admin/area-parkir')->with('success', 'Area parkir berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $area = AreaParkir::findOrFail($id);

        $validated = $request->validate([
            'nama_area' => 'required|string|max:255|unique:area_parkirs,nama_area,' . $id,
            'kapasitas' => 'required|integer|min:1'
        ], [
            'nama_area.required' => 'Nama area harus diisi',
            'nama_area.unique' => 'Nama area sudah digunakan',
            'nama_area.max' => 'Nama area maksimal 255 karakter',
            'kapasitas.required' => 'Kapasitas harus diisi',
            'kapasitas.integer' => 'Kapasitas harus berupa angka',
            'kapasitas.min' => 'Kapasitas minimal 1',
        ]);

        $area->update($validated);

        return redirect()->back()->with('success', 'Area parkir berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $area = AreaParkir::findOrFail($id);
        $area->delete();

        return redirect()->back()->with('success', 'Area parkir berhasil dihapus!');
    }
}
