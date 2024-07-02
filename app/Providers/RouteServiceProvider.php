<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            # Custome Response
            return Limit::perMinute(7)->response(function (Request $request, array $headers) {
                return response('Custom response...', 429, $headers);
            })->by($request->input('email'));

            // return $request->user()
            //     ? Limit::perMinute(100)->by($request->input('email'))
            //     : Limit::perMinute(10)->by($request->ip());
        });
    }
}
