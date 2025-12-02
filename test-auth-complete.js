/**
 * Complete Authentication Test Script
 * Tests all authentication functions including:
 * - Email/Password Registration
 * - Email/Password Login
 * - Google OAuth (token-based)
 * - User data storage in MongoDB
 */

const axios = require('axios');

// Configuration - Update based on your .env
const API_URL = 'http://localhost:3002/api';
const FRONTEND_URL = 'https://mutual-fun-frontend-osed.vercel.app';

// Test user credentials
const testUser = {
  name: 'John Doe Test',
  email: `testuser${Date.now()}@example.com`,
  password: 'SecurePassword123!',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(name, passed, details = '') {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    logSuccess(`${name} - PASSED ${details}`);
  } else {
    testResults.failed++;
    logError(`${name} - FAILED ${details}`);
  }
}

// Test 1: Check Backend Server Health
async function testServerHealth() {
  logSection('TEST 1: Backend Server Health Check');
  try {
    const response = await axios.get(`http://localhost:3002/health`);
    recordTest(
      'Server Health Check',
      response.status === 200,
      `Status: ${response.status}`
    );
    logInfo(`Server Status: ${JSON.stringify(response.data, null, 2)}`);
    return true;
  } catch (error) {
    recordTest(
      'Server Health Check',
      false,
      error.message || 'Server not responding'
    );
    logError(
      'Backend server is not running! Please start it with: npm run dev'
    );
    return false;
  }
}

// Test 2: Register New User with Email/Password
async function testEmailRegistration() {
  logSection('TEST 2: Email/Password Registration');
  logInfo(`Registering user: ${testUser.email}`);

  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    });

    const success =
      response.status === 201 &&
      response.data.success &&
      response.data.data.user.email === testUser.email;

    recordTest('Email Registration', success, `Status: ${response.status}`);

    if (success) {
      logInfo('User Details:');
      console.log(JSON.stringify(response.data.data.user, null, 2));
      logInfo('Tokens Received:');
      console.log(
        `  Access Token: ${response.data.data.tokens.accessToken.substring(0, 30)}...`
      );
      console.log(
        `  Refresh Token: ${response.data.data.tokens.refreshToken.substring(0, 30)}...`
      );

      // Store tokens for future tests
      testUser.accessToken = response.data.data.tokens.accessToken;
      testUser.refreshToken = response.data.data.tokens.refreshToken;
      testUser.userId = response.data.data.user.userId;

      // Verify user data structure
      const user = response.data.data.user;
      recordTest('User has userId', !!user.userId);
      recordTest('User has email', user.email === testUser.email);
      recordTest('User has name', user.name === testUser.name);
      recordTest('User has authMethod', user.authMethod === 'email');
      recordTest('User has preferences', !!user.preferences);
      recordTest('User has subscription', !!user.subscription);
      recordTest('User has KYC status', !!user.kyc);

      return true;
    }
    return false;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    recordTest('Email Registration', false, errorMsg);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Test 3: Login with Email/Password
