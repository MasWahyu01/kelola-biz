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
        Schema::create('interaction_logs', function (Blueprint $table) {
            $table->id();
            
            // Relasi: Log ini milik Klien siapa?
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            
            // Detail Interaksi
            // Enum tipe interaksi umum di bisnis
            $table->enum('type', ['call', 'email', 'meeting', 'whatsapp', 'other']);
            $table->text('notes'); // Isi catatan hasil pembicaraan
            
            // Tindak Lanjut (Opsional)
            $table->string('next_action')->nullable(); // Contoh: "Kirim Penawaran Revisi"
            $table->date('due_date')->nullable(); // Kapan harus dilakukan?
            
            // File Lampiran (Opsional)
            $table->string('attachment')->nullable(); // Path file yang diupload
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interaction_logs');
    }
};
