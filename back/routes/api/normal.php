<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ProductController;

Route::prefix('account')->controller(AccountController::class)->group(function () {
    Route::get('/', 'show');
    Route::put('/', 'update');
    Route::patch('/password', 'updatePassword');
});

Route::prefix('products')->controller(ProductController::class)->group(function () {
    Route::get('/', 'getProducts');
});
