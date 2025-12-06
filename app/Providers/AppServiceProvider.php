<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
// Import Model & Observer
use App\Models\Client;
use App\Models\Service;
use App\Models\InteractionLog;
use App\Observers\GlobalObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Pasang CCTV (Observer) - Yang sudah ada sebelumnya
        Client::observe(GlobalObserver::class);
        Service::observe(GlobalObserver::class);
        InteractionLog::observe(GlobalObserver::class);

        // 2. DEFINISI GATES (ATURAN HAK AKSES)

        // Gate: is-admin (Hanya Admin yang boleh lewat)
        // Digunakan untuk: Lihat Activity Log, Kelola User (Next phase)
        Gate::define('is-admin', function (User $user) {
            return $user->role === 'admin';
        });

        // Gate: can-edit (Admin DAN Staff boleh lewat)
        // Digunakan untuk: Create, Update, Delete data Klien/Layanan/Log
        // Viewer akan return false di sini
        Gate::define('can-edit', function (User $user) {
            return in_array($user->role, ['admin', 'staff']);
        });
    }
}