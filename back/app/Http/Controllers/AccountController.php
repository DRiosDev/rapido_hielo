<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\ChangePasswordRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Mail\Password\ResetPasswordMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    public function update(UpdateAccountRequest $request)
    {
        $user = Auth::user();

        User::where('id', $user->id)->update([
            'name' => $request->get('name'),
            'lastname' => $request->get('lastname'),
            'email' => $request->get('email'),
        ]);

        return response()->json(['message' => 'Usuario editado con éxito'], 200);
    }

    public function me()
    {
        $user = Auth::user();

        $user = User::with(['client:user_id,name,lastname', 'staff:user_id,name,lastname'])
            ->select('id', 'email', 'role', 'status')
            ->where('id', $user->id)
            ->firstOrFail();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'name' => $user->role === 'client'
                ? $user->client?->name
                : $user->staff?->name,
            'lastname' => $user->role === 'client'
                ? $user->client?->lastname
                : $user->staff?->lastname,
        ]);
    }

    public function updatePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();

        $user = User::select('id', 'password', 'email')->where('id', $user->id)->firstOrFail();

        if (!Hash::check($request->get('current_password'), $user->password)) {
            // Verificar si la contraseña proporcionada coincide con la contraseña almacenada en la base de datos
            return response()->json(['message' => 'La contraseña no coincide'], 400);
        }

        $user->update([
            'password' => Hash::make($request->get('new_password')),
        ]);

        $email = $user->email;

        $mail = new ResetPasswordMail();
        $mail->send($email);

        return response()->json(['message' => 'Contraseña cambiada con éxito']);
    }
}
