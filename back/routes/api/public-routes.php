<?php

use App\Http\Controllers\Auth\AuthClientController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

//acceso a la version para que el usuario del frontend pueda saber si hay una nueva version
Route::get('/version', function () {
    return response()->json([
        'version' => config('version.frontend'),
    ]);
});

/*
|--------------------------------------------------------------------------
| Rutas de Autenticación usuario
|--------------------------------------------------------------------------
| Registro y login de usuarios.
*/
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/refresh', 'refresh');
});

Route::prefix('auth/clients')->controller(AuthClientController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/refresh', 'refresh');
});

/*
|--------------------------------------------------------------------------
| Restablecimiento de Contraseña
|--------------------------------------------------------------------------
| Permite enviar enlaces de restablecimiento y cambiar la contraseña.
*/
Route::prefix('password-reset')->controller(PasswordResetController::class)->group(function () {
    Route::post('/', 'sendResetLink');
    Route::put('/', 'resetPassword');
});
