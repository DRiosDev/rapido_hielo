<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\Client;
use Closure;
use Exception;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();
            $id = $payload->get('id') ?? $payload->get('sub');

            // intentar encontrar primero en users
            $user = User::select('id', 'status', 'role')->find($id);

            // si no está en users, buscar en clients
            if (!$user) {
                $user = Client::select('id', 'status')->find($id);
            }

            if (!$user) {
                return response()->json([
                    'error' => 'user_not_found',
                    'message' => 'Usuario no encontrado'
                ], 401);
            }

            // Autenticar al usuario / cliente
            Auth::setUser($user);

            $request->merge([
                'id_user' => $user->id,
                'role_user_request' => $user->role ?? 'client',
            ]);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'error' => 'token_expired',
                'message' => 'El token ha expirado'
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'error' => 'token_invalid',
                'message' => 'El token es inválido'
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'token_not_found',
                'message' => 'Token no encontrado o no proporcionado'
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'unauthorized',
                'message' => 'No autorizado'
            ], 401);
        }


        return $next($request);
    }
}
