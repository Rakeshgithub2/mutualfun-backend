// Quick test script to verify Google OAuth endpoint exists
const http = require('http');

const testEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/auth/google',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('🧪 Testing POST /api/auth/google endpoint...\n');

  const req = http.request(options, (res) => {
    console.log(`✅ Status Code: ${res.statusCode}`);

    if (res.statusCode === 404) {
      console.log('\n❌ ERROR: Endpoint returns 404!');
      console.log('📋 This means the backend server needs to be restarted.\n');
      console.log('🔧 Solution:');
      console.log('   1. Stop the backend server (Ctrl+C)');
      console.log('   2. Run: npm run dev');
      console.log('   3. Wait for "Server is running on port 3002"');
      console.log('   4. Run this test again\n');
    } else if (res.statusCode === 400 || res.statusCode === 401) {
      console.log('\n✅ SUCCESS: Endpoint exists!');
      console.log('📋 The 400/401 status is expected (we sent invalid data).');
      console.log('🎉 Backend is configured correctly!\n');
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📄 Response:', data || 'No body');
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ ERROR: Cannot connect to backend!');
    console.error('📋 Make sure the backend server is running on port 3002\n');
    console.error('Error:', error.message);
  });

  req.write(JSON.stringify({ idToken: 'test' }));
  req.end();
};

testEndpoint();
