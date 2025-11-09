<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    protected PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->mail->CharSet = 'UTF-8';
        $this->mail->Encoding = 'base64';

        // Configuración SMTP
        $this->mail->isSMTP();
        $this->mail->SMTPDebug = 0;

        $this->mail->Host = env('MAIL_HOST', 'localhost');
        $this->mail->Port = env('MAIL_PORT', 25);

        // TLS/SSL
        $this->mail->SMTPAutoTLS = env('MAIL_SMTPAUTOTLS', false);
        $this->mail->SMTPSecure = env('MAIL_ENCRYPTION', false); // 'tls', 'ssl', o false

        // Autenticación
        $this->mail->SMTPAuth = env('MAIL_SMTPAUTH', false);
        $this->mail->Username = env('MAIL_USERNAME');
        $this->mail->Password = env('MAIL_PASSWORD');

        $this->mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
        $this->mail->isHTML(true); // Permitir HTML
    }

    public function sendMail(array|string $email, string $subject, string $body): bool
    {
        try {
            $this->mail->clearAddresses();
            // Manejar uno o múltiples correos
            if (is_array($email)) {
                // Si es un array, agregar múltiples destinatarios
                foreach ($email as $recipient) {
                    $this->mail->addAddress($recipient);
                }
            } elseif (is_string($email)) {
                // Si es un string, agregar un solo destinatario
                $this->mail->addAddress($email);
            }

            $this->mail->Subject = $subject;
            $this->mail->Body = $body;

            return $this->mail->send();
        } catch (Exception $e) {
            logger()->error("Mailer Error: " . $this->mail->ErrorInfo);
            return false;
        }
    }
}
