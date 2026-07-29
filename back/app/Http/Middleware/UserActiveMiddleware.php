<?php

namespace App\Http\Middleware;

use App\Models\User;
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
        $type = $payload->get('type');

        $role = 'client';
        $user_model = null;

        if ($type === 'client') {
            $user_model = \App\Models\Client::where('id', $id_user)
                ->where('status', '=', 'active')
                ->first();
            $role = 'client';
        } else {
            $user_model = User::where('id', $id_user)
                ->where('status', '=', 'active')
                ->first();
            if ($user_model) {
                $role = $user_model->role;
            } else {
                $user_model = \App\Models\Client::where('id', $id_user)
                    ->where('status', '=', 'active')
                    ->first();
                $role = 'client';
            }
        }

        if (!$user_model) {
            return response()->json(['msg_middleware' => 'Usuario desactivado'], 401);
        }

        // añadir que el id_user sea el del payload
        $request->merge([
            'id_user' => $id_user,
            'role_user_request' => $role,
        ]);

        // Guardar última petición del usuario/cliente
        $user_model->update([
            'last_request_at' => now()
        ]);

        return $next($request);
    }
}
