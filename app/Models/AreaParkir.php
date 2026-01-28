<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaParkir extends Model
{
    protected $guarded = [];
    
    protected $fillable = [
        'nama_area',
        'kapasitas',
        'terisi',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
        'terisi' => 'integer',
    ];
}