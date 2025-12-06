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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            
            // Siapa yang melakukan? (Bisa null jika aksi sistem)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            // Apa yang dilakukan?
            $table->string('action'); // CONTOH: 'created', 'updated', 'deleted', 'login'
            $table->text('description'); // CONTOH: "Menambahkan klien baru: PT Maju Jaya"
            
            // Objek apa yang kena dampak? (Polymorphic)
            // Akan membuat kolom: subject_id & subject_type
            $table->nullableMorphs('subject');
            
            // Properti tambahan (misal: data sebelum & sesudah edit) - Disimpan sebagai JSON
            $table->json('properties')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
