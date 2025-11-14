<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::prefix('users')->controller(UserController::class)->group(function () {
    Route::post('/', 'createUser');
    Route::put('/{id_user}', 'updateUser')->whereUuid('id_user');
    Route::patch('/{id_user}', 'changeStatusUser')->whereUuid('id_user');
    Route::get('/', 'getUsers');
    Route::put('/password', 'changePassword');
});

Route::prefix('clients')->controller(ClientController::class)->group(function () {
    Route::post('/', 'createClient');
    Route::put('/{id_client}', 'updateClient')->whereUuid('id_client');
    Route::patch('/{id_client}', 'changeStatusClient')->whereUuid('id_client');
    Route::get('/', 'getClients');
    Route::get('/{client_id}', 'show');
    Route::put('/password', 'changePassword');
});

Route::prefix('products')->controller(ProductController::class)->group(function () {
    Route::post('/', 'createProduct');
    Route::put('/{id_product}', 'updateClient')->whereUuid('id_product');
    Route::get('/', 'getProducts');
    Route::patch('/{id_product}', 'changeStatusProduct')->whereUuid('id_product');
});

Route::prefix('orders')->controller(OrderController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/items/{order_id}', 'showOrderItems');
});
