<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;


/**
 * --------------------------------------------------------
 * Public API Routes (no authentication required)
 * --------------------------------------------------------
 */

require __DIR__ . '/api/public-routes.php';

Route::middleware(['jwt.verify', 'user.active'])->group(function () {

    Route::get('/me', [AccountController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('account')->controller(AccountController::class)->group(function () {
        Route::get('/', 'show');
        Route::put('/', 'update');
        Route::patch('/password', 'updatePassword');
    });

    /**
     * --------------------------------------------------------
     * Admin-Only Routes (requires admin role)
     * --------------------------------------------------------
     */
    Route::group(['middleware' => ['user.role:admin,owner']], function () {
        require __DIR__ . '/api/staff.php';
    });

    /**
     * --------------------------------------------------------
     * Authenticated User Routes (non-admin)
     * --------------------------------------------------------
     */
    Route::group(['middleware' => ['user.role:client']], function () {
        require __DIR__ . '/api/client.php';
    });
});
