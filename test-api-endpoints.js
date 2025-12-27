// Test script for API endpoints
const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing GET /api/health');
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();

    if (response.ok && data.success) {
      console.log('   ✅ Health check passed');
      console.log(
        `   MongoDB: ${data.mongodb ? '✅ Connected' : '❌ Not connected'}`
      );
      results.passed++;
    } else {
      console.log('   ❌ Health check failed');
      results.failed++;
    }
    results.tests.push({
      name: 'Health Check',
      status: response.ok ? 'PASS' : 'FAIL',
    });
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    results.failed++;
    results.tests.push({ name: 'Health Check', status: 'FAIL' });
  }

  console.log('');

  // Test 2: Get All Funds
  try {
    console.log('2️⃣ Testing GET /api/funds?page=1&limit=10');
    const response = await fetch(`${BASE_URL}/api/funds?page=1&limit=10`);
    const data = await response.json();

    if (response.ok && data.success && Array.isArray(data.data)) {
      console.log(`   ✅ Funds fetched: ${data.data.length} funds`);
      console.log(`   Total: ${data.pagination?.total || 0} funds in database`);
      results.passed++;
    } else {
      console.log('   ❌ Failed to fetch funds');
      console.log('   Response:', JSON.stringify(data, null, 2));
      results.failed++;
    }
    results.tests.push({
      name: 'Get All Funds',
      status: response.ok ? 'PASS' : 'FAIL',
    });
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    results.failed++;
    results.tests.push({ name: 'Get All Funds', status: 'FAIL' });
  }

  console.log('');

  // Test 3: Get Fund by ID
  try {
    console.log('3️⃣ Testing GET /api/funds/:id');

    // First get a fund ID
    const fundsResponse = await fetch(`${BASE_URL}/api/funds?limit=1`);
    const fundsData = await fundsResponse.json();

    if (fundsData.success && fundsData.data && fundsData.data.length > 0) {
      const fundId = fundsData.data[0].fundId || fundsData.data[0]._id;

      const response = await fetch(`${BASE_URL}/api/funds/${fundId}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        console.log(`   ✅ Fund details fetched: ${data.data.name}`);
        results.passed++;
      } else {
        console.log('   ❌ Failed to fetch fund details');
        console.log('   Response:', JSON.stringify(data, null, 2));
        results.failed++;
      }
      results.tests.push({
        name: 'Get Fund by ID',
        status: response.ok ? 'PASS' : 'FAIL',
      });
    } else {
      console.log('   ⚠️ Skipped - No funds available');
      results.tests.push({ name: 'Get Fund by ID', status: 'SKIP' });
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    results.failed++;
    results.tests.push({ name: 'Get Fund by ID', status: 'FAIL' });
  }

  console.log('');

  // Test 4: Compare Funds
  try {
    console.log('4️⃣ Testing POST /api/compare');

    // Get some fund IDs
    const fundsResponse = await fetch(`${BASE_URL}/api/funds?limit=3`);
    const fundsData = await fundsResponse.json();

    if (fundsData.success && fundsData.data && fundsData.data.length >= 2) {
      const fundIds = fundsData.data.slice(0, 2).map((f) => f.fundId || f._id);

      const response = await fetch(`${BASE_URL}/api/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fundIds }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        console.log(
          `   ✅ Comparison successful: ${data.data.funds?.length || 0} funds compared`
        );
        results.passed++;
      } else {
        console.log('   ❌ Comparison failed');
        console.log('   Response:', JSON.stringify(data, null, 2));
        results.failed++;
      }
      results.tests.push({
        name: 'Compare Funds',
        status: response.ok ? 'PASS' : 'FAIL',
      });
    } else {
      console.log('   ⚠️ Skipped - Not enough funds available');
      results.tests.push({ name: 'Compare Funds', status: 'SKIP' });
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    results.failed++;
    results.tests.push({ name: 'Compare Funds', status: 'FAIL' });
  }

  console.log('');

  // Test 5: Calculate Overlap
  try {
    console.log('5️⃣ Testing POST /api/overlap');

    // Get some fund IDs
    const fundsResponse = await fetch(`${BASE_URL}/api/funds?limit=3`);
    const fundsData = await fundsResponse.json();

    if (fundsData.success && fundsData.data && fundsData.data.length >= 2) {
      const fundIds = fundsData.data.slice(0, 2).map((f) => f.fundId || f._id);

      const response = await fetch(`${BASE_URL}/api/overlap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fundIds }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        console.log(`   ✅ Overlap calculation successful`);
        console.log(
          `   Average overlap: ${data.data.summary?.averageOverlap || 0}%`
        );
        results.passed++;
      } else {
        console.log('   ❌ Overlap calculation failed');
        console.log('   Response:', JSON.stringify(data, null, 2));
        results.failed++;
      }
      results.tests.push({
        name: 'Calculate Overlap',
        status: response.ok ? 'PASS' : 'FAIL',
      });
    } else {
      console.log('   ⚠️ Skipped - Not enough funds available');
      results.tests.push({ name: 'Calculate Overlap', status: 'SKIP' });
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    results.failed++;
    results.tests.push({ name: 'Calculate Overlap', status: 'FAIL' });
  }

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📝 Total: ${results.tests.length}`);
  console.log('');
  console.log('Test Details:');
  results.tests.forEach((test, index) => {
    const icon =
      test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${index + 1}. ${icon} ${test.name}: ${test.status}`);
  });
  console.log('═══════════════════════════════════════════════');

  // Exit with appropriate code
  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run tests
testEndpoints().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
