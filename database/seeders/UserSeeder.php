<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membuat User Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@kelola.biz',
            'password' => Hash::make('password123'), // Password aman terenkripsi
            // Nanti kita akan tambahkan role di sini, untuk sekarang default dulu
        ]);
        
        // Opsional: Feedback di terminal
        $this->command->info('User Admin berhasil dibuat!');
    }
}