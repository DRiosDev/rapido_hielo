<?php

namespace App\Http\Middleware;

use App\Models\Client;
use App\Models\User;
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
            $payload = JWTAuth::parseToken()->getPayload();  // Obtener el payload sin cargar el usuario completo
            $id = $payload->get('id') ?? $payload->get('sub');

            // intentar encontrar primero en users
            $user = User::select('id', 'status', 'role')->find($id);

            // Autenticar al usuario sin cargar todos los datos
            Auth::setUser($user);
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
