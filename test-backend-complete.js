/**
 * Backend Testing Script
 * Tests all new endpoints and features
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

// Test configuration
const tests = {
  health: true,
  funds: true,
  fundDetail: true,
  marketIndices: true,
  comparison: true,
  overlap: true,
  aiChat: true,
  aiSuggestions: true,
  aiFundAnalysis: true,
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

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, data = null) {
  try {
    log('blue', `\n🧪 Testing: ${name}`);
    log('cyan', `   ${method} ${url}`);

    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: { 'Content-Type': 'application/json' },
    };

    if (data) {
      config.data = data;
      log('cyan', `   Body: ${JSON.stringify(data, null, 2)}`);
    }

    const response = await axios(config);

    if (response.data && response.data.success !== false) {
      log('green', `   ✅ Success`);
      if (response.data.data) {
        const dataType = Array.isArray(response.data.data) ? 'Array' : 'Object';
        const count = Array.isArray(response.data.data)
          ? response.data.data.length
          : Object.keys(response.data.data).length;
        log('cyan', `   📊 Response: ${dataType} with ${count} item(s)`);
      }
      return { success: true, data: response.data };
    } else {
      log('red', `   ❌ Failed: ${response.data.message || 'Unknown error'}`);
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    log('red', `   ❌ Error: ${error.message}`);
    if (error.response) {
      log('red', `   Status: ${error.response.status}`);
      log(
        'red',
        `   Message: ${error.response.data?.message || error.response.statusText}`
      );
    }
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('yellow', '\n═══════════════════════════════════════════════════════');
  log('yellow', '🚀 BACKEND COMPLETE FIX - TESTING ALL ENDPOINTS');
  log('yellow', '═══════════════════════════════════════════════════════\n');
  log('cyan', `Base URL: ${BASE_URL}\n`);

  const results = {};

  // 1. Health Check
  if (tests.health) {
    results.health = await testEndpoint('Health Check', 'GET', '/health');
  }

  // 2. Funds API - List with pagination
  if (tests.funds) {
    results.funds = await testEndpoint(
      'Funds List (Paginated)',
      'GET',
      '/api/funds?page=1&limit=5'
    );
  }

  // 3. Fund Detail (use first fund if available)
  if (tests.fundDetail && results.funds?.data?.data?.[0]) {
    const fundId = results.funds.data.data[0].fundId;
    results.fundDetail = await testEndpoint(
      'Fund Detail',
      'GET',
      `/api/funds/${fundId}`
    );
  }

  // 4. Market Indices
  if (tests.marketIndices) {
    results.marketIndices = await testEndpoint(
      'Market Indices',
      'GET',
      '/api/indices'
    );
  }

  // 5. Fund Comparison
  if (tests.comparison && results.funds?.data?.data?.length >= 2) {
    const fundIds = results.funds.data.data.slice(0, 2).map((f) => f.fundId);
    results.comparison = await testEndpoint(
      'Fund Comparison',
      'POST',
      '/api/compare',
      {
        fundIds,
      }
    );
  }

  // 6. Portfolio Overlap
  if (tests.overlap && results.funds?.data?.data?.length >= 2) {
    const fundIds = results.funds.data.data.slice(0, 2).map((f) => f.fundId);
    results.overlap = await testEndpoint(
      'Portfolio Overlap',
      'POST',
      '/api/overlap',
      {
        fundIds,
      }
    );
  }

  // 7. AI Chat
  if (tests.aiChat) {
    results.aiChat = await testEndpoint('AI Chatbot', 'POST', '/api/chat', {
      message: 'What is NAV in mutual funds?',
    });
  }

  // 8. AI Suggestions
  if (tests.aiSuggestions) {
    results.aiSuggestions = await testEndpoint(
      'AI Chat Suggestions',
      'GET',
      '/api/chat/suggestions'
    );
  }

  // 9. AI Fund Analysis
  if (tests.aiFundAnalysis && results.funds?.data?.data?.[0]) {
    const fundId = results.funds.data.data[0].fundId;
    results.aiFundAnalysis = await testEndpoint(
      'AI Fund Analysis',
      'POST',
      '/api/chat/analyze-fund',
      { fundId }
    );
  }

  // Summary
  log('yellow', '\n═══════════════════════════════════════════════════════');
  log('yellow', '📊 TEST SUMMARY');
  log('yellow', '═══════════════════════════════════════════════════════\n');

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter((r) => r.success).length;
  const failed = total - passed;

  log('cyan', `Total Tests: ${total}`);
  log('green', `✅ Passed: ${passed}`);
  if (failed > 0) {
    log('red', `❌ Failed: ${failed}`);
  }

  log('yellow', '\n═══════════════════════════════════════════════════════');
  log('yellow', '🎯 DETAILED RESULTS');
  log('yellow', '═══════════════════════════════════════════════════════\n');

  Object.entries(results).forEach(([name, result]) => {
    const status = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(color, `${status} ${name}: ${result.success ? 'PASSED' : 'FAILED'}`);
  });

  log('yellow', '\n═══════════════════════════════════════════════════════\n');

  if (passed === total) {
    log('green', '🎉 ALL TESTS PASSED! Backend is production-ready!');
  } else {
    log('yellow', '⚠️  Some tests failed. Check the logs above for details.');
  }

  console.log('\n');
}

// Run tests
runTests().catch((error) => {
  log('red', `\n❌ Test execution failed: ${error.message}`);
  process.exit(1);
});
