require('dotenv').config();

console.log('='.repeat(60));
console.log('EMAIL CONFIGURATION CHECK');
console.log('='.repeat(60));
console.log('');
console.log(
  'RESEND_API_KEY:',
  process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Not configured'
);
console.log(
  'FROM_EMAIL:',
  process.env.FROM_EMAIL || 'Default: noreply@mutualfunds.com'
);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
console.log('');
console.log('='.repeat(60));
console.log('WELCOME EMAIL FLOW');
console.log('='.repeat(60));
console.log('');
console.log('1. User Registration (POST /api/auth/register)');
console.log('   - User registers with email/password');
console.log('   - sendWelcomeEmail() is called');
console.log('   - Email template includes: name, authMethod: "email"');
console.log('');
console.log('2. Google Sign-In (POST /api/auth/google)');
console.log('   - User signs in with Google');
console.log('   - If new user, sendWelcomeEmail() is called');
console.log('   - Email template includes: name, authMethod: "google"');
console.log('');
console.log('='.repeat(60));
console.log('CURRENT STATUS');
console.log('='.repeat(60));
console.log('');

if (
  process.env.RESEND_API_KEY &&
  process.env.RESEND_API_KEY !== 'your-resend-api-key-here'
) {
  console.log('✅ Email service is ENABLED');
  console.log('✅ Welcome emails will be sent on:');
  console.log('   - New user registration');
  console.log('   - First-time Google sign-in');
} else {
  console.log('⚠️  Email service is DISABLED');
  console.log('⚠️  Welcome emails will be skipped');
  console.log('');
  console.log('To enable emails:');
  console.log('1. Add valid RESEND_API_KEY to .env file');
  console.log(
    '2. Optionally set FROM_EMAIL (default: noreply@mutualfunds.com)'
  );
}
console.log('');
