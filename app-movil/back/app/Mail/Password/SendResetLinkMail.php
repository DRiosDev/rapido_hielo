<?php

namespace App\Mail\Password;

use App\Services\MailService;
use Illuminate\Support\Facades\View;

class SendResetLinkMail
{
    protected MailService $mailer;

    public function __construct()
    {
        $this->mailer = new MailService();
    }

    public function send(array|string $email, string $token)
    {
        $subject = 'Reestablecer contraseña';
        $frontend_url = config('app.frontend_url');
        $dashboard_url = $frontend_url . '/cambiar-clave/' . $token;

        // Renderizar la vista como string
        $html = View::make('mail.html.send-reset-link-mail', [
            'title' => $subject,
            'url_action' => $dashboard_url,
        ])->render();

        return $this->mailer->sendMail($email, $subject, $html);
    }
}
