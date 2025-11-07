<?php

namespace App\Http\Middleware;

use App\Models\Client;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class ClientActiveMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $payload = JWTAuth::parseToken()->getPayload();

        $id_client =  $payload->get('id');

        $client = Client::where('id', $id_client)
            ->where('status', '=', 'active')
            ->first();

        if (!$client) {
            return response()->json(['msg_middleware' => 'Usuario desactivado'], 401);
        }

        //Guardar ultima peticion del usuario
        Client::where('id', $client->id)->update([
            'last_request_at' => now()
        ]);

        return $next($request);
    }
}
