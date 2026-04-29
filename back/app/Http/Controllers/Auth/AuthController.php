<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // 🔹 Buscar manualmente el usuario
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

        return response()->json([
            'token' => $token,
            'user' => $user,
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
