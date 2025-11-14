<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;

Route::prefix('account')->controller(AccountController::class)->group(function () {
    Route::get('/', 'show');
    Route::put('/', 'update');
    Route::patch('/password', 'updatePassword');
});

Route::prefix('products')->controller(ProductController::class)->group(function () {
    Route::get('/', 'show');
});

Route::prefix('carts')->controller(CartController::class)->group(function () {
    Route::post('/{product_id}', 'addToCart');
    Route::get('/', 'getCart');
    Route::delete('/{cart_id}', 'deleteAllItems');
});

Route::prefix('carts/items')->controller(CartItemController::class)->group(function () {
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('orders')->controller(OrderController::class)->group(function () {
    Route::post('/{cart_id}', 'store');
    Route::post('/update/{order_id}', 'update');
});

/* Route::prefix('orders/update')->controller(OrderController::class)->group(function () {
    Route::post('/{cart_id}', 'update');
}); */
