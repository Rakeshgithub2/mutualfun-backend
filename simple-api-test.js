// Simple API test for our current setup
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3003,
        path: path,
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: data,
              error: 'Invalid JSON',
            });
          }
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function testCurrentAPI() {
  console.log('🚀 Testing current API setup...');
  console.log('Backend: http://localhost:3002');

  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    if (health.data?.status) {
      console.log(`   ✅ Health: ${health.data.status}`);
    } else {
      console.log(`   ❌ Health check failed`);
    }

    // Test funds endpoint
    console.log('\n2. Testing funds endpoint...');
    const funds = await makeRequest('/api/funds?limit=3');
    console.log(`   Status: ${funds.status}`);
    if (funds.data?.data) {
      console.log(`   ✅ Found ${funds.data.data.length} funds`);
      console.log(
        `   Total funds available: ${funds.data.pagination?.total || 'N/A'}`
      );
      if (funds.data.data.length > 0) {
        const sample = funds.data.data[0];
        console.log(`   Sample fund: ${sample.name}`);
        console.log(`   Category: ${sample.category} / ${sample.subCategory}`);
        console.log(`   NAV: ${sample.currentNav}`);
      }
    } else {
      console.log(`   ❌ Funds endpoint failed`);
      console.log(
        `   Response: ${JSON.stringify(funds.data).substring(0, 200)}...`
      );
    }

    // Test equity funds
    console.log('\n3. Testing equity funds...');
    const equity = await makeRequest('/api/funds?category=equity&limit=3');
    console.log(`   Status: ${equity.status}`);
    if (equity.data?.data) {
      console.log(`   ✅ Found ${equity.data.data.length} equity funds`);
    } else {
      console.log(`   ❌ Equity funds query failed`);
    }

    // Test commodity funds
    console.log('\n4. Testing commodity funds...');
    const commodity = await makeRequest(
      '/api/funds?category=commodity&limit=3'
    );
    console.log(`   Status: ${commodity.status}`);
    if (commodity.data?.data) {
      console.log(`   ✅ Found ${commodity.data.data.length} commodity funds`);
    } else {
      console.log(`   ❌ Commodity funds query failed`);
    }

    // Test specific subcategories
    console.log('\n5. Testing subcategories...');

    // Large Cap
    const largeCap = await makeRequest(
      '/api/funds?category=equity&subCategory=Large%20Cap&limit=2'
    );
    if (largeCap.data?.data) {
      console.log(`   ✅ Large Cap: ${largeCap.data.data.length} funds`);
    }

    // Gold funds
    const gold = await makeRequest(
      '/api/funds?category=commodity&subCategory=Gold&limit=2'
    );
    if (gold.data?.data) {
      console.log(`   ✅ Gold funds: ${gold.data.data.length} funds`);
    }

    console.log('\n🎉 API test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCurrentAPI();
