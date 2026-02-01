<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TarifParkir extends Model
{
    protected $table = 'tarif_parkirs';

    protected $guarded = [];
    protected $fillable = [
        'jenis_kendaraan_id',
        'tarif_per_jam',
    ];

    protected $casts = [
        'tarif_per_jam' => 'integer',
    ];

    public function jenisKendaraan()
    {
        return $this->belongsTo(JenisKendaraan::class, 'jenis_kendaraan_id');
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'transaksi_id', 'id');
    }
}
