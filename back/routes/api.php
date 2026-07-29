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

    /*
    |--------------------------------------------------------------------------
    | Rutas de Cliente (App Móvil)
    |--------------------------------------------------------------------------
    */
    Route::prefix('products')->controller(\App\Http\Controllers\Client\ProductController::class)->group(function () {
        Route::get('/', 'index');
    });

    Route::prefix('carts')->controller(\App\Http\Controllers\Client\CartController::class)->group(function () {
        Route::get('/', 'getCart');
        Route::post('/{product_id}', 'addToCart');
        Route::delete('/{cart_id}', 'deleteAllItems');
    });

    Route::prefix('carts/items')->controller(\App\Http\Controllers\Client\CartItemController::class)->group(function () {
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::get('/orders', [\App\Http\Controllers\Staff\OrderController::class, 'index']);

    Route::prefix('orders')->controller(\App\Http\Controllers\Client\OrderController::class)->group(function () {
        Route::post('/{cart_id}', 'store');
        Route::post('/{order_id}/payment-proof', 'submitPaymentProof');
    });

    /**
     * --------------------------------------------------------
     * Admin-Only Routes (requires admin role)
     * --------------------------------------------------------
     */
    Route::group(['middleware' => ['user.role:admin,owner']], function () {
        require __DIR__ . '/api/staff.php';
    });
});

