<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
    Route::post('/{order_id}/payment-proof', 'submitPaymentProof');
});

/* Route::prefix('orders/update')->controller(OrderController::class)->group(function () {
    Route::post('/{cart_id}', 'update');
}); */

Route::delete('/delete-file', function (Request $request) {
    $path = $request->path;

    if (Storage::disk('public')->exists($path)) {
        Storage::disk('public')->delete($path);
        return response()->json(['message' => 'deleted']);
    }

    return response()->json(['error' => 'not found'], 404);
});
