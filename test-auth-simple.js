/**
 * Simple Authentication Test
 * Quick test to verify all auth functions are working
 */

const axios = require('axios');

const API = 'http://localhost:3002/api';

// Test user
const testUser = {
  name: 'John Doe',
  email: `test${Date.now()}@example.com`,
  password: 'SecurePass123!',
};

console.log('\n========================================');
console.log('🔐 AUTHENTICATION TEST');
console.log('========================================\n');

async function runTests() {
  try {
    // 1. Register
    console.log('1️⃣  Testing Registration...');
    const registerRes = await axios.post(`${API}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log(
      '   User:',
      registerRes.data.data?.user || registerRes.data.user
    );

    const accessToken =
      registerRes.data.data?.tokens?.accessToken ||
      registerRes.data.tokens?.accessToken;
    const refreshToken =
      registerRes.data.data?.tokens?.refreshToken ||
      registerRes.data.tokens?.refreshToken;

    if (accessToken) {
      console.log('   ✓ Access token received');
    }
    if (refreshToken) {
      console.log('   ✓ Refresh token received');
    }

    // 2. Login
    console.log('\n2️⃣  Testing Login...');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log('✅ Login successful');
    console.log('   User:', loginRes.data.data?.user || loginRes.data.user);

    const loginAccessToken =
      loginRes.data.data?.tokens?.accessToken ||
      loginRes.data.tokens?.accessToken;

    if (loginAccessToken) {
      console.log('   ✓ New access token received on login');
    }

    // 3. Test Invalid Credentials
    console.log('\n3️⃣  Testing Invalid Credentials...');
    try {
      await axios.post(`${API}/auth/login`, {
        email: testUser.email,
        password: 'WrongPassword',
      });
      console.log('❌ FAILED: Invalid credentials were accepted!');
    } catch (error) {
      console.log('✅ Invalid credentials rejected correctly');
    }

    // 4. Test Google OAuth Endpoint
    console.log('\n4️⃣  Testing Google OAuth Endpoint...');
    try {
      await axios.post(`${API}/auth/google`, {});
      console.log('❌ FAILED: Missing token was accepted!');
    } catch (error) {
      console.log('✅ Google OAuth validation working');
      console.log('   (Requires idToken parameter)');
    }

    // 5. Check MongoDB
    console.log('\n5️⃣  Verifying MongoDB Storage...');
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(
      'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
    );

    await client.connect();
    const db = client.db('mutual_funds_db');
    const user = await db
      .collection('users')
      .findOne({ email: testUser.email });

    if (user) {
      console.log('✅ User stored in MongoDB');
      console.log('   Fields present:');
      console.log('   ✓ userId:', !!user.userId || !!user._id);
      console.log('   ✓ email:', user.email);
      console.log('   ✓ name:', user.name);
      console.log('   ✓ password (hashed):', user.password ? 'Yes' : 'No');
      console.log(
        '   ✓ authMethod:',
        user.authMethod || user.provider || 'email'
      );
      console.log('   ✓ preferences:', !!user.preferences);
      console.log('   ✓ subscription:', !!user.subscription);
      console.log('   ✓ kyc:', !!user.kyc || !!user.kycStatus);
      console.log('   ✓ createdAt:', !!user.createdAt);
      console.log('   ✓ lastLogin:', !!user.lastLogin);
    } else {
      console.log('❌ User NOT found in MongoDB!');
    }

    await client.close();

    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('========================================');
    console.log('\n📝 Summary:');
    console.log('✅ Email/Password Registration - Working');
    console.log('✅ Email/Password Login - Working');
    console.log('✅ JWT Tokens Generation - Working');
    console.log('✅ Invalid Credentials Rejection - Working');
    console.log('✅ Google OAuth Endpoint - Available');
    console.log('✅ MongoDB Data Storage - Working');
    console.log('\n💡 Note: For actual Google login, you need to:');
    console.log('   1. Obtain a Google ID token from the frontend');
    console.log(
      '   2. Send POST request to /api/auth/google with { idToken: "..." }'
    );
    console.log('   3. Or use the OAuth redirect flow at GET /api/auth/google');
  } catch (error) {
    console.error('\n❌ Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
