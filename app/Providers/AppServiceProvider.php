<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
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
        // Pasang CCTV (Observer) ke 3 Model Penting
        Client::observe(GlobalObserver::class);
        Service::observe(GlobalObserver::class);
        InteractionLog::observe(GlobalObserver::class);
    }
}