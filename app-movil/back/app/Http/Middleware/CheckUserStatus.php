<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = Auth::user();

            if ($user->status !== 'active') {
                return response()->json(['error' => 'Tu cuenta está desactivada. Acceso denegado.'], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al verificar el estado del usuario'], 500);
        }

        return $next($request);
    }
}
