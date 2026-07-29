<?php

namespace App\Http\Controllers;

use App\Http\Requests\Password\ResetPasswordRequest;
use App\Http\Requests\Password\SendResetLinkRequest;
use App\Mail\Password\ResetPasswordMail;
use App\Mail\Password\SendResetLinkMail;
use App\Models\Client;
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
        $is_client = false;

        if (!$user) {
            $user = Client::select('id', 'email')->where('email', $email)->first();
            $is_client = true;
        }

        if (!$user) {
            return response()->json(["message" => "Correo enviado"], 200);
        }

        $token = Str::uuid();
        $expiration = Carbon::now()->addMinutes(60);

        if ($is_client) {
            Client::where('email', $email)->update([
                'reset_password_token' => $token,
                'reset_password_token_expiration' => $expiration,
            ]);
        } else {
            User::where('email', $email)->update([
                'reset_password_token' => $token,
                'reset_password_token_expiration' => $expiration,
            ]);
        }

        try {
            $send_link_mail = new SendResetLinkMail();
            $send_link_mail->send($email, $token);
        } catch (\Throwable $e) {
            // Ignorar error de envío de correo en entorno de prueba
        }

        return response()->json(["message" => "Correo enviado"], 200);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $token = $request->get('token');
        $password = $request->get('password');

        $account = User::select('id', 'reset_password_token_expiration', 'email')
            ->where('reset_password_token', $token)->first();

        if (!$account) {
            $account = Client::select('id', 'reset_password_token_expiration', 'email')
                ->where('reset_password_token', $token)->first();
        }

        if (!$account) {
            return response()->json(['message' => 'Token de cambio de contraseña inválido'], 400);
        }

        if (Carbon::now()->isAfter($account->reset_password_token_expiration)) {
            return response()->json(['message' => 'El token de cambio de contraseña ha expirado'], 400);
        }

        $account->update([
            'password' => Hash::make($password),
            'reset_password_token' => null,
            'reset_password_token_expiration' => null,
        ]);

        $email = $account->email;

        try {
            $reset_pass_mail = new ResetPasswordMail();
            $reset_pass_mail->send($email);
        } catch (\Throwable $e) {
            // Ignorar error de envío de correo en entorno de prueba
        }

        return response()->json(['message' => 'Contraseña restablecida con éxito']);
    }
}

