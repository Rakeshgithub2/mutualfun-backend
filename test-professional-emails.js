const EmailService = require('./src/services/email.service');

console.log('🧪 Testing Professional Email Templates\n');

// Test 1: Welcome Email
console.log('1️⃣ Testing Professional Welcome Email...');
EmailService.sendWelcomeEmail('rakeshd01042024@gmail.com', 'Rakesh Kumar')
  .then((result) => {
    if (result.success) {
      console.log('   ✅ Welcome email sent successfully!\n');
    } else {
      console.log('   ❌ Failed:', result.error, '\n');
    }

    // Test 2: OTP Email
    console.log('2️⃣ Testing Professional OTP Email...');
    return EmailService.sendPasswordResetOTP(
      'rakeshd01042024@gmail.com',
      '847293',
      'Rakesh Kumar'
    );
  })
  .then((result) => {
    if (result.success) {
      console.log('   ✅ OTP email sent successfully!\n');
    } else {
      console.log('   ❌ Failed:', result.error, '\n');
    }

    console.log('📬 Check your inbox: rakeshd01042024@gmail.com\n');
    console.log('Expected: 2 professional emails with company branding\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
