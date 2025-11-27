#!/usr/bin/env node

/**
 * Test CORS Configuration
 *
 * This script tests if the CORS configuration is properly set up
 * to allow requests from the new frontend URL.
 */

const https = require('https');

const BACKEND_URL = 'https://mutualfun-backend.vercel.app';
const FRONTEND_URLS = [
  'https://mf-frontend-coral.vercel.app',
  'https://mutual-fun-frontend-osed.vercel.app',
  'http://localhost:3000',
];

const ENDPOINTS = ['/health', '/api/health', '/api/funds?limit=5'];

console.log('🧪 Testing CORS Configuration...\n');

async function testCORS(origin, endpoint) {
  return new Promise((resolve) => {
    const url = `${BACKEND_URL}${endpoint}`;
    const options = {
      method: 'GET',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      const status = res.statusCode;

      resolve({
        origin,
        endpoint,
        status,
        corsHeader,
        allowed: corsHeader === origin || corsHeader === '*',
      });
    });

    req.on('error', (error) => {
      resolve({
        origin,
        endpoint,
        error: error.message,
        allowed: false,
      });
    });

    req.end();
  });
}

async function runTests() {
  const results = [];

  for (const origin of FRONTEND_URLS) {
    for (const endpoint of ENDPOINTS) {
      const result = await testCORS(origin, endpoint);
      results.push(result);

      const icon = result.allowed ? '✅' : '❌';
      console.log(`${icon} ${origin} → ${endpoint}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      } else {
        console.log(
          `   Status: ${result.status}, CORS Header: ${result.corsHeader || 'NONE'}`
        );
      }
      console.log();
    }
  }

  // Summary
  const passed = results.filter((r) => r.allowed).length;
  const total = results.length;

  console.log('\n📊 Summary:');
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log(
      '\n✅ All CORS tests passed! The backend is properly configured.'
    );
  } else {
    console.log(
      '\n❌ Some CORS tests failed. Please deploy the backend changes.'
    );
  }
}

// Test OPTIONS preflight
async function testPreflight(origin) {
  return new Promise((resolve) => {
    const url = `${BACKEND_URL}/api/funds`;
    const options = {
      method: 'OPTIONS',
      headers: {
        Origin: origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    };

    const req = https.request(url, options, (res) => {
      const allowOrigin = res.headers['access-control-allow-origin'];
      const allowMethods = res.headers['access-control-allow-methods'];
      const allowHeaders = res.headers['access-control-allow-headers'];

      console.log('🔍 Preflight Test:');
      console.log(`   Origin: ${origin}`);
      console.log(`   Allow-Origin: ${allowOrigin || 'NONE'}`);
      console.log(`   Allow-Methods: ${allowMethods || 'NONE'}`);
      console.log(`   Allow-Headers: ${allowHeaders || 'NONE'}`);
      console.log(`   Status: ${res.statusCode}`);
      console.log();

      resolve();
    });

    req.on('error', (error) => {
      console.log(`❌ Preflight test error: ${error.message}\n`);
      resolve();
    });

    req.end();
  });
}

// Run tests
(async () => {
  await runTests();
  await testPreflight(FRONTEND_URLS[1]); // Test new frontend URL
})();
