<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Models\Client;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // 🔹 1. Buscar primero en la tabla de usuarios (Staff / Admin / Owner)
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

        if ($user) {
            // Verificar si el usuario staff está activo
            if ($user->status !== 'active') {
                return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
            }

            // Verificar la contraseña
            if (!Hash::check($credentials['password'], $user->password)) {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }

            // Generar el token JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        }

        // 🔹 2. Si no es un usuario staff, buscar en la tabla de Clientes
        $client = Client::select(
            'id',
            'rut',
            'name',
            'lastname',
            'address',
            'phone',
            'email',
            'password',
            'status'
        )->where('email', $credentials['email'])->first();

        if ($client) {
            // Verificar si el cliente está activo
            if (isset($client->status) && $client->status !== 'active') {
                return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
            }

            // Verificar la contraseña
            if (!Hash::check($credentials['password'], $client->password)) {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }

            $clientData = $client->toArray();
            $clientData['role'] = 'client';

            // Generar el token JWT para el cliente
            $token = JWTAuth::fromUser($client);

            return response()->json([
                'token' => $token,
                'user' => $clientData,
            ]);
        }

        return response()->json(['message' => 'Credenciales inválidas'], 401);
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
            'expires_in' => JWTAuth::factory()->getTTL() * 60

        ]);
    }
}
