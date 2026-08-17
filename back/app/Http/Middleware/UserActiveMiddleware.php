<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\Client;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserActiveMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $payload = JWTAuth::parseToken()->getPayload();

        $id_user = $payload->get('id') ?? $payload->get('sub');

        // 1. Intentar encontrar primero en User (Staff)
        $user = User::where('id', $id_user)->first();

        if ($user) {
            if ($user->status !== 'active') {
                return response()->json(['msg_middleware' => 'Usuario desactivado'], 401);
            }

            $request->merge([
                'id_user' => $id_user,
                'role_user_request' => $user->role,
            ]);

            User::where('id', $user->id)->update([
                'last_request_at' => now()
            ]);

            return $next($request);
        }

        // 2. Si no es un User, buscar en Client
        $client = Client::where('id', $id_user)->first();

        if ($client) {
            if (isset($client->status) && $client->status !== 'active') {
                return response()->json(['msg_middleware' => 'Cliente desactivado'], 401);
            }

            $request->merge([
                'id_user' => $id_user,
                'role_user_request' => 'client',
            ]);

            return $next($request);
        }

        return response()->json(['msg_middleware' => 'Usuario no encontrado'], 401);
    }
}
