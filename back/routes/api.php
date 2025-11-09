<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
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
});

Route::group(['middleware' => ['jwt.verify', 'user.active']], function () {
    Route::prefix('users')->controller(UserController::class)->group(function () {
        Route::post('/', 'createUser');
        Route::put('/{id_user}', 'updateUser')->whereUuid('id_user');
        Route::patch('/{id_user}', 'changeStatusUser')->whereUuid('id_user');
        Route::get('/', 'getUsers');
        Route::put('/password', 'changePassword');
    });


    /**
     * --------------------------------------------------------
     * Admin-Only Routes (requires admin role)
     * --------------------------------------------------------
     */
    Route::group(['middleware' => ['user.admin']], function () {
        require __DIR__ . '/api/admin.php';
    });

    /**
     * --------------------------------------------------------
     * Authenticated User Routes (non-admin)
     * --------------------------------------------------------
     */
    require __DIR__ . '/api/normal.php';
});
