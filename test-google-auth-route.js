/**
 * Test script to verify Google OAuth route is accessible
 *
 * Usage:
 *   node test-google-auth-route.js
 */

const BACKEND_URL = 'https://mutualfun-backend.vercel.app/api/auth/google';

async function testGoogleAuthRoute() {
  console.log('🧪 Testing Google OAuth route...\n');
  console.log(`📍 URL: ${BACKEND_URL}\n`);

  try {
    // Test 1: Check if route responds (should fail with 401 since no token)
    console.log('Test 1: Sending POST request without token...');
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.status === 401 && data.message === 'Token missing') {
      console.log(
        '\n✅ SUCCESS! Route exists and returns expected error for missing token'
      );
      console.log(
        '\nRoute is working correctly! The 401 error is expected when no token is provided.'
      );
      return true;
    } else if (response.status === 404) {
      console.log('\n❌ FAILED! Route returned 404 - route not found');
      console.log(
        '\nThe route /api/auth/google does not exist on the backend.'
      );
      console.log('This is the issue causing the frontend error.');
      return false;
    } else {
      console.log('\n⚠️ Unexpected response');
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.message.includes('Unexpected token')) {
      console.log(
        '\n🔍 This error suggests the server returned HTML instead of JSON (404 page)'
      );
      console.log(
        'The route /api/auth/google is NOT accessible on the backend.'
      );
    }
    return false;
  }
}

// Test 2: Check health endpoint
async function testHealthEndpoint() {
  console.log('\n\n🧪 Testing health endpoint...\n');
  const healthUrl = 'https://mutualfun-backend.vercel.app/api/health';
  console.log(`📍 URL: ${healthUrl}\n`);

  try {
    const response = await fetch(healthUrl);
    console.log(`Status: ${response.status}`);

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ Health endpoint working!');
      return true;
    }
  } catch (error) {
    console.error('\n❌ Health endpoint error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('   Backend Route Test for Google OAuth\n');
  console.log('═══════════════════════════════════════════════════════\n');

  await testHealthEndpoint();
  await testGoogleAuthRoute();

  console.log('\n═══════════════════════════════════════════════════════\n');
  console.log('   Test Complete\n');
  console.log('═══════════════════════════════════════════════════════\n');
}

runTests();
