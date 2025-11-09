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

        $user = User::select('id', 'name', 'lastname', 'email', 'role', 'status')
            ->where('id', $user->id)
            ->firstOrFail();

        return response()->json($user);
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
