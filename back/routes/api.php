<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Staff\UserController;
use Illuminate\Support\Facades\Route;


/**
 * --------------------------------------------------------
 * Public API Routes (no authentication required)
 * --------------------------------------------------------
 */

require __DIR__ . '/api/public-routes.php';

Route::prefix('users')->controller(UserController::class)->group(function () {
    Route::post('/', 'createUser');
    Route::put('/{id_user}', 'updateUser')->whereUuid('id_user');
    Route::patch('/{id_user}', 'changeStatusUser')->whereUuid('id_user');
    Route::get('/', 'getUsers');
    Route::get('/{id_user}', 'show');
    Route::put('/password', 'changePassword');
});

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
