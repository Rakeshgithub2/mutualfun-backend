/**
 * Test Google OAuth Flow
 * This script tests the complete Google OAuth flow
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3002';

async function testGoogleAuthFlow() {
  console.log('🧪 Testing Google OAuth Flow\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Check if server is running
    console.log('\n1️⃣  Checking if backend is running...');
    try {
      const healthCheck = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Backend is running:', healthCheck.data);
    } catch (error) {
      console.error('❌ Backend is not running. Please start it first.');
      console.error('   Run: npm run dev');
      return;
    }

    // Test 2: Check Google OAuth configuration
    console.log('\n2️⃣  Checking Google OAuth configuration...');
    console.log(
      `   Client ID: ${process.env.GOOGLE_CLIENT_ID?.substring(0, 25)}...`
    );
    console.log(
      `   Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'Set ✅' : 'Not Set ❌'}`
    );
    console.log(`   Redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL}`);

    // Test 3: Test the Google OAuth endpoint with a mock ID token
    console.log('\n3️⃣  Testing POST /api/auth/google endpoint...');
    console.log(
      '   Note: This will fail because we need a real Google ID token'
    );
    console.log('   But we can see if the endpoint is accessible\n');

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/google`, {
        idToken: 'fake_token_for_testing',
      });
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Error:', error.response.data);

        if (
          error.response.status === 401 &&
          error.response.data.error.includes('Google token verification failed')
        ) {
          console.log(
            '\n   ✅ Endpoint is working! (Error is expected for fake token)'
          );
        } else if (
          error.response.status === 400 &&
          error.response.data.error === 'Google ID token is required'
        ) {
          console.log('\n   ✅ Endpoint is accessible but requires idToken');
        }
      } else {
        console.log('   ❌ Connection error:', error.message);
      }
    }

    // Test 4: Show the correct integration flow
    console.log('\n4️⃣  How to integrate with frontend:\n');
    console.log('   Step 1: Install Google OAuth library in frontend:');
    console.log('   npm install @react-oauth/google');
    console.log('');
    console.log('   Step 2: Wrap your app with GoogleOAuthProvider:');
    console.log('   ```jsx');
    console.log(
      '   import { GoogleOAuthProvider } from "@react-oauth/google";'
    );
    console.log('');
    console.log('   function App() {');
    console.log('     return (');
    console.log(
      '       <GoogleOAuthProvider clientId="' +
        process.env.GOOGLE_CLIENT_ID +
        '">'
    );
    console.log('         {/* Your app components */}');
    console.log('       </GoogleOAuthProvider>');
    console.log('     );');
    console.log('   }');
    console.log('   ```');
    console.log('');
    console.log('   Step 3: Add Google Sign-In button:');
    console.log('   ```jsx');
    console.log('   import { GoogleLogin } from "@react-oauth/google";');
    console.log('   import axios from "axios";');
    console.log('');
    console.log('   function LoginPage() {');
    console.log(
      '     const handleGoogleSuccess = async (credentialResponse) => {'
    );
    console.log('       try {');
    console.log('         const response = await axios.post(');
    console.log('           "' + BASE_URL + '/api/auth/google",');
    console.log('           { idToken: credentialResponse.credential }');
    console.log('         );');
    console.log('');
    console.log('         // Store tokens');
    console.log(
      '         localStorage.setItem("accessToken", response.data.data.tokens.accessToken);'
    );
    console.log(
      '         localStorage.setItem("refreshToken", response.data.data.tokens.refreshToken);'
    );
    console.log(
      '         localStorage.setItem("user", JSON.stringify(response.data.data.user));'
    );
    console.log('');
    console.log('         // Redirect to home');
    console.log('         window.location.href = "/";');
    console.log('       } catch (error) {');
    console.log('         console.error("Login failed:", error);');
    console.log('       }');
    console.log('     };');
    console.log('');
    console.log('     return (');
    console.log('       <GoogleLogin');
    console.log('         onSuccess={handleGoogleSuccess}');
    console.log('         onError={() => console.log("Login Failed")}');
    console.log('       />');
    console.log('     );');
    console.log('   }');
    console.log('   ```');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed!\n');

    // Test 5: Show what data gets stored in MongoDB
    console.log(
      '\n5️⃣  Data stored in MongoDB after successful Google login:\n'
    );
    console.log('   Collection: users');
    console.log('   Document structure:');
    console.log('   {');
    console.log('     userId: "uuid-generated",');
    console.log('     googleId: "user-google-id-from-token",');
    console.log('     email: "user@gmail.com",');
    console.log('     emailVerified: true,');
    console.log('     authMethod: "google",');
    console.log('     name: "User Full Name",');
    console.log('     firstName: "User",');
    console.log('     lastName: "Name",');
    console.log('     picture: "https://google-profile-picture-url",');
    console.log('     preferences: {');
    console.log('       theme: "light",');
    console.log('       language: "en",');
    console.log('       currency: "INR",');
    console.log('       riskProfile: "moderate",');
    console.log('       notifications: { ... }');
    console.log('     },');
    console.log('     kyc: { status: "pending" },');
    console.log('     subscription: { plan: "free", autoRenew: false },');
    console.log('     refreshTokens: ["jwt-refresh-token"],');
    console.log('     lastLogin: ISODate("2025-12-03T..."),');
    console.log('     loginHistory: [{');
    console.log('       timestamp: ISODate("2025-12-03T..."),');
    console.log('       ip: "user-ip-address",');
    console.log('       userAgent: "user-browser-info"');
    console.log('     }],');
    console.log('     isActive: true,');
    console.log('     isBlocked: false,');
    console.log('     createdAt: ISODate("2025-12-03T..."),');
    console.log('     updatedAt: ISODate("2025-12-03T...")');
    console.log('   }\n');
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

testGoogleAuthFlow();
