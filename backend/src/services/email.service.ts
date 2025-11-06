import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production: használd az igazi SMTP szolgáltatást (pl. Gmail, SendGrid, stb.)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Használd az Ethereal email service-t (fake SMTP)
      // Vagy ha van beállítva SMTP, használd azt
      if (process.env.SMTP_HOST) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Fallback: console logging
        this.transporter = nodemailer.createTransport({
          streamTransport: true,
          newline: 'unix',
          buffer: true,
        });
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Stork App <noreply@storkapp.hu>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      };

      const info = await this.transporter.sendMail(mailOptions);

      if (process.env.NODE_ENV !== 'production') {
        logger.info('Email sent:', info);
        logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));

        // In development without real SMTP, log the email content
        if (!process.env.SMTP_HOST) {
          logger.info('=== EMAIL CONTENT ===');
          logger.info(`To: ${options.to}`);
          logger.info(`Subject: ${options.subject}`);
          logger.info('HTML:', options.html);
          logger.info('===================');
        }
      }

      return true;
    } catch (error) {
      logger.error('Email send error:', error);
      return false;
    }
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string
  ): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 Stork App</h1>
          </div>
          <div class="content">
            <h2>Üdvözlünk, ${firstName}!</h2>
            <p>Köszönjük, hogy regisztráltál a Stork App-ra!</p>
            <p>Az email címed megerősítéséhez kattints az alábbi gombra:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Email cím megerősítése</a>
            </p>
            <p>Vagy másold be ezt a linket a böngésződbe:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p><strong>Ez a link 24 órán belül érvényes.</strong></p>
            <p>Ha nem te regisztráltál, figyelmen kívül hagyhatod ezt az emailt.</p>
          </div>
          <div class="footer">
            <p>Stork App - Segítünk az állatoknak új otthont találni</p>
            <p>Ez egy automatikus email, kérjük ne válaszolj rá.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Üdvözlünk a Stork App-on, ${firstName}!

Az email címed megerősítéséhez kattints az alábbi linkre:
${verificationUrl}

Ez a link 24 órán belül érvényes.

Ha nem te regisztráltál, figyelmen kívül hagyhatod ezt az emailt.

Stork App - Segítünk az állatoknak új otthont találni
    `;

    return this.sendEmail({
      to: email,
      subject: 'Email cím megerősítése - Stork App',
      html,
      text,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 Stork App</h1>
          </div>
          <div class="content">
            <h2>Jelszó visszaállítás</h2>
            <p>Kedves ${firstName}!</p>
            <p>Jelszó visszaállítási kérelmet kaptunk a fiókodhoz.</p>
            <p>A jelszavad visszaállításához kattints az alábbi gombra:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Jelszó visszaállítása</a>
            </p>
            <p>Vagy másold be ezt a linket a böngésződbe:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>Ez a link 1 órán belül érvényes.</strong></p>
            <p>Ha nem te kérted a jelszó visszaállítást, figyelmen kívül hagyhatod ezt az emailt.</p>
          </div>
          <div class="footer">
            <p>Stork App - Segítünk az állatoknak új otthont találni</p>
            <p>Ez egy automatikus email, kérjük ne válaszolj rá.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Jelszó visszaállítás - Stork App

Kedves ${firstName}!

Jelszó visszaállítási kérelmet kaptunk a fiókodhoz.

A jelszavad visszaállításához kattints az alábbi linkre:
${resetUrl}

Ez a link 1 órán belül érvényes.

Ha nem te kérted a jelszó visszaállítást, figyelmen kívül hagyhatod ezt az emailt.

Stork App - Segítünk az állatoknak új otthont találni
    `;

    return this.sendEmail({
      to: email,
      subject: 'Jelszó visszaállítás - Stork App',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
