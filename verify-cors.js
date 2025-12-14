// Quick script to test CORS from your deployed backend
const axios = require('axios');

const BACKEND_URL = 'https://mutualfun-backend.vercel.app';
const FRONTEND_ORIGIN = 'https://mutual-fun-frontend-osed.vercel.app';

async function testCORS() {
  console.log('\n🔍 Testing CORS Configuration...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      headers: {
        Origin: FRONTEND_ORIGIN,
      },
    });
    console.log('   ✅ Health check passed');
    console.log('   Response:', response.data);
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
  }

  // Test 2: Market Indices
  console.log('\n2️⃣ Testing Market Indices Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/market-indices`, {
      headers: {
        Origin: FRONTEND_ORIGIN,
      },
    });
    console.log('   ✅ Market indices fetch passed');
    console.log('   Data keys:', Object.keys(response.data.data || {}));
  } catch (error) {
    console.log('   ❌ Market indices failed:', error.message);
  }

  // Test 3: Funds Endpoint
  console.log('\n3️⃣ Testing Funds Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/funds?limit=5`, {
      headers: {
        Origin: FRONTEND_ORIGIN,
      },
    });
    console.log('   ✅ Funds fetch passed');
    console.log('   Found', response.data.data?.length || 0, 'funds');
  } catch (error) {
    console.log('   ❌ Funds fetch failed:', error.message);
  }

  // Test 4: Check CORS Headers
  console.log('\n4️⃣ Checking CORS Headers...');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      headers: {
        Origin: FRONTEND_ORIGIN,
      },
    });
    const corsHeader = response.headers['access-control-allow-origin'];
    console.log('   Access-Control-Allow-Origin:', corsHeader);
    if (corsHeader === FRONTEND_ORIGIN || corsHeader === '*') {
      console.log('   ✅ CORS headers are correct');
    } else {
      console.log('   ⚠️ CORS header mismatch');
    }
  } catch (error) {
    console.log('   ❌ Header check failed:', error.message);
  }

  console.log('\n✨ CORS test complete!\n');
}

testCORS();
