<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            $user = Auth::user();

            // Permitir si el rol del usuario está en la lista de roles permitidos
            if (! in_array($user->role, $roles)) {
                return response()->json(['msg_middleware' => 'No tienes acceso a estos modulos'], 401);
            }

            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al verificar el rol del usuario'], 500);
        }
    }
}
