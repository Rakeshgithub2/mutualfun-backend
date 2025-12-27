const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function comprehensiveAPITest() {
  console.log('🧪 COMPREHENSIVE BACKEND API TEST');
  console.log('='.repeat(70));

  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check');
    try {
      const health = await axios.get(`${BASE_URL}/health`);
      console.log(`✅ Status: ${health.status}`);
      console.log(`MongoDB: ${health.data.services?.mongodb || 'unknown'}`);
      console.log(`Redis: ${health.data.services?.redis || 'unknown'}`);
    } catch (error) {
      console.log(`❌ Health check failed: ${error.message}`);
      console.log('⚠️  Is the server running on port 3002?');
      return;
    }

    // Test 2: GET /api/funds (no filters)
    console.log('\n2️⃣ Testing GET /api/funds (no filters, default pagination)');
    const response1 = await axios.get(`${BASE_URL}/api/funds`);
    console.log(`✅ Status: ${response1.status}`);
    console.log(`Response keys:`, Object.keys(response1.data));
    console.log(`Success: ${response1.data.success}`);
    console.log(`Data length: ${response1.data.data?.length || 0}`);
    console.log(`Total funds: ${response1.data.pagination?.total || 'N/A'}`);
    console.log(`Page: ${response1.data.pagination?.page || 'N/A'}`);
    console.log(`Limit: ${response1.data.pagination?.limit || 'N/A'}`);
    if (response1.data.data?.[0]) {
      console.log(`First fund:`, {
        fundId: response1.data.data[0].fundId,
        name: response1.data.data[0].name,
        category: response1.data.data[0].category,
        subCategory: response1.data.data[0].subCategory,
      });
    }

    // Test 3: GET /api/funds?category=equity
    console.log('\n3️⃣ Testing GET /api/funds?category=equity');
    const response2 = await axios.get(`${BASE_URL}/api/funds?category=equity`);
    console.log(`✅ Status: ${response2.status}`);
    console.log(
      `Total equity funds: ${response2.data.pagination?.total || 'N/A'}`
    );
    console.log(`Data length: ${response2.data.data?.length || 0}`);

    // Test 4: GET /api/funds?category=equity&limit=100
    console.log('\n4️⃣ Testing GET /api/funds?category=equity&limit=100');
    const response3 = await axios.get(
      `${BASE_URL}/api/funds?category=equity&limit=100`
    );
    console.log(`✅ Status: ${response3.status}`);
    console.log(`Total: ${response3.data.pagination?.total || 'N/A'}`);
    console.log(`Data length: ${response3.data.data?.length || 0}`);

    // Test 5: GET /api/funds?category=debt
    console.log('\n5️⃣ Testing GET /api/funds?category=debt');
    const response4 = await axios.get(`${BASE_URL}/api/funds?category=debt`);
    console.log(`✅ Status: ${response4.status}`);
    console.log(
      `Total debt funds: ${response4.data.pagination?.total || 'N/A'}`
    );

    // Test 6: GET /api/funds?category=commodity
    console.log('\n6️⃣ Testing GET /api/funds?category=commodity');
    const response5 = await axios.get(
      `${BASE_URL}/api/funds?category=commodity`
    );
    console.log(`✅ Status: ${response5.status}`);
    console.log(
      `Total commodity funds: ${response5.data.pagination?.total || 'N/A'}`
    );

    // Test 7: GET /api/funds?subCategory=Large Cap
    console.log('\n7️⃣ Testing GET /api/funds?subCategory=Large Cap');
    const response6 = await axios.get(`${BASE_URL}/api/funds`, {
      params: { subCategory: 'Large Cap' },
    });
    console.log(`✅ Status: ${response6.status}`);
    console.log(
      `Total Large Cap funds: ${response6.data.pagination?.total || 'N/A'}`
    );

    // Test 8: GET /api/funds?limit=2500 (max limit)
    console.log('\n8️⃣ Testing GET /api/funds?limit=2500 (max limit)');
    const response7 = await axios.get(`${BASE_URL}/api/funds?limit=2500`);
    console.log(`✅ Status: ${response7.status}`);
    console.log(`Total: ${response7.data.pagination?.total || 'N/A'}`);
    console.log(`Data length: ${response7.data.data?.length || 0}`);

    // Test 9: Search endpoint
    console.log('\n9️⃣ Testing GET /api/search/suggest?query=HDFC');
    try {
      const response8 = await axios.get(
        `${BASE_URL}/api/search/suggest?query=HDFC`
      );
      console.log(`✅ Status: ${response8.status}`);
      console.log(
        `Results:`,
        response8.data.data?.length || response8.data.results?.length || 0
      );
    } catch (error) {
      console.log(
        `⚠️  Search endpoint failed: ${error.response?.status || error.message}`
      );
    }

    // Test 10: Get specific fund
    console.log('\n🔟 Testing GET /api/funds/:id');
    if (response1.data.data?.[0]?.fundId) {
      const fundId = response1.data.data[0].fundId;
      const response9 = await axios.get(`${BASE_URL}/api/funds/${fundId}`);
      console.log(`✅ Status: ${response9.status}`);
      console.log(
        `Fund:`,
        response9.data.data?.name || response9.data.name || 'N/A'
      );
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL API TESTS COMPLETED SUCCESSFULLY');
    console.log('='.repeat(70));
  } catch (error) {
    console.error('\n❌ API TEST ERROR:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error(error.message);
    }
  }
}

comprehensiveAPITest();
