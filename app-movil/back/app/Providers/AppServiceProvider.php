<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Import Str facade

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
        // Contador global por request
        $queryCount = 0;

        DB::listen(function ($query) use (&$queryCount) {
            $queryCount++;

            // Reemplaza los bindings en la query
            $sql = Str::replaceArray('?', $query->bindings, $query->sql);

            // Captura el stack trace
            $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
            $caller = $trace[2] ?? null; // Ajusta según tu necesidad

            $file = $caller['file'] ?? 'unknown file';
            $line = $caller['line'] ?? 'unknown line';

            error_log("================================");
            error_log("SQL Query #{$queryCount}: {$sql} - Time: {$query->time}ms - File: {$file}:{$line}");
            error_log("================================");
        });

        // Al final del request mostramos el total
        app()->terminating(function () use (&$queryCount) {
            error_log("Total de consultas ejecutadas en este request: {$queryCount}");
        });
    }
}
