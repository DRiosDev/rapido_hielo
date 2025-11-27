<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Client;
use App\Models\Staff;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            // Crear usuario
            $user = User::create([
                'email' => $request->get('email'),
                'phone' => $request->get('phone'),
                'password' => Hash::make($request->get('password')),
                'role' => $request->get('role'),
            ]);

            // Crear perfil según rol
            if ($user->role === "client") {
                Client::create([
                    'user_id' => $user->id,
                    'rut' => $request->get('rut'),
                    'name' => $request->get('name'),
                    'lastname' => $request->get('lastname'),
                    'address' => $request->get('address'),
                ]);
            } else {
                Staff::create([
                    'user_id' => $user->id,
                    'name' => $request->get('name'),
                    'lastname' => $request->get('lastname'),
                ]);
            }


            DB::commit();

            return response()->json([
                'message' => 'Usuario registrado correctamente',
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al registrar el usuario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // 🔹 Buscar manualmente el usuario
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // 🔹 Verificar si está activo
        if ($user->status !== 'active') {
            return response()->json(['message' => 'Tu cuenta está desactivada. Contacta al administrador.'], 403);
        }

        // 🔹 Verificar la contraseña
        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // 🔹 Generar el token manualmente
        $token = JWTAuth::fromUser($user);

        // Obtener perfil según rol
        if ($user->role === 'client') {
            $profile = $user->client;   // relación en User
        } else {
            $profile = $user->staff;    // relación en User
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
            'profile' => $profile,
        ]);
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
