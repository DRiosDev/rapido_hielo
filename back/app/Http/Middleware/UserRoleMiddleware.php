<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $role = $request->get('role_user_request');

        $allowedRoles = !empty($roles) ? $roles : ['admin', 'owner'];

        if (!in_array($role, $allowedRoles)) {
            return response()->json(['msg_middleware' => 'No tienes acceso a estos módulos'], 403);
        }

        return $next($request);
    }
}
