<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Client;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Login para Clientes (App Móvil)
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        $user = Client::select('id', 'name', 'lastname', 'address', 'phone', 'email', 'password', 'status')
            ->where('email', $credentials['email'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Login para Personal / Administración (Panel Web)
     */
    public function loginStaff(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::select(
            'id',
            'name',
            'lastname',
            'phone',
            'email',
            'password',
            'role',
            'status'
        )->where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Registro de Clientes (App Móvil)
     */
    public function register(RegisterRequest $request)
    {
        try {
            Client::create([
                'rut' => $request->get('rut'),
                'name' => $request->get('name'),
                'lastname' => $request->get('lastname'),
                'address' => $request->get('address'),
                'phone' => str_starts_with($request->get('phone'), '+56') ? $request->get('phone') : "+56" . $request->get('phone'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
                'status' => 'active',
            ]);

            return response()->json(['message' => 'Usuario creado'], 201);
        } catch (\Exception $e) {
            Log::error('Error registrando cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Ocurrió un error al registrar el cliente: ' . $e->getMessage()], 500);
        }
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json(['error' => 'El token no se puede refrescar, por favor inicie sesión nuevamente'], 401);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60
        ]);
    }
}

