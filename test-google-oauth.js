/**
 * Test Google OAuth Endpoint
 *
 * This script tests the production-ready Google OAuth implementation
 */

const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';
const TEST_TOKEN = process.env.GOOGLE_TEST_TOKEN || 'test-token-here';

async function testGoogleLogin() {
  console.log('🧪 Testing Google OAuth Login...');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/google`,
      {
        token: TEST_TOKEN,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Success!');
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data.token) {
      console.log('🎉 Google login working correctly!');
      console.log(
        '🔑 JWT Token:',
        response.data.data.token.substring(0, 20) + '...'
      );
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
    return false;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');

  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Google OAuth Tests\n');
  console.log('='.repeat(50));

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log("\n⚠️  Backend is not responding. Make sure it's running.");
    return;
  }

  console.log('\n' + '='.repeat(50));
  await testGoogleLogin();

  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Tests complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Get a real Google ID token from your frontend');
  console.log(
    '  2. Test with: GOOGLE_TEST_TOKEN=<token> node test-google-oauth.js'
  );
  console.log('  3. Deploy to Vercel');
  console.log('  4. Test from frontend with real Google button\n');
}

runTests();
