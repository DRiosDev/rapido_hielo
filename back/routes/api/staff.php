<?php

use App\Http\Controllers\Staff\ClientController;
use App\Http\Controllers\Staff\DashboardController;
use App\Http\Controllers\Staff\DispatchController;
use App\Http\Controllers\Staff\InventoryMovementController;
use App\Http\Controllers\Staff\OrderController;
use App\Http\Controllers\Staff\ProductController;
use App\Http\Controllers\Staff\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [DashboardController::class, 'index']);

/* Route::prefix('users')->controller(UserController::class)->group(function () {
    Route::post('/', 'createUser');
    Route::put('/{id_user}', 'updateUser')->whereUuid('id_user');
    Route::patch('/{id_user}', 'changeStatusUser')->whereUuid('id_user');
    Route::get('/', 'getUsers');
    Route::get('/{id_user}', 'show');
    Route::put('/password', 'changePassword');
}); */

Route::prefix('clients')->controller(ClientController::class)->group(function () {
    Route::get('/table-top', 'getTopClientsTable');
    Route::post('/', 'createClient');
    Route::put('/{id_client}', 'updateClient')->whereUuid('id_client');
    Route::patch('/{id_client}', 'changeStatusClient')->whereUuid('id_client');
    Route::get('/', 'index');
    Route::get('/{client_id}', 'show');
    Route::put('/password', 'changePassword');
});

Route::prefix('products')->controller(ProductController::class)->group(function () {
    Route::get('/kpi-sold', 'getProductsSoldKpi');
    Route::get('/kpi-stock-value', 'getStockValueKpi');
    Route::get('/table-top-selling', 'getTopSellingProductsTable');
    Route::get('/table-low-stock', 'getLowStockProductsTable');
    Route::post('/convert-stock', 'convertStock');
    Route::post('/', 'create');
    Route::put('/{id_product}', 'update')->whereUuid('id_product');
    Route::get('/', 'getProducts');
    Route::patch('/quantity/{id_product}', 'updateQuantity')->whereUuid('id_product');
    Route::patch('/{id_product}', 'changeStatusProduct')->whereUuid('id_product');
    Route::get('/{id_product}/movements', [InventoryMovementController::class, 'getByProduct'])->whereUuid('id_product');
});

Route::prefix('inventory-movements')->controller(InventoryMovementController::class)->group(function () {
    Route::get('/', 'index');
});

Route::prefix('orders')->controller(OrderController::class)->group(function () {
    Route::get('/kpi-revenue', 'getMonthlyRevenueKpi');
    Route::get('/chart-weekly-sales', 'getWeeklySalesChart');
    Route::get('/', 'index');
    Route::get('/items/{order_id}', 'showOrderItems');
    Route::get('/vaucher/{order_id}', 'showVaucher');
    Route::put('/confirm-payment/{order_id}', 'confirmPayment');
});

Route::prefix('dispatches')->controller(DispatchController::class)->group(function () {
    Route::get('/kpi-active', 'getActiveDispatchesKpi');
    Route::get('/chart-status', 'getDispatchStatusChart');
    Route::get('/', 'index');
});

