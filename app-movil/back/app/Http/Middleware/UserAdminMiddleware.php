<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->get('role_user_request');

        if ($role !== 'admin') {
            return response()->json(['msg_middleware' => 'No tienes acceso a estos modulos'], 401);
        }

        return $next($request);
    }
}
