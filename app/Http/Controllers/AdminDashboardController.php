<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Kendaraan;
use App\Models\AreaParkir;
use App\Models\User;
use App\Models\TarifParkir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Total Users (Petugas)
        $totalPetugas = User::where('role', 'petugas')->count();
        $totalAdmin = User::where('role', 'admin')->count();
        $totalOwner = User::where('role', 'owner')->count();

        // Total Transaksi
        $totalTransaksi = Transaksi::count();
        $transaksiMasuk = Transaksi::where('status', 'masuk')->count();
        $transaksiKeluar = Transaksi::where('status', 'keluar')->count();

        // Total Pendapatan
        $totalPendapatan = Transaksi::where('status', 'keluar')->sum('biaya_total');

        // Total Kendaraan & Area
        $totalKendaraan = Kendaraan::count();
        $totalArea = AreaParkir::count();
        $totalTarif = TarifParkir::count();

        // Kapasitas Parkir
        $totalKapasitas = AreaParkir::sum('kapasitas');
        $totalTerisi = AreaParkir::sum('terisi');
        $kapasitasTersedia = $totalKapasitas - $totalTerisi;

        // Statistik Per Area
        $statistikArea = AreaParkir::select(
            'id',
            'nama_area',
            'kapasitas',
            'terisi',
            DB::raw('(SELECT COUNT(*) FROM transaksis WHERE area_parkir_id = area_parkirs.id) as total_transaksi'),
            DB::raw('(SELECT SUM(biaya_total) FROM transaksis WHERE area_parkir_id = area_parkirs.id AND status = "keluar") as pendapatan_area')
        )->get();

        // Data Transaksi per Bulan (12 bulan terakhir)
        $transaksiPerBulan = Transaksi::selectRaw('MONTH(waktu_masuk) as bulan, YEAR(waktu_masuk) as tahun, COUNT(*) as jumlah, SUM(biaya_total) as pendapatan')
            ->whereNotNull('waktu_masuk')
            ->where('waktu_masuk', '>=', Carbon::now()->subYear())
            ->where('status', 'keluar')
            ->groupBy(DB::raw('YEAR(waktu_masuk), MONTH(waktu_masuk)'))
            ->orderBy(DB::raw('YEAR(waktu_masuk), MONTH(waktu_masuk)'))
            ->get();

        // Map data untuk chart (12 bulan)
        $chartData = [];
        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $bulanIndex = (int) $date->format('m') - 1;
            $bulanNumber = (int) $date->format('m');
            $tahun = (int) $date->format('Y');

            $transaksi = $transaksiPerBulan->firstWhere(function ($item) use ($bulanNumber, $tahun) {
                return $item['bulan'] == $bulanNumber && $item['tahun'] == $tahun;
            });

            $jumlah = $transaksi ? (int) $transaksi['jumlah'] : 0;
            $pendapatan = $transaksi ? (int) $transaksi['pendapatan'] : 0;

            $chartData[] = [
                'month' => $bulanNames[$bulanIndex],
                'transaksi' => $jumlah,
                'pendapatan' => $pendapatan,
            ];
        }

        // Statistik Petugas
        $statistikPetugas = User::where('role', 'petugas')
            ->select('id', 'name')
            ->withCount(['transaksi' => function ($query) {
                $query->where('status', 'keluar');
            }])
            ->orderByDesc('transaksi_count')
            ->limit(5)
            ->get();

        // Transaksi Terbaru
        $transaksiTerbaru = Transaksi::with(['kendaraan', 'areaParkir', 'user'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'totalPetugas' => $totalPetugas,
            'totalAdmin' => $totalAdmin,
            'totalOwner' => $totalOwner,
            'totalTransaksi' => $totalTransaksi,
            'transaksiMasuk' => $transaksiMasuk,
            'transaksiKeluar' => $transaksiKeluar,
            'totalPendapatan' => $totalPendapatan,
            'totalKendaraan' => $totalKendaraan,
            'totalArea' => $totalArea,
            'totalTarif' => $totalTarif,
            'totalKapasitas' => $totalKapasitas,
            'totalTerisi' => $totalTerisi,
            'kapasitasTersedia' => $kapasitasTersedia,
            'statistikArea' => $statistikArea,
            'statistikPetugas' => $statistikPetugas,
            'chartData' => $chartData,
            'transaksiTerbaru' => $transaksiTerbaru,
        ]);
    }
}

