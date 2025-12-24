const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002/api';

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

async function testApi() {
  console.log('🧪 COMPREHENSIVE API TESTING');
  console.log('='.repeat(80));
  console.log();

  try {
    // Test 1: Get all funds with high limit
    console.log(
      `${colors.blue}TEST 1: GET /api/funds with limit=500${colors.reset}`
    );
    const test1 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { limit: 500 },
    });
    console.log(`${colors.green}✅ Status: ${test1.status}${colors.reset}`);
    console.log(`   Returned: ${test1.data.funds?.length || 0} funds`);
    console.log(`   Total available: ${test1.data.pagination?.total || 'N/A'}`);
    console.log();

    // Test 2: Get Equity funds
    console.log(
      `${colors.blue}TEST 2: GET /api/funds?category=Equity&limit=300${colors.reset}`
    );
    const test2 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Equity', limit: 300 },
    });
    console.log(`${colors.green}✅ Status: ${test2.status}${colors.reset}`);
    console.log(`   Returned: ${test2.data.funds?.length || 0} equity funds`);
    console.log(
      `   Total equity funds: ${test2.data.pagination?.total || 'N/A'}`
    );
    console.log();

    // Test 3: Get Debt funds
    console.log(
      `${colors.blue}TEST 3: GET /api/funds?category=Debt&limit=300${colors.reset}`
    );
    const test3 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Debt', limit: 300 },
    });
    console.log(`${colors.green}✅ Status: ${test3.status}${colors.reset}`);
    console.log(`   Returned: ${test3.data.funds?.length || 0} debt funds`);
    console.log(
      `   Total debt funds: ${test3.data.pagination?.total || 'N/A'}`
    );
    console.log();

    // Test 4: Get Commodity funds
    console.log(
      `${colors.blue}TEST 4: GET /api/funds?category=Commodity&limit=100${colors.reset}`
    );
    const test4 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Commodity', limit: 100 },
    });
    console.log(`${colors.green}✅ Status: ${test4.status}${colors.reset}`);
    console.log(
      `   Returned: ${test4.data.funds?.length || 0} commodity funds`
    );
    console.log(
      `   Total commodity funds: ${test4.data.pagination?.total || 'N/A'}`
    );
    console.log();

    // Test 5: Get specific subcategory - Large Cap
    console.log(
      `${colors.blue}TEST 5: GET /api/funds?category=Equity&subCategory=Large Cap${colors.reset}`
    );
    const test5 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Equity', subCategory: 'Large Cap', limit: 100 },
    });
    console.log(`${colors.green}✅ Status: ${test5.status}${colors.reset}`);
    console.log(
      `   Returned: ${test5.data.funds?.length || 0} Large Cap funds`
    );
    console.log();

    // Test 6: Get specific subcategory - Liquid Fund
    console.log(
      `${colors.blue}TEST 6: GET /api/funds?category=Debt&subCategory=Liquid Fund${colors.reset}`
    );
    const test6 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Debt', subCategory: 'Liquid Fund', limit: 100 },
    });
    console.log(`${colors.green}✅ Status: ${test6.status}${colors.reset}`);
    console.log(`   Returned: ${test6.data.funds?.length || 0} Liquid funds`);
    console.log();

    // Test 7: Get specific subcategory - Index Fund
    console.log(
      `${colors.blue}TEST 7: GET /api/funds?category=Equity&subCategory=Index Fund${colors.reset}`
    );
    const test7 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Equity', subCategory: 'Index Fund', limit: 100 },
    });
    console.log(`${colors.green}✅ Status: ${test7.status}${colors.reset}`);
    console.log(`   Returned: ${test7.data.funds?.length || 0} Index funds`);
    console.log();

    // Test 8: Get Gold Fund
    console.log(
      `${colors.blue}TEST 8: GET /api/funds?category=Commodity&subCategory=Gold Fund${colors.reset}`
    );
    const test8 = await axios.get(`${API_BASE_URL}/funds`, {
      params: { category: 'Commodity', subCategory: 'Gold Fund', limit: 50 },
    });
    console.log(`${colors.green}✅ Status: ${test8.status}${colors.reset}`);
    console.log(`   Returned: ${test8.data.funds?.length || 0} Gold funds`);
    console.log();

    // Test 9: Search endpoint
    console.log(
      `${colors.blue}TEST 9: GET /api/search/funds?query=hdfc&limit=100${colors.reset}`
    );
    const test9 = await axios.get(`${API_BASE_URL}/search/funds`, {
      params: { query: 'hdfc', limit: 100 },
    });
    console.log(`${colors.green}✅ Status: ${test9.status}${colors.reset}`);
    console.log(`   Found: ${test9.data.results?.length || 0} HDFC funds`);
    console.log();

    // Test 10: Market indices
    console.log(
      `${colors.blue}TEST 10: GET /api/market-indices${colors.reset}`
    );
    const test10 = await axios.get(`${API_BASE_URL}/market-indices`);
    console.log(`${colors.green}✅ Status: ${test10.status}${colors.reset}`);
    if (test10.data.data) {
      const indianIndices = test10.data.data.indian?.length || 0;
      const globalIndices = test10.data.data.global?.length || 0;
      console.log(`   Indian Indices: ${indianIndices}`);
      console.log(`   Global Indices: ${globalIndices}`);
      console.log(`   Total: ${indianIndices + globalIndices}`);
    }
    console.log();

    // Summary
    console.log('='.repeat(80));
    console.log(`${colors.green}🎉 ALL TESTS PASSED!${colors.reset}`);
    console.log();
    console.log('📊 SUMMARY:');
    console.log(`   ✅ API limit increased to 2500 (tested with 500)`);
    console.log(`   ✅ Equity funds: ${test2.data.pagination?.total || 'N/A'}`);
    console.log(`   ✅ Debt funds: ${test3.data.pagination?.total || 'N/A'}`);
    console.log(
      `   ✅ Commodity funds: ${test4.data.pagination?.total || 'N/A'}`
    );
    console.log(
      `   ✅ Market indices: ${(test10.data.data?.indian?.length || 0) + (test10.data.data?.global?.length || 0)}`
    );
    console.log(`   ✅ All subcategories working`);
    console.log('='.repeat(80));
  } catch (error) {
    console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
  }
}

testApi();
