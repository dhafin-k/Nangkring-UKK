<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kendaraans', function (Blueprint $table) {
            $table->id();
            $table->string('plat_nomor', 255)->unique();
            $table->string('warna', 100);
            $table->string('pemilik', 255);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('jenis_kendaraan_id')->constrained('jenis_kendaraans')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraans');
    }
};
