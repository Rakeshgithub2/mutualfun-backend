/**
 * Test script to verify welcome email functionality
 * Run with: node test-welcome-email.js
 */

const { Resend } = require('resend');
require('dotenv').config();

async function testWelcomeEmail() {
  console.log('\n🧪 Testing Welcome Email Configuration...\n');

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const frontendUrl = process.env.FRONTEND_URL;

  console.log('📋 Environment Check:');
  console.log(`   RESEND_API_KEY: ${apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   FROM_EMAIL: ${fromEmail || '❌ Missing'}`);
  console.log(`   FRONTEND_URL: ${frontendUrl || 'http://localhost:3001'}`);
  console.log();

  if (!apiKey || apiKey === 'your-resend-api-key-here') {
    console.log('❌ RESEND_API_KEY is not properly configured!');
    console.log('   Please set a valid Resend API key in .env file');
    return;
  }

  // Initialize Resend
  const resend = new Resend(apiKey);

  // Test email data
  const testData = {
    name: 'Test User',
    authMethod: 'email',
  };

  console.log('📧 Sending test welcome email...');
  console.log(
    `   To: ${process.env.EMAIL_USER || 'rakeshd01042024@gmail.com'}`
  );
  console.log(`   From: ${fromEmail}`);
  console.log();

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: process.env.EMAIL_USER || 'rakeshd01042024@gmail.com',
      subject: '🎉 Welcome to Mutual Funds Platform! (TEST)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Mutual Funds Platform! 🎉</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #333;">Hello ${testData.name}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for joining Mutual Funds Platform! We're excited to have you on board.
              </p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                You've successfully registered with your email. You can now:
              </p>
              <ul style="color: #666; font-size: 16px; line-height: 1.8;">
                <li>📊 Browse thousands of mutual funds</li>
                <li>💼 Build and track your investment portfolio</li>
                <li>📈 Compare fund performance and overlap</li>
                <li>🎯 Set financial goals and get recommendations</li>
                <li>📱 Receive personalized alerts and insights</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${frontendUrl || 'http://localhost:5001'}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold;">
                  Start Exploring
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                Happy Investing!<br>
                <strong>The Mutual Funds Platform Team</strong>
              </p>
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; font-size: 14px; margin: 0;">
                  ⚠️ <strong>This is a TEST email</strong><br>
                  Testing welcome email functionality for your Mutual Funds platform.
                </p>
              </div>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Mutual Funds Platform. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.data?.id);
    console.log();
    console.log(
      '📬 Check your inbox at:',
      process.env.EMAIL_USER || 'rakeshd01042024@gmail.com'
    );
    console.log('   (Also check spam/junk folder)');
    console.log();
    console.log('🎉 Welcome email system is working correctly!');
  } catch (error) {
    console.log('❌ Failed to send email!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
  }
}

// Run the test
testWelcomeEmail().catch(console.error);
