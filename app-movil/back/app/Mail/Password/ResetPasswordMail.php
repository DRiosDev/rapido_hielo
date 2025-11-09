<?php

namespace App\Mail\Password;

use App\Services\MailService;
use Illuminate\Support\Facades\View;

class ResetPasswordMail
{
    protected MailService $mailer;

    public function __construct()
    {
        $this->mailer = new MailService();
    }

    public function send(array|string $email)
    {
        $subject = 'Contraseña reestablecida';

        // Renderizar la vista como string
        $html = View::make('mail.html.reset-password-mail', [
            'title' => $subject,
        ])->render();

        return $this->mailer->sendMail($email, $subject, $html);
    }
}
