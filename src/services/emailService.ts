import { Resend } from 'resend';
import * as Handlebars from 'handlebars';

interface EmailTemplate {
  subject: string;
  html: string;
}

interface VerificationEmailData {
  name: string;
  verificationUrl: string;
}

interface AlertEmailData {
  name: string;
  fundName: string;
  alertType: string;
  condition: string;
  currentValue: string;
}

interface DigestEmailData {
  name: string;
  portfolioSummary: {
    totalValue: string;
    dayChange: string;
    dayChangePercent: string;
  };
  topPerformers: Array<{
    name: string;
    change: string;
  }>;
  alerts: Array<{
    fundName: string;
    message: string;
  }>;
}

interface WelcomeEmailData {
  name: string;
  authMethod: 'google' | 'email';
}

interface PasswordResetEmailData {
  name: string;
  resetUrl: string;
}

export class EmailService {
  private resend: Resend | null;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'your-resend-api-key-here') {
      console.warn(
        '⚠️  RESEND_API_KEY is not configured - email sending will be disabled'
      );
      this.resend = null;
    } else {
      this.resend = new Resend(apiKey);
    }

    this.fromEmail = process.env.FROM_EMAIL || 'noreply@mutualfunds.com';
  }

  /**
   * Send welcome email to newly registered user
   */
  async sendWelcomeEmail(
    to: string,
    data: WelcomeEmailData
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log('Email service disabled - skipping welcome email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const template = this.getWelcomeTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`✓ Welcome email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send welcome email to ${to}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    data: PasswordResetEmailData
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log('Email service disabled - skipping password reset email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const template = this.getPasswordResetTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`✓ Password reset email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send password reset email to ${to}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendVerificationEmail(
    to: string,
    data: VerificationEmailData
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log('Email service disabled - skipping verification email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const template = this.getVerificationTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Verification email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send verification email to ${to}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendAlertEmail(
    to: string,
    data: AlertEmailData
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log('Email service disabled - skipping alert email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const template = this.getAlertTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Alert email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send alert email to ${to}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendDigestEmail(
    to: string,
    data: DigestEmailData
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log('Email service disabled - skipping digest email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const template = this.getDigestTemplate();
      const compiled = Handlebars.compile(template.html);
      const html = compiled(data);

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html,
      });

      console.log(`Digest email sent to ${to}:`, result.data?.id);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send digest email to ${to}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getWelcomeTemplate(): EmailTemplate {
    return {
      subject: '🎉 Welcome to Mutual Funds Platform!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Mutual Funds Platform</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Mutual Funds Platform! 🎉</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin-top: 0;">Hello {{name}}!</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        Thank you for joining Mutual Funds Platform! We're excited to have you on board.
                      </p>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        You've successfully registered {{#if (eq authMethod 'google')}}using your Google account{{else}}with your email and password{{/if}}. You can now:
                      </p>
                      <ul style="color: #666666; font-size: 16px; line-height: 1.8;">
                        <li>📊 Browse thousands of mutual funds</li>
                        <li>💼 Build and track your investment portfolio</li>
                        <li>📈 Compare fund performance and overlap</li>
                        <li>🎯 Set financial goals and get recommendations</li>
                        <li>📱 Receive personalized alerts and insights</li>
                      </ul>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Start Exploring
                        </a>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                        If you have any questions, feel free to reach out to our support team.
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                        Happy Investing!<br>
                        <strong>The Mutual Funds Platform Team</strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Mutual Funds Platform. All rights reserved.
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                        This is an automated email. Please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  private getPasswordResetTemplate(): EmailTemplate {
    return {
      subject: '🔐 Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset Request 🔐</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin-top: 0;">Hello {{name}},</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="{{resetUrl}}" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Reset Password
                        </a>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="color: #667eea; font-size: 14px; word-break: break-all;">
                        {{resetUrl}}
                      </p>
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                        <p style="color: #856404; font-size: 14px; margin: 0;">
                          ⚠️ <strong>Security Notice:</strong><br>
                          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Mutual Funds Platform. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  private getVerificationTemplate(): EmailTemplate {
    return {
      subject: 'Verify Your Mutual Funds Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Mutual Funds Portal</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Thank you for signing up! Please verify your email address to complete your account setup.</p>
              <p>Click the button below to verify your account:</p>
              <a href="{{verificationUrl}}" class="button">Verify Account</a>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getAlertTemplate(): EmailTemplate {
    return {
      subject: 'Investment Alert - {{fundName}}',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Investment Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Investment Alert</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Your alert for <strong>{{fundName}}</strong> has been triggered.</p>
              <div class="alert-box">
                <h3>Alert Details:</h3>
                <p><strong>Type:</strong> {{alertType}}</p>
                <p><strong>Condition:</strong> {{condition}}</p>
                <p><strong>Current Value:</strong> {{currentValue}}</p>
              </div>
              <p>Please review your investment strategy and consider appropriate action.</p>
              <p>Login to your account to manage your alerts and portfolio.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  private getDigestTemplate(): EmailTemplate {
    return {
      subject: 'Your Daily Investment Digest',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Digest</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .summary-box { background: #f0f9ff; border: 1px solid #7dd3fc; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .performer { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .performer:last-child { border-bottom: none; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Investment Digest</h1>
            </div>
            <div class="content">
              <h2>Hello {{name}},</h2>
              <p>Here's your daily portfolio summary:</p>
              
              <div class="summary-box">
                <h3>Portfolio Summary</h3>
                <p><strong>Total Value:</strong> {{portfolioSummary.totalValue}}</p>
                <p><strong>Today's Change:</strong> 
                  <span class="{{#if portfolioSummary.dayChange}}{{#if (gt portfolioSummary.dayChange 0)}}positive{{else}}negative{{/if}}{{/if}}">
                    {{portfolioSummary.dayChange}} ({{portfolioSummary.dayChangePercent}})
                  </span>
                </p>
              </div>

              {{#if topPerformers}}
              <h3>Top Performers</h3>
              {{#each topPerformers}}
              <div class="performer">
                <strong>{{name}}</strong>: <span class="positive">{{change}}</span>
              </div>
              {{/each}}
              {{/if}}

              {{#if alerts}}
              <h3>Active Alerts</h3>
              {{#each alerts}}
              <div class="performer">
                <strong>{{fundName}}</strong>: {{message}}
              </div>
              {{/each}}
              {{/if}}

              <p>Login to your account for detailed analysis and portfolio management.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Mutual Funds Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }
}

export const emailService = new EmailService();
