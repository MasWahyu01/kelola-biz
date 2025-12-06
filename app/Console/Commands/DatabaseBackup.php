<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class DatabaseBackup extends Command
{
    /**
     * Nama perintah terminal.
     */
    protected $signature = 'db:backup';

    /**
     * Deskripsi perintah.
     */
    protected $description = 'Melakukan backup database ke storage lokal';

    /**
     * Eksekusi perintah.
     */
    public function handle()
    {
        $this->info('Memulai proses backup database...');

        $filename = 'backup-' . Carbon::now()->format('Y-m-d-H-i-s') . '.sql';
        
        // Pastikan folder backup ada
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('backups');
        }

        // Ambil konfigurasi dari .env
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $database = env('DB_DATABASE');
        $host = env('DB_HOST');

        // Path penyimpanan (di storage/app/backups)
        $path = storage_path('app/backups/' . $filename);

        // Perintah mysqldump (Kompatibel dengan Laragon jika mysql ada di environment path)
        // Jika password kosong, jangan pakai -p
        $passwordString = $password ? "--password=$password" : "";
        
        // Perintah Terminal untuk export
        $command = "mysqldump --user=$username $passwordString --host=$host $database > \"$path\"";

        // Jalankan perintah
        $returnVar = null;
        $output = null;
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Backup berhasil disimpan di: storage/app/backups/$filename");
            
            // Log ke Activity Log (karena kita punya fiturnya!)
            // Kita panggil model secara manual karena ini bukan via Controller
            \App\Models\ActivityLog::create([
                'user_id' => null, // Sistem
                'action' => 'backup',
                'description' => "System melakukan backup database: $filename",
                'subject_type' => 'System',
                'subject_id' => 0,
            ]);
            
        } else {
            $this->error('Backup gagal. Pastikan mysqldump terdaftar di Environment Variables Windows Anda.');
            $this->line('Tips: Di Laragon, menu Tools > Path > Add MySQL to Path.');
        }
    }
}