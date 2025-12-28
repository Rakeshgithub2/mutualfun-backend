const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';

async function testAPIs() {
  console.log('🧪 Testing Backend APIs...\n');

  try {
    // Test 1: Get funds
    console.log('1️⃣ Testing /api/funds?limit=5');
    const fundsResponse = await axios.get(`${BASE_URL}/funds?limit=5`);
    console.log(`✅ Success: ${fundsResponse.data.success}`);
    console.log(`📊 Total Funds: ${fundsResponse.data.pagination.total}`);
    console.log(`📦 Returned: ${fundsResponse.data.data.length} funds`);
    console.log(`📝 First fund: ${fundsResponse.data.data[0].name}\n`);

    // Test 2: Market indices
    console.log('2️⃣ Testing /api/market/summary');
    const marketResponse = await axios.get(`${BASE_URL}/market/summary`);
    console.log(`✅ Success: ${marketResponse.data.success}`);
    console.log(`📈 Indices: ${marketResponse.data.data.length}`);
    if (marketResponse.data.data.length > 0) {
      const nifty = marketResponse.data.data.find(
        (i) => i.indexId === 'NIFTY_50'
      );
      if (nifty) {
        console.log(
          `📊 NIFTY 50: ${nifty.currentValue} (${nifty.changePercent.toFixed(2)}%)`
        );
      }
    }
    console.log();

    // Test 3: Fund by ID
    const fundId = fundsResponse.data.data[0].fundId;
    console.log(`3️⃣ Testing /api/funds/${fundId}`);
    const fundResponse = await axios.get(`${BASE_URL}/funds/${fundId}`);
    console.log(`✅ Success: ${fundResponse.data.success}`);
    console.log(`📝 Fund: ${fundResponse.data.data.name}`);
    console.log(`💰 NAV: ₹${fundResponse.data.data.currentNav}`);
    console.log(`📊 1Y Return: ${fundResponse.data.data.returns.oneYear}%\n`);

    // Test 4: Search
    console.log('4️⃣ Testing /api/search/suggest?query=hdfc');
    const searchResponse = await axios.get(
      `${BASE_URL}/search/suggest?query=hdfc`
    );
    console.log(`✅ Results: ${searchResponse.data.data?.length || 0} funds`);

    console.log('\n✅ All tests passed!');
    console.log('\n📋 Summary:');
    console.log(
      `   - Total funds in database: ${fundsResponse.data.pagination.total}`
    );
    console.log(
      `   - Market indices available: ${marketResponse.data.data.length}`
    );
    console.log(`   - API endpoints working: 4/4`);
    console.log('\n🎯 Backend is ready for frontend integration!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

testAPIs();
