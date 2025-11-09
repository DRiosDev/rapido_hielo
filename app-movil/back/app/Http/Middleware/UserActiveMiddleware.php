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

        $id_user =  $payload->get('id');

        $user = User::where('id', $id_user)
            ->where('status', '=', 'active')
            ->select('role')
            ->first();

        if (!$user) {
            return response()->json(['msg_middleware' => 'Usuario desactivado'], 401);
        }

        //añadir que el id_user sea el del payload
        $request->merge([
            'id_user' => $id_user,
            'role_user_request' => $user->role,
        ]);

        //Guardar ultima peticion del usuario
        User::where('id', $user->id)->update([
            'last_request_at' => now()
        ]);

        return $next($request);
    }
}
