<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin (Akses Penuh)
        User::updateOrCreate(
            ['email' => 'admin@kelola.biz'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin'
            ]
        );

        // 2. Staff Operasional (Input Data)
        User::updateOrCreate(
            ['email' => 'staff@kelola.biz'],
            [
                'name' => 'Staff Operasional',
                'password' => Hash::make('password123'),
                'role' => 'staff'
            ]
        );

        // 3. Viewer / Manager (Hanya Lihat)
        User::updateOrCreate(
            ['email' => 'manager@kelola.biz'],
            [
                'name' => 'Pak Manager',
                'password' => Hash::make('password123'),
                'role' => 'viewer'
            ]
        );
        
        $this->command->info('3 User (Admin, Staff, Viewer) siap digunakan!');
    }
}