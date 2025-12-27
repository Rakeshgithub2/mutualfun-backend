/**
 * Email Service
 * Handles sending emails using Resend API
 */

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  /**
   * Send OTP email for password reset
   */
  static async sendPasswordResetOTP(email, otp, userName) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Password Reset OTP - Mutual Funds App',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .otp { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                  <p>Hi ${userName || 'there'},</p>
                  <p>You requested to reset your password. Use the OTP below to proceed:</p>
                  
                  <div class="otp-box">
                    <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                    <div class="otp">${otp}</div>
                    <p style="margin: 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
                  </div>

                  <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul style="margin: 10px 0;">
                      <li>Never share this OTP with anyone</li>
                      <li>This OTP expires in 10 minutes</li>
                      <li>If you didn't request this, ignore this email</li>
                    </ul>
                  </div>

                  <p>Need help? Contact our support team.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Mutual Funds App. All rights reserved.</p>
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
      }

      console.log('✅ Password reset OTP sent:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(email, userName) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to Mutual Funds App! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Welcome Aboard!</h1>
                </div>
                <div class="content">
                  <p>Hi ${userName},</p>
                  <p>Welcome to Mutual Funds App! We're excited to have you on board.</p>
                  <p>Your account has been successfully created. You can now:</p>
                  <ul>
                    <li>📊 Track your mutual fund investments</li>
                    <li>📈 Monitor portfolio performance</li>
                    <li>🎯 Set financial goals</li>
                    <li>🔔 Get timely reminders</li>
                  </ul>
                  <p style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Mutual Funds App. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Welcome email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password changed confirmation
   */
  static async sendPasswordChangedEmail(email, userName) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Password Changed Successfully',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Password Updated</h1>
                </div>
                <div class="content">
                  <p>Hi ${userName},</p>
                  <p>Your password has been successfully changed.</p>
                  <div class="warning">
                    <strong>⚠️ Didn't make this change?</strong>
                    <p>If you didn't change your password, please contact our support team immediately and secure your account.</p>
                  </div>
                  <p>Date: ${new Date().toLocaleString()}</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Mutual Funds App. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Password changed email error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
