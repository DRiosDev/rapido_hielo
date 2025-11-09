<?php

namespace App\Mail;

use App\Services\MailService;
use Illuminate\Support\Facades\View;

class WelcomeMail
{
    protected MailService $mailer;

    public function __construct()
    {
        $this->mailer = new MailService();
    }

    public function send(array|string $email, string $name)
    {
        $subject = '¡Bienvenido a nuestra plataforma!';

        $frontend_url = config('app.frontend_url');
        $dashboard_url = $frontend_url . '/login?i=1';

        // Renderizar la vista como string
        $html = View::make('mail.html.welcome-mail', [
            'name' => $name,
            'url_action' => $dashboard_url,
        ])->render();

        return $this->mailer->sendMail($email, $subject, $html);
    }
}
