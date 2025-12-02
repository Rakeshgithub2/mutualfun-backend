const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function testGoogleOAuthFlow() {
  console.log('🧪 Testing Google OAuth Flow\n');

  try {
    // Step 1: Test the redirect endpoint
    console.log('1️⃣  Testing redirect to Google...');
    const redirectResponse = await axios.get(`${BASE_URL}/api/auth/google`, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302 || status < 400,
    });

    if (redirectResponse.status === 302) {
      console.log('✅ Redirect endpoint working');
      console.log(
        '   Redirects to:',
        redirectResponse.headers.location?.substring(0, 100) + '...'
      );
    } else {
      console.log('❌ Unexpected status:', redirectResponse.status);
    }

    // Step 2: Simulate callback with a test code
    console.log('\n2️⃣  Simulating callback endpoint...');
    console.log(
      "   (This will fail with 500 because code is invalid - that's expected)"
    );

    try {
      const callbackResponse = await axios.get(
        `${BASE_URL}/api/auth/google/callback?code=test_code_123&scope=email+profile+openid`,
        {
          maxRedirects: 0,
          validateStatus: () => true, // Accept any status
        }
      );

      console.log('   Status:', callbackResponse.status);
      console.log(
        '   Response:',
        JSON.stringify(callbackResponse.data, null, 2)
      );
    } catch (error) {
      console.log('   Error calling callback:', error.message);
    }

    // Step 3: Check environment variables
    console.log('\n3️⃣  Checking configuration...');
    console.log('   Expected Client ID: Should start with 336417139932-...');
    console.log(
      '   Expected Redirect URI: http://localhost:5001/api/auth/google/callback'
    );
    console.log(
      '\n   ⚠️  Check backend terminal for actual values printed during startup'
    );
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testGoogleOAuthFlow();
