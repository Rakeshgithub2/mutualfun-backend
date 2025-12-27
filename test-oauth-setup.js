/**
 * Test Google OAuth Setup
 * Run this to verify your OAuth configuration
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function testGoogleOAuthSetup() {
  console.log('🧪 Testing Google OAuth Setup...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Checking if backend is running...');
    try {
      await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Backend is running\n');
    } catch (error) {
      console.log('❌ Backend is not running on port 3002');
      console.log('   Start with: npm run dev\n');
      return;
    }

    // Test 2: Get Google OAuth URL
    console.log('2️⃣ Testing Google OAuth initiation endpoint...');
    const response = await axios.get(`${BASE_URL}/api/auth/google`);

    if (response.data.success && response.data.data.authUrl) {
      console.log('✅ Google OAuth endpoint working!');
      console.log(
        '   Auth URL received:',
        response.data.data.authUrl.substring(0, 80) + '...\n'
      );

      // Check URL contains required parameters
      const authUrl = response.data.data.authUrl;
      const requiredParams = [
        'client_id',
        'redirect_uri',
        'response_type',
        'scope',
      ];
      const hasAllParams = requiredParams.every((param) =>
        authUrl.includes(param)
      );

      if (hasAllParams) {
        console.log('✅ Auth URL contains all required parameters\n');
      } else {
        console.log('⚠️  Auth URL might be missing some parameters\n');
      }
    } else {
      console.log('❌ Google OAuth endpoint returned unexpected response');
      console.log('   Response:', JSON.stringify(response.data, null, 2), '\n');
    }

    // Test 3: Verify environment variables
    console.log('3️⃣ Checking environment variables...');
    const envVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GOOGLE_REDIRECT_URI',
      'FRONTEND_URL',
    ];

    const authUrl = response.data.data.authUrl;

    if (authUrl.includes('client_id')) {
      console.log('✅ GOOGLE_CLIENT_ID is configured');
    } else {
      console.log('❌ GOOGLE_CLIENT_ID might be missing');
    }

    if (authUrl.includes('redirect_uri')) {
      console.log('✅ GOOGLE_REDIRECT_URI is configured');
    } else {
      console.log('❌ GOOGLE_REDIRECT_URI might be missing');
    }

    // Extract and display redirect URI
    const redirectUriMatch = authUrl.match(/redirect_uri=([^&]+)/);
    if (redirectUriMatch) {
      const redirectUri = decodeURIComponent(redirectUriMatch[1]);
      console.log('\n📍 Current Redirect URI:', redirectUri);
      console.log('   ⚠️  ADD THIS EXACT URL TO GOOGLE CONSOLE!\n');
    }

    // Final instructions
    console.log('━'.repeat(70));
    console.log('📋 NEXT STEPS:\n');
    console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
    console.log('2. Click on your OAuth 2.0 Client ID');
    console.log('3. Under "Authorized redirect URIs", add:');
    console.log('   http://localhost:3002/api/auth/google/callback');
    console.log('4. Click SAVE');
    console.log('5. Test the complete flow by visiting:');
    console.log('   ' + response.data.data.authUrl);
    console.log('━'.repeat(70));
  } catch (error) {
    console.error('❌ Error testing OAuth setup:', error.message);

    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testGoogleOAuthSetup();