async function testEmailLogin() {
  logSection('TEST 3: Email/Password Login');
  logInfo(`Logging in with: ${testUser.email}`);

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    const success =
      response.status === 200 &&
      response.data.success &&
      response.data.data.user.email === testUser.email;

    recordTest('Email Login', success, `Status: ${response.status}`);

    if (success) {
      logInfo('User Details:');
      console.log(JSON.stringify(response.data.data.user, null, 2));
      logInfo('New Tokens Received:');
      console.log(
        `  Access Token: ${response.data.data.tokens.accessToken.substring(0, 30)}...`
      );

      // Update tokens
      testUser.accessToken = response.data.data.tokens.accessToken;
      testUser.refreshToken = response.data.data.tokens.refreshToken;

      return true;
    }
    return false;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    recordTest('Email Login', false, errorMsg);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Test 4: Get Current User Profile (Protected Route)
async function testGetCurrentUser() {
  logSection('TEST 4: Get Current User Profile (Protected Route)');

  if (!testUser.accessToken) {
    logWarning('Skipping - No access token available from previous tests');
    return false;
  }

  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testUser.accessToken}`,
      },
    });

    const success =
      response.status === 200 &&
      response.data.success &&
      response.data.data.user.email === testUser.email;

    recordTest('Get Current User', success, `Status: ${response.status}`);

    if (success) {
      logInfo('Current User Profile:');
      console.log(JSON.stringify(response.data.data.user, null, 2));
      return true;
    }
    return false;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    recordTest('Get Current User', false, errorMsg);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Test 5: Refresh Access Token
async function testRefreshToken() {
  logSection('TEST 5: Refresh Access Token');

  if (!testUser.refreshToken) {
    logWarning('Skipping - No refresh token available from previous tests');
    return false;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: testUser.refreshToken,
    });

    const success =
      response.status === 200 &&
      response.data.success &&
      !!response.data.data.tokens.accessToken;

    recordTest('Refresh Token', success, `Status: ${response.status}`);

    if (success) {
      logInfo('New Access Token Received:');
      console.log(
        `  ${response.data.data.tokens.accessToken.substring(0, 30)}...`
      );
      testUser.accessToken = response.data.data.tokens.accessToken;
      return true;
    }
    return false;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    recordTest('Refresh Token', false, errorMsg);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Test 6: Test Invalid Credentials
async function testInvalidCredentials() {
  logSection('TEST 6: Invalid Credentials (Security Test)');

  try {
    await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: 'WrongPassword123!',
    });
    recordTest(
      'Invalid Credentials Rejection',
      false,
      'Login should have failed'
    );
    return false;
  } catch (error) {
    const isUnauthorized = error.response?.status === 401;
    recordTest(
      'Invalid Credentials Rejection',
      isUnauthorized,
      `Status: ${error.response?.status}`
    );
    if (isUnauthorized) {
      logInfo('Correct behavior: Invalid credentials were rejected');
    }
    return isUnauthorized;
  }
}

// Test 7: Test Duplicate Registration
async function testDuplicateRegistration() {
  logSection('TEST 7: Duplicate Registration (Security Test)');

  try {
    await axios.post(`${API_URL}/auth/register`, {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    });
    recordTest(
      'Duplicate Registration Prevention',
      false,
      'Should have been rejected'
    );
    return false;
  } catch (error) {
    const isBadRequest = error.response?.status === 400;
    const errorMsg = error.response?.data?.error || '';
    const isDuplicate = errorMsg.includes('already exists');
    const success = isBadRequest && isDuplicate;

    recordTest(
      'Duplicate Registration Prevention',
      success,
      `Status: ${error.response?.status}`
    );
    if (success) {
      logInfo('Correct behavior: Duplicate email registration was prevented');
    }
    return success;
  }
}

// Test 8: Google OAuth Configuration Check
async function testGoogleOAuthConfig() {
  logSection('TEST 8: Google OAuth Configuration Check');

  // Read .env file to check Google OAuth credentials
  const fs = require('fs');
  const path = require('path');

  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const googleClientId = envContent
      .match(/GOOGLE_CLIENT_ID=(.+)/)?.[1]
      ?.trim();
    const googleClientSecret = envContent
      .match(/GOOGLE_CLIENT_SECRET=(.+)/)?.[1]
      ?.trim();
    const googleRedirectUri = envContent
      .match(/GOOGLE_REDIRECT_URI=(.+)/)?.[1]
      ?.trim();

    logInfo('Google OAuth Configuration:');
    console.log(
      `  Client ID: ${googleClientId ? googleClientId.substring(0, 30) + '...' : 'MISSING'}`
    );
    console.log(
      `  Client Secret: ${googleClientSecret ? googleClientSecret.substring(0, 20) + '...' : 'MISSING'}`
    );
    console.log(`  Redirect URI: ${googleRedirectUri || 'MISSING'}`);

    const hasClientId = !!googleClientId && googleClientId.length > 10;
    const hasClientSecret =
      !!googleClientSecret && googleClientSecret.length > 10;
    const hasRedirectUri =
      !!googleRedirectUri && googleRedirectUri.includes('http');

    recordTest('Google Client ID Set', hasClientId);
    recordTest('Google Client Secret Set', hasClientSecret);
    recordTest('Google Redirect URI Set', hasRedirectUri);

    // Check if credentials match Google Cloud Console
    const expectedClientId =
      '1001031943095-8o6e1hrcgm5rd9fndcqu26ejub6d5pha.apps.googleusercontent.com';
    if (googleClientId === expectedClientId) {
      logWarning(
        'Using example Google Client ID - Update with your own credentials'
      );
    }

    // Check redirect URI configuration
    const expectedRedirectUri =
      'http://localhost:3002/api/auth/google/callback';
    if (googleRedirectUri && googleRedirectUri !== expectedRedirectUri) {
      logWarning(
        `Redirect URI mismatch. Expected: ${expectedRedirectUri}, Got: ${googleRedirectUri}`
      );
      logInfo(
        'Make sure this URI is added in Google Cloud Console under "Authorized redirect URIs"'
      );
    }

    return hasClientId && hasClientSecret && hasRedirectUri;
  } catch (error) {
    recordTest('Google OAuth Configuration', false, error.message);
    return false;
  }
}

// Test 9: MongoDB Data Verification
async function testMongoDBStorage() {
  logSection('TEST 9: MongoDB Data Storage Verification');

  // This test requires direct MongoDB connection
  const { MongoClient } = require('mongodb');
  const mongoUrl =
    process.env.DATABASE_URL ||
    'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds';

  try {
    logInfo('Connecting to MongoDB...');
    const client = new MongoClient(mongoUrl);
    await client.connect();
    logSuccess('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Find the test user
    const user = await usersCollection.findOne({ email: testUser.email });

    if (user) {
      recordTest('User Stored in MongoDB', true);
      logInfo('User Document in MongoDB:');

      // Check required fields
      const requiredFields = [
        'userId',
        'email',
        'name',
        'password',
        'authMethod',
        'preferences',
        'subscription',
        'kyc',
      ];
      for (const field of requiredFields) {
        const hasField = !!user[field];
        recordTest(`MongoDB: User has ${field}`, hasField);
      }

      // Display sanitized user data
      const sanitizedUser = {
        ...user,
        password: '[REDACTED]',
        _id: user._id?.toString(),
      };
      console.log(JSON.stringify(sanitizedUser, null, 2));

      // Check timestamps
      recordTest('MongoDB: User has createdAt', !!user.createdAt);
      recordTest('MongoDB: User has updatedAt', !!user.updatedAt);
      recordTest('MongoDB: User has lastLogin', !!user.lastLogin);

      // Check login history
      recordTest(
        'MongoDB: User has loginHistory',
        Array.isArray(user.loginHistory) && user.loginHistory.length > 0
      );
      if (user.loginHistory && user.loginHistory.length > 0) {
        logInfo(`Login History Records: ${user.loginHistory.length}`);
      }
    } else {
      recordTest('User Stored in MongoDB', false, 'User not found in database');
    }

    await client.close();
    return !!user;
  } catch (error) {
    recordTest('MongoDB Storage Verification', false, error.message);
    logError(`MongoDB Error: ${error.message}`);
    return false;
  }
}

// Test 10: Google Sign-In Endpoint Test
async function testGoogleSignInEndpoint() {
  logSection('TEST 10: Google Sign-In Endpoint Test');

  logInfo('Testing Google Sign-In endpoint (without actual Google token)');

  try {
    // Test with missing token
    await axios.post(`${API_URL}/auth/google`, {});
    recordTest('Google Sign-In Validation', false, 'Should require idToken');
    return false;
  } catch (error) {
    const isBadRequest = error.response?.status === 400;
    const errorMsg = error.response?.data?.error || '';
    const requiresToken = errorMsg.includes('token');

    recordTest(
      'Google Sign-In Validation',
      isBadRequest && requiresToken,
      `Status: ${error.response?.status}`
    );

    if (isBadRequest) {
      logInfo('Correct behavior: Google Sign-In requires idToken');
      logInfo('To test actual Google login:');
      logInfo('  1. Get a Google ID token from your frontend');
      logInfo('  2. Send it to POST /api/auth/google with { idToken: "..." }');
      logInfo('  3. Or use Google OAuth redirect flow at GET /api/auth/google');
    }

    return isBadRequest;
  }
}

// Test Summary
function printTestSummary() {
  logSection('TEST SUMMARY');

  console.log(`Total Tests: ${testResults.tests.length}`);
  logSuccess(`Passed: ${testResults.passed}`);
  if (testResults.failed > 0) {
    logError(`Failed: ${testResults.failed}`);
  } else {
    logSuccess(`Failed: ${testResults.failed}`);
  }

  const successRate = (
    (testResults.passed / testResults.tests.length) *
    100
  ).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (testResults.failed > 0) {
    logWarning('\nFailed Tests:');
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  ❌ ${t.name} - ${t.details}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  if (testResults.failed === 0) {
    logSuccess(
      '\n🎉 ALL TESTS PASSED! Authentication system is working correctly.'
    );
    logInfo('\nWhat to check in MongoDB:');
    logInfo('  1. User credentials are stored securely (password is hashed)');
    logInfo('  2. User profile includes name, email, preferences');
    logInfo('  3. Auth method is correctly set (email/google/both)');
    logInfo('  4. Timestamps and login history are tracked');
  } else {
    logError('\n⚠️  SOME TESTS FAILED! Please review the errors above.');
  }
}

// Main Test Runner
async function runAllTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     MUTUAL FUNDS BACKEND - AUTHENTICATION TEST SUITE      ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  logInfo('\nBackend URL: ' + API_URL);
  logInfo('Frontend URL: ' + FRONTEND_URL);
  logInfo('Test User: ' + testUser.email);

  // Run tests sequentially
  const serverRunning = await testServerHealth();

  if (!serverRunning) {
    logError('\n❌ Backend server is not running. Please start it first!');
    logInfo('\nTo start the backend server:');
    logInfo('  npm run dev');
    logInfo('  or');
    logInfo('  node src/index.ts');
    process.exit(1);
  }

  await testGoogleOAuthConfig();
  await testEmailRegistration();
  await testEmailLogin();
  await testGetCurrentUser();
  await testRefreshToken();
  await testInvalidCredentials();
  await testDuplicateRegistration();
  await testGoogleSignInEndpoint();
  await testMongoDBStorage();

  printTestSummary();

  console.log('\n');
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
