<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\ChangePasswordRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Mail\Password\ResetPasswordMail;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    public function update(UpdateAccountRequest $request)
    {
        $user = Auth::user();

        if ($user instanceof Client || (isset($user->role) && $user->role === 'client')) {
            Client::where('id', $user->id)->update([
                'name' => $request->get('name'),
                'lastname' => $request->get('lastname'),
                'email' => $request->get('email'),
            ]);
        } else {
            User::where('id', $user->id)->update([
                'name' => $request->get('name'),
                'lastname' => $request->get('lastname'),
                'email' => $request->get('email'),
            ]);
        }

        return response()->json(['message' => 'Usuario editado con éxito'], 200);
    }

    public function me()
    {
        $user = Auth::user();

        if ($user instanceof Client || (isset($user->role) && $user->role === 'client')) {
            $client = Client::select('id', 'name', 'lastname', 'email', 'status', 'address', 'phone')
                ->where('id', $user->id)
                ->first();

            if (!$client) {
                return response()->json(['error' => 'Cliente no encontrado'], 404);
            }

            return response()->json($client);
        }

        $user_data = User::select('id', 'email', 'role', 'status', 'name', 'lastname')
            ->where('id', $user->id)
            ->first();

        if (!$user_data) {
            $client = Client::select('id', 'name', 'lastname', 'email', 'status', 'address', 'phone')
                ->where('id', $user->id)
                ->first();

            if ($client) {
                return response()->json($client);
            }
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'id' => $user_data->id,
            'email' => $user_data->email,
            'role' => $user_data->role,
            'status' => $user_data->status,
            'name' => $user_data->name,
            'lastname' => $user_data->lastname,
        ]);
    }

    public function show()
    {
        return $this->me();
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();

        $account = User::select('id', 'password', 'email')->where('id', $user->id)->first();

        if (!$account) {
            $account = Client::select('id', 'password', 'email')->where('id', $user->id)->first();
        }

        if (!$account) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if (!Hash::check($request->get('current_password'), $account->password)) {
            return response()->json(['message' => 'La contraseña no coincide'], 400);
        }

        $account->update([
            'password' => Hash::make($request->get('new_password')),
        ]);

        $email = $account->email;

        try {
            $mail = new ResetPasswordMail();
            $mail->send($email);
        } catch (\Throwable $e) {
            // Ignorar fallo de envío de correo en entorno local
        }

        return response()->json(['message' => 'Contraseña cambiada con éxito']);
    }
}

