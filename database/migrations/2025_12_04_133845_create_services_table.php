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
            Schema::create('services', function (Blueprint $table) {
                $table->id();
                
                // Relasi ke tabel clients
                // constrained() otomatis mencari tabel 'clients' & id
                // onDelete('cascade') artinya jika Klien dihapus, Service-nya ikut hilang otomatis
                $table->foreignId('client_id')->constrained()->onDelete('cascade');
                
                // Detail Layanan
                $table->string('service_name'); // Misal: "Pembuatan Website", "Audit Pajak"
                $table->text('description')->nullable();
                $table->string('pic'); // Person In Charge (Penanggung Jawab)
                
                // Waktu & Status
                $table->date('start_date');
                $table->date('end_date')->nullable(); // Bisa kosong jika ongoing
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
                $table->enum('status', ['new', 'in_progress', 'pending_client', 'completed', 'cancelled'])->default('new');
                
                $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
