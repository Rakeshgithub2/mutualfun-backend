/**
 * System Verification Script
 * Tests all backend APIs and frontend integration
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const Fund = require('./src/models/Fund.model');
const MarketIndex = require('./src/models/MarketIndex.model');

const API_BASE = process.env.API_URL || 'http://localhost:3002';
const FRONTEND_BASE = 'http://localhost:5001';

class SystemVerifier {
  constructor() {
    this.results = {
      backend: [],
      database: [],
      frontend: [],
    };
  }

  async testBackendHealth() {
    console.log('\n🏥 Testing Backend Health...');
    try {
      const res = await axios.get(`${API_BASE}/api/health`);
      if (res.data.status === 'OK') {
        this.pass('Backend health check');
        return true;
      }
    } catch (error) {
      this.fail('Backend health check', error.message);
      return false;
    }
  }

  async testFundAPIs() {
    console.log('\n📊 Testing Fund APIs...');

    // Test 1: Get all funds
    try {
      const res = await axios.get(`${API_BASE}/api/funds?limit=5`);
      if (res.data.success && res.data.data.length > 0) {
        this.pass('GET /api/funds - Returns data');

        // Check data structure
        const fund = res.data.data[0];
        if (fund.name || fund.schemeName) {
          this.pass('Fund has name field');
        } else {
          this.warn('Fund missing name field');
        }

        if (fund.currentNav || fund.nav) {
          this.pass('Fund has NAV data');
        } else {
          this.warn('Fund missing NAV data');
        }

        if (fund.returns) {
          this.pass('Fund has returns object');
          if (fund.returns['1Y'] || fund.returns.oneYear) {
            this.pass('Fund has 1Y returns');
          } else {
            this.warn('Fund missing 1Y returns data');
          }
        } else {
          this.warn('Fund missing returns object');
        }
      } else {
        this.fail('GET /api/funds', 'No data returned');
      }
    } catch (error) {
      this.fail('GET /api/funds', error.message);
    }

    // Test 2: Get by category
    try {
      const res = await axios.get(
        `${API_BASE}/api/funds?category=equity&subCategory=largecap&limit=5`
      );
      if (res.data.success && res.data.data.length > 0) {
        this.pass('GET /api/funds with category filter');
      } else {
        this.warn('GET /api/funds with category - No largecap funds');
      }
    } catch (error) {
      this.fail('GET /api/funds with category', error.message);
    }

    // Test 3: Search funds
    try {
      const res = await axios.get(
        `${API_BASE}/api/funds/search?q=hdfc&limit=5`
      );
      if (res.data.success) {
        this.pass('GET /api/funds/search');
      }
    } catch (error) {
      this.fail('GET /api/funds/search', error.message);
    }
  }

  async testMarketIndicesAPI() {
    console.log('\n📈 Testing Market Indices API...');

    try {
      const res = await axios.get(`${API_BASE}/api/market/indices`);
      if (res.data.success && res.data.data.length > 0) {
        this.pass(`GET /api/market/indices - ${res.data.data.length} indices`);

        const requiredIndices = [
          'NIFTY50',
          'SENSEX',
          'BANKNIFTY',
          'FINNIFTY',
          'NIFTYMIDCAP',
          'NIFTYSMALLCAP',
          'NIFTYIT',
          'NIFTYFMCG',
          'NIFTYAUTO',
          'NIFTYPHARMA',
          'GIFTNIFTY',
        ];

        const availableSymbols = res.data.data.map((idx) => idx.symbol);

        requiredIndices.forEach((symbol) => {
          if (availableSymbols.includes(symbol)) {
            this.pass(`Index ${symbol} available`);
          } else {
            this.warn(`Index ${symbol} missing`);
          }
        });

        // Check data quality
        const sampleIndex = res.data.data[0];
        if (sampleIndex.value && sampleIndex.value > 0) {
          this.pass('Indices have valid values');
        } else {
          this.warn('Some indices have zero values');
        }
      } else {
        this.fail('GET /api/market/indices', 'No data');
      }
    } catch (error) {
      this.fail('GET /api/market/indices', error.message);
    }
  }

  async testDatabase() {
    console.log('\n💾 Testing Database...');

    try {
      await mongoose.connect(process.env.DATABASE_URL);
      this.pass('MongoDB connection');

      // Check fund count
      const totalFunds = await Fund.countDocuments({ status: 'Active' });
      this.pass(`Total active funds: ${totalFunds.toLocaleString()}`);

      // Check funds with returns
      const fundsWithReturns = await Fund.countDocuments({
        status: 'Active',
        'returns.1Y': { $exists: true, $ne: null, $ne: 0 },
      });
      const percentage = ((fundsWithReturns / totalFunds) * 100).toFixed(1);

      if (fundsWithReturns > 0) {
        this.pass(
          `Funds with returns: ${fundsWithReturns.toLocaleString()} (${percentage}%)`
        );
      } else {
        this.warn('No funds have returns data - Run update script!');
      }

      // Check funds with proper names
      const fundsWithNames = await Fund.countDocuments({
        status: 'Active',
        $or: [
          { name: { $exists: true, $ne: null, $ne: '' } },
          { schemeName: { $exists: true, $ne: null, $ne: '' } },
        ],
      });
      this.pass(
        `Funds with names: ${fundsWithNames.toLocaleString()} (${((fundsWithNames / totalFunds) * 100).toFixed(1)}%)`
      );

      // Check market indices
      const totalIndices = await MarketIndex.countDocuments({
        isActive: true,
      });
      this.pass(`Market indices in DB: ${totalIndices}`);

      await mongoose.disconnect();
    } catch (error) {
      this.fail('Database tests', error.message);
    }
  }

  async testFrontendRoutes() {
    console.log('\n🌐 Testing Frontend Routes...');

    const routes = [
      { path: '/', name: 'Home page' },
      { path: '/equity?category=large-cap', name: 'Equity category page' },
      { path: '/market', name: 'Market indices list' },
    ];

    for (const route of routes) {
      try {
        const res = await axios.get(`${FRONTEND_BASE}${route.path}`, {
          timeout: 5000,
        });
        if (res.status === 200) {
          this.pass(`Frontend: ${route.name}`);
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          this.fail(
            `Frontend: ${route.name}`,
            'Frontend not running on port 5001'
          );
        } else {
          this.warn(`Frontend: ${route.name}`, error.message);
        }
      }
    }
  }

  pass(test, details = '') {
    const msg = `  ✅ ${test}${details ? ' - ' + details : ''}`;
    console.log(msg);
    this.results.backend.push({ status: 'PASS', test, details });
  }

  fail(test, error) {
    const msg = `  ❌ ${test} - ${error}`;
    console.log(msg);
    this.results.backend.push({ status: 'FAIL', test, error });
  }

  warn(test, details = '') {
    const msg = `  ⚠️  ${test}${details ? ' - ' + details : ''}`;
    console.log(msg);
    this.results.backend.push({ status: 'WARN', test, details });
  }

  async runAll() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   SYSTEM VERIFICATION                 ║');
    console.log('╚════════════════════════════════════════╝');

    const backendRunning = await this.testBackendHealth();

    if (backendRunning) {
      await this.testFundAPIs();
      await this.testMarketIndicesAPI();
    } else {
      console.log('\n⚠️  Backend not running - skipping API tests');
      console.log('   Start backend: npm start');
    }

    await this.testDatabase();
    await this.testFrontendRoutes();

    this.printSummary();
  }

  printSummary() {
    console.log('\n\n╔════════════════════════════════════════╗');
    console.log('║   VERIFICATION SUMMARY                ║');
    console.log('╚════════════════════════════════════════╝\n');

    const allResults = this.results.backend;
    const passed = allResults.filter((r) => r.status === 'PASS').length;
    const failed = allResults.filter((r) => r.status === 'FAIL').length;
    const warnings = allResults.filter((r) => r.status === 'WARN').length;

    console.log(`  ✅ Passed:   ${passed}`);
    console.log(`  ❌ Failed:   ${failed}`);
    console.log(`  ⚠️  Warnings: ${warnings}\n`);

    if (failed > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:');
      allResults
        .filter((r) => r.status === 'FAIL')
        .forEach((r) => {
          console.log(`   - ${r.test}: ${r.error}`);
        });
      console.log('');
    }

    if (warnings > 0) {
      console.log('⚠️  WARNINGS:');
      allResults
        .filter((r) => r.status === 'WARN')
        .forEach((r) => {
          console.log(`   - ${r.test}${r.details ? ': ' + r.details : ''}`);
        });
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('NEXT STEPS:\n');

    if (failed > 0 && failed < 5) {
      console.log('1. Fix critical issues listed above');
      console.log('2. Restart backend: npm start');
      console.log('3. Run verification again: node verify-system.js\n');
    } else if (warnings > 0) {
      console.log('1. Review warnings (optional)');
      console.log(
        '2. If funds have no returns: node run-update-returns.js 100'
      );
      console.log('3. Hard refresh browser: Ctrl + Shift + R\n');
    } else {
      console.log('✅ System is working perfectly!');
      console.log('   Open browser: http://localhost:5001\n');
    }
  }
}

async function main() {
  const verifier = new SystemVerifier();
  await verifier.runAll();
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
