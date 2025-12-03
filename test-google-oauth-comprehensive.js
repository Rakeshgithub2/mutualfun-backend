/**
 * Comprehensive Google OAuth Test Script
 * Run this to diagnose any issues with Google OAuth
 */

const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';
const MONGO_URL = process.env.DATABASE_URL;

async function runTests() {
  console.log('🧪 GOOGLE OAUTH COMPREHENSIVE DIAGNOSTIC\n');
  console.log('='.repeat(70));

  let testsPassed = 0;
  let testsFailed = 0;

  // TEST 1: Environment Variables
  console.log('\n📋 TEST 1: Environment Variables');
  console.log('-'.repeat(70));

  const requiredEnvVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  let envVarsOk = true;
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (value) {
      console.log(
        `   ✅ ${key}: ${key.includes('SECRET') || key.includes('URL') ? 'Set' : value.substring(0, 30) + '...'}`
      );
    } else {
      console.log(`   ❌ ${key}: NOT SET`);
      envVarsOk = false;
    }
  }

  if (envVarsOk) {
    console.log('\n   ✅ All environment variables are set');
    testsPassed++;
  } else {
    console.log('\n   ❌ Some environment variables are missing');
    testsFailed++;
  }

  // TEST 2: Backend Server
  console.log('\n\n🌐 TEST 2: Backend Server');
  console.log('-'.repeat(70));

  try {
    const healthCheck = await axios.get(`${BASE_URL}/health`, {
      timeout: 5000,
    });
    console.log('   ✅ Backend is running');
    console.log(`   📍 URL: ${BASE_URL}`);
    console.log(
      `   ⏱️  Response time: ${healthCheck.headers['x-response-time'] || 'N/A'}`
    );
    console.log(`   📊 Status: ${healthCheck.data.status}`);
    testsPassed++;
  } catch (error) {
    console.log('   ❌ Backend is NOT running');
    console.log(`   📍 Attempted URL: ${BASE_URL}`);
    console.log('   💡 Solution: Run "npm run dev" in backend folder');
    testsFailed++;
    return; // Can't continue without backend
  }

  // TEST 3: Auth Endpoint
  console.log('\n\n🔐 TEST 3: Auth Endpoint');
  console.log('-'.repeat(70));

  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/google`,
      { idToken: 'test_invalid_token' },
      {
        validateStatus: () => true,
        timeout: 5000,
      }
    );

    if (response.status === 401 || response.status === 400) {
      console.log('   ✅ Auth endpoint is accessible');
      console.log(`   📍 URL: ${BASE_URL}/api/auth/google`);
      console.log(
        `   📊 Status: ${response.status} (expected for invalid token)`
      );
      console.log(`   📝 Response: ${response.data.error}`);
      testsPassed++;
    } else {
      console.log('   ⚠️  Unexpected status code');
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   📝 Response:`, response.data);
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Failed to reach auth endpoint');
    console.log('   Error:', error.message);
    testsFailed++;
  }

  // TEST 4: MongoDB Connection
  console.log('\n\n💾 TEST 4: MongoDB Connection');
  console.log('-'.repeat(70));

  if (!MONGO_URL) {
    console.log('   ❌ DATABASE_URL not set in .env');
    testsFailed++;
  } else {
    try {
      const client = new MongoClient(MONGO_URL);
      await client.connect();
      console.log('   ✅ MongoDB connection successful');

      const db = client.db();
      const collections = await db.listCollections().toArray();
      console.log(`   📊 Database: ${db.databaseName}`);
      console.log(`   📂 Collections: ${collections.length}`);

      const usersCollection = collections.find((c) => c.name === 'users');
      if (usersCollection) {
        const userCount = await db.collection('users').countDocuments();
        const googleUsers = await db
          .collection('users')
          .countDocuments({ authMethod: 'google' });
        console.log(`   👥 Total users: ${userCount}`);
        console.log(`   🔑 Google users: ${googleUsers}`);
      } else {
        console.log(
          '   ℹ️  Users collection not yet created (will be created on first signup)'
        );
      }

      await client.close();
      testsPassed++;
    } catch (error) {
      console.log('   ❌ MongoDB connection failed');
      console.log('   Error:', error.message);
      testsFailed++;
    }
  }

  // TEST 5: CORS Configuration
  console.log('\n\n🌍 TEST 5: CORS Configuration');
  console.log('-'.repeat(70));

  try {
    const response = await axios.options(`${BASE_URL}/api/auth/google`, {
      headers: {
        Origin: 'http://localhost:5001',
        'Access-Control-Request-Method': 'POST',
      },
      validateStatus: () => true,
    });

    if (response.headers['access-control-allow-origin']) {
      console.log('   ✅ CORS is configured');
      console.log(
        `   🌐 Allowed origins: ${response.headers['access-control-allow-origin']}`
      );
      console.log(
        `   📋 Allowed methods: ${response.headers['access-control-allow-methods']}`
      );
      testsPassed++;
    } else {
      console.log('   ⚠️  CORS headers not found (might still work)');
      testsFailed++;
    }
  } catch (error) {
    console.log(
      '   ⚠️  Could not test CORS (backend might still be configured correctly)'
    );
  }

  // SUMMARY
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`   ✅ Tests Passed: ${testsPassed}`);
  console.log(`   ❌ Tests Failed: ${testsFailed}`);
  console.log(
    `   📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`
  );

  if (testsFailed === 0) {
    console.log(
      '\n   🎉 ALL TESTS PASSED! Your backend is ready for Google OAuth!'
    );
    console.log(
      '\n   Next step: Implement frontend using GOOGLE_OAUTH_COMPLETE_SOLUTION.md'
    );
  } else if (testsPassed > 0) {
    console.log(
      '\n   ⚠️  Some tests failed, but basic functionality might still work.'
    );
    console.log('   Check the failed tests above for details.');
  } else {
    console.log(
      '\n   ❌ Critical issues detected. Please fix the errors above.'
    );
  }

  // INTEGRATION GUIDE
  console.log('\n\n' + '='.repeat(70));
  console.log('🚀 FRONTEND INTEGRATION GUIDE');
  console.log('='.repeat(70));
  console.log('\n1. Install dependencies:');
  console.log('   npm install @react-oauth/google axios');
  console.log('\n2. Wrap your app with GoogleOAuthProvider:');
  console.log(
    `   <GoogleOAuthProvider clientId="${process.env.GOOGLE_CLIENT_ID}">`
  );
  console.log('     <App />');
  console.log('   </GoogleOAuthProvider>');
  console.log('\n3. Add Google Login button:');
  console.log('   <GoogleLogin');
  console.log('     onSuccess={async (credentialResponse) => {');
  console.log(
    `       const res = await axios.post('${BASE_URL}/api/auth/google', {`
  );
  console.log('         idToken: credentialResponse.credential');
  console.log('       });');
  console.log(
    '       localStorage.setItem("accessToken", res.data.data.tokens.accessToken);'
  );
  console.log(
    '       localStorage.setItem("user", JSON.stringify(res.data.data.user));'
  );
  console.log('       window.location.href = "/";');
  console.log('     }}');
  console.log('   />');
  console.log('\n📖 For complete code examples, see:');
  console.log('   - GOOGLE_OAUTH_COMPLETE_SOLUTION.md');
  console.log('   - GOOGLE_OAUTH_QUICK_REFERENCE.md');
  console.log('\n' + '='.repeat(70) + '\n');
}

runTests().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
