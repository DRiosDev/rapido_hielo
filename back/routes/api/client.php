<?php

use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Client\CartItemController;
use App\Http\Controllers\Client\OrderController;
use App\Http\Controllers\Client\ProductController;
use Illuminate\Support\Facades\Route;

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
    Route::post('/{order_id}/payment-proof', 'submitPaymentProof');
});
