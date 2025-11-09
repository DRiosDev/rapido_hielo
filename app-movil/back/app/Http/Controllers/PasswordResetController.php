<?php

namespace App\Http\Controllers;

use App\Http\Requests\Password\ResetPasswordRequest;
use App\Http\Requests\Password\SendResetLinkRequest;
use App\Mail\Password\ResetPasswordMail;
use App\Mail\Password\SendResetLinkMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetLink(SendResetLinkRequest $request)
    {
        $email = $request->get('email');

        $user = User::select('id', 'email')->where('email', $email)->first();

        if (!$user) {
            return response()->json(["message" => "Correo enviado"], 200);
        }

        $token = Str::uuid();
        $expiration = Carbon::now()->addMinutes(60);

        User::where('email', $email)->update([
            'reset_password_token' => $token,
            'reset_password_token_expiration' => $expiration,
        ]);

        $send_link_mail = new SendResetLinkMail();
        $send_link_mail->send($email,  $token);

        return response()->json(["message" => "Correo enviado"], 200);
    }


    public function resetPassword(ResetPasswordRequest $request)
    {
        $token = $request->get('token');
        $password = $request->get('password');

        $user = User::select('id', 'reset_password_token_expiration', 'email')
            ->where('reset_password_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Token de cambio de contraseña inválido'], 400);
        }

        if (Carbon::now()->isAfter($user->reset_password_token_expiration)) {
            return response()->json(['message' => 'El token de cambio de contraseña ha expirado'], 400);
        }


        $user->update([
            'password' => Hash::make($password),
            'reset_password_token' => null,
            'reset_password_token_expiration' => null,
        ]);

        $email = $user->email;

        $reset_pass_mail = new ResetPasswordMail();
        $reset_pass_mail->send($email);

        return response()->json(['message' => 'Contraseña restablecida con éxito']);
    }
}
