<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterClientRequest;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthClientController extends Controller
{
    public function register(RegisterClientRequest $request)
    {
        // Creación del usuario
        Client::create([
            'rut' => $request->get('rut'),
            'name' => $request->get('name'),
            'lastname' => $request->get('lastname'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'address' => $request->get('address'),
        ]);

        // Retornar respuesta (puede incluir token si usas Sanctum o JWT)
        return response()->json([
            'message' => 'Cliente registrado correctamente',
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // 🔹 Buscar manualmente el usuario
        $client = Client::where('email', $credentials['email'])->first();

        if (!$client) {
            return response()->json(['message' => 'Credenciales inválidas', 'client' => $client], 401);
        }

        // 🔹 Verificar si está activo
        if ($client->status !== 'active') {
            return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
        }

        // 🔹 Verificar la contraseña
        if (!Hash::check($credentials['password'], $client->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // 🔹 Generar el token manualmente
        $token = JWTAuth::fromUser($client);

        return response()->json([
            'token' => $token,
            'client' => $client,
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Successfully logged out']);
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
            'expires_in'   => Auth::guard('client')->factory()->getTTL() * 60
        ]);
    }
}
