/**
 * Test Portfolio System
 *
 * This script tests the new portfolio system which:
 * - Starts at zero for new users
 * - Updates based on user transactions (buy/sell)
 * - Stores all data in MongoDB
 * - Provides personalized portfolio experience
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';
const TEST_USER_ID = 'test_user_123';

// Helper to make API calls
async function apiCall(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// Test functions
async function testGetEmptyPortfolio() {
  console.log('\n📊 Test 1: Get Empty Portfolio (Should Start at Zero)');
  console.log('='.repeat(60));

  const result = await apiCall('GET', `/portfolio/${TEST_USER_ID}`);

  if (result.success) {
    const portfolio = result.data.data;
    console.log('✅ Portfolio retrieved successfully');
    console.log(`   Total Holdings: ${portfolio.holdings.length}`);
    console.log(`   Total Invested: ₹${portfolio.totalInvested}`);
    console.log(`   Current Value: ₹${portfolio.currentValue}`);
    console.log(`   Total Gain/Loss: ₹${portfolio.totalGainLoss}`);

    if (portfolio.totalInvested === 0 && portfolio.holdings.length === 0) {
      console.log('✅ PASS: Portfolio starts at zero as expected');
    } else {
      console.log('❌ FAIL: Portfolio should start at zero');
    }
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testBuyTransaction(fundId, fundName, units, price) {
  console.log(`\n💰 Test 2: Buy ${units} units of ${fundName} at ₹${price}`);
  console.log('='.repeat(60));

  const transaction = {
    type: 'buy',
    fundId,
    units,
    price,
    date: new Date(),
  };

  const result = await apiCall(
    'POST',
    `/portfolio/${TEST_USER_ID}/transaction`,
    transaction
  );

  if (result.success) {
    console.log('✅ Purchase completed successfully');
    const portfolio = result.data.data.portfolio;
    console.log(`   Total Holdings: ${portfolio.holdings.length}`);
    console.log(`   Total Invested: ₹${portfolio.totalInvested.toFixed(2)}`);

    // Handle null/undefined values safely
    const currentValue = portfolio.currentValue ?? 0;
    const totalGainLoss = portfolio.totalGainLoss ?? 0;
    const totalGainLossPercentage = portfolio.totalGainLossPercentage ?? 0;

    console.log(`   Current Value: ₹${currentValue.toFixed(2)}`);
    console.log(
      `   Total Gain/Loss: ₹${totalGainLoss.toFixed(2)} (${totalGainLossPercentage.toFixed(2)}%)`
    );
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testGetPortfolioAfterTransactions() {
  console.log('\n📈 Test 3: Get Portfolio After Transactions');
  console.log('='.repeat(60));

  const result = await apiCall('GET', `/portfolio/${TEST_USER_ID}`);

  if (result.success) {
    const portfolio = result.data.data;
    console.log('✅ Portfolio retrieved successfully');
    console.log('\n📊 Holdings:');
    portfolio.holdings.forEach((holding, index) => {
      console.log(`\n   ${index + 1}. ${holding.fundName}`);
      console.log(`      Units: ${holding.units}`);
      console.log(`      Avg Price: ₹${holding.avgPrice.toFixed(2)}`);
      console.log(`      Invested: ₹${holding.investedAmount.toFixed(2)}`);
      console.log(`      Current Value: ₹${holding.currentValue.toFixed(2)}`);
      console.log(
        `      Gain/Loss: ₹${holding.gainLoss.toFixed(2)} (${holding.gainLossPercentage.toFixed(2)}%)`
      );
    });

    console.log('\n📊 Portfolio Summary:');
    console.log(
      `   Total Invested: ₹${(portfolio.totalInvested || 0).toFixed(2)}`
    );
    console.log(
      `   Current Value: ₹${(portfolio.currentValue || 0).toFixed(2)}`
    );
    console.log(
      `   Total Gain/Loss: ₹${(portfolio.totalGainLoss || 0).toFixed(2)} (${(portfolio.totalGainLossPercentage || 0).toFixed(2)}%)`
    );
    console.log(`   Total Transactions: ${portfolio.transactions.length}`);
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testGetPortfolioSummary() {
  console.log('\n📊 Test 4: Get Portfolio Summary Statistics');
  console.log('='.repeat(60));

  const result = await apiCall('GET', `/portfolio/${TEST_USER_ID}/summary`);

  if (result.success) {
    const summary = result.data.data;
    console.log('✅ Summary retrieved successfully');
    console.log(
      `   Total Invested: ₹${(summary.totalInvested || 0).toFixed(2)}`
    );
    console.log(`   Current Value: ₹${(summary.currentValue || 0).toFixed(2)}`);
    console.log(
      `   Total Gain/Loss: ₹${(summary.totalGainLoss || 0).toFixed(2)} (${(summary.totalGainLossPercentage || 0).toFixed(2)}%)`
    );
    console.log(`   Total Holdings: ${summary.totalHoldings}`);
    console.log(`   Total Transactions: ${summary.totalTransactions}`);

    if (summary.topPerformers && summary.topPerformers.length > 0) {
      console.log('\n🏆 Top Performers:');
      summary.topPerformers.forEach((fund, index) => {
        console.log(
          `   ${index + 1}. ${fund.fundName}: ${(fund.gainLossPercentage || 0).toFixed(2)}%`
        );
      });
    }
    if (summary.categoryAllocation) {
      console.log('\n📊 Category Allocation:');
      Object.entries(summary.categoryAllocation).forEach(([category, data]) => {
        console.log(
          `   ${category}: ₹${(data.currentValue || 0).toFixed(2)} (${data.count} funds)`
        );
      });
    }
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testGetTransactionHistory() {
  console.log('\n📜 Test 5: Get Transaction History');
  console.log('='.repeat(60));

  const result = await apiCall(
    'GET',
    `/portfolio/${TEST_USER_ID}/transactions?limit=10`
  );

  if (result.success) {
    const history = result.data.data;
    console.log(`✅ Retrieved ${history.transactions.length} transactions`);
    console.log(`   Total Transactions: ${history.totalTransactions}`);

    console.log('\n📜 Recent Transactions:');
    history.transactions.slice(0, 5).forEach((txn, index) => {
      console.log(`\n   ${index + 1}. ${txn.type.toUpperCase()}`);
      console.log(`      Fund: ${txn.fundName}`);
      console.log(`      Units: ${txn.units} @ ₹${txn.price.toFixed(2)}`);
      console.log(`      Amount: ₹${txn.amount.toFixed(2)}`);
      console.log(`      Date: ${new Date(txn.date).toLocaleDateString()}`);
    });
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testUpdatePortfolioValues() {
  console.log('\n🔄 Test 6: Update Portfolio Values with Latest NAVs');
  console.log('='.repeat(60));

  const result = await apiCall('PUT', `/portfolio/${TEST_USER_ID}/update`);

  if (result.success) {
    const portfolio = result.data.data;
    console.log('✅ Portfolio values updated successfully');
    console.log(
      `   Total Invested: ₹${(portfolio.totalInvested || 0).toFixed(2)}`
    );
    console.log(
      `   Current Value: ₹${(portfolio.currentValue || 0).toFixed(2)}`
    );
    console.log(
      `   Total Gain/Loss: ₹${(portfolio.totalGainLoss || 0).toFixed(2)} (${(portfolio.totalGainLossPercentage || 0).toFixed(2)}%)`
    );
    console.log(
      `   Last Updated: ${new Date(portfolio.updatedAt).toLocaleString()}`
    );
  } else {
    console.log('❌ Failed:', result.error);
  }
}

async function testSellTransaction(fundId, units, price) {
  console.log(`\n💸 Test 7: Sell ${units} units at ₹${price}`);
  console.log('='.repeat(60));

  const transaction = {
    type: 'sell',
    fundId,
    units,
    price,
    date: new Date(),
  };

  const result = await apiCall(
    'POST',
    `/portfolio/${TEST_USER_ID}/transaction`,
    transaction
  );

  if (result.success) {
    console.log('✅ Sale completed successfully');
    const portfolio = result.data.data.portfolio;
    console.log(`   Total Holdings: ${portfolio.holdings.length}`);
    console.log(
      `   Total Invested: ₹${(portfolio.totalInvested || 0).toFixed(2)}`
    );
    console.log(
      `   Current Value: ₹${(portfolio.currentValue || 0).toFixed(2)}`
    );
    console.log(
      `   Total Gain/Loss: ₹${(portfolio.totalGainLoss || 0).toFixed(2)} (${(portfolio.totalGainLossPercentage || 0).toFixed(2)}%)`
    );
  } else {
    console.log('❌ Failed:', result.error);
  }
}

// Get a sample fund ID from the database
async function getSampleFundIds() {
  console.log('\n🔍 Getting sample funds from database...');

  const result = await apiCall('GET', '/funds?limit=3');

  if (result.success && result.data.statusCode === 200) {
    const funds = result.data.data;
    console.log(`✅ Retrieved ${funds.length} sample funds`);
    return funds.map((f) => ({
      id: f.id,
      name: f.name,
      nav: f.currentNav,
      category: f.category,
    }));
  } else {
    console.log('❌ Failed to get funds:', result.error || 'Unknown error');
    console.log('Response:', JSON.stringify(result, null, 2));
    return [];
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 PORTFOLIO SYSTEM TEST SUITE');
  console.log('='.repeat(60));
  console.log(`Test User ID: ${TEST_USER_ID}`);
  console.log('Backend: ' + BASE_URL);
  console.log('='.repeat(60));

  try {
    // Get sample funds
    const funds = await getSampleFundIds();
    if (funds.length === 0) {
      console.log('❌ Cannot proceed without sample funds');
      return;
    }

    // Test 1: Get empty portfolio
    await testGetEmptyPortfolio();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 2: Buy first fund
    await testBuyTransaction(funds[0].id, funds[0].name, 100, funds[0].nav);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 2b: Buy second fund
    if (funds.length > 1) {
      await testBuyTransaction(funds[1].id, funds[1].name, 50, funds[1].nav);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Test 2c: Buy more of first fund (test averaging)
    await testBuyTransaction(
      funds[0].id,
      funds[0].name,
      50,
      funds[0].nav * 1.05
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 3: Get portfolio after transactions
    await testGetPortfolioAfterTransactions();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 4: Get portfolio summary
    await testGetPortfolioSummary();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 5: Get transaction history
    await testGetTransactionHistory();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 6: Update portfolio values
    await testUpdatePortfolioValues();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 7: Sell some units
    await testSellTransaction(funds[0].id, 30, funds[0].nav * 1.1);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Final check
    await testGetPortfolioAfterTransactions();

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL PORTFOLIO TESTS COMPLETED');
    console.log('='.repeat(60));
    console.log('\n💡 Next Steps:');
    console.log('   1. Check MongoDB for portfolio data');
    console.log('   2. Integrate with frontend UI');
    console.log('   3. Test with multiple users');
    console.log('   4. Add real-time NAV updates');
    console.log('');
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Run tests
console.log('⏳ Starting portfolio system tests in 3 seconds...');
console.log('   Make sure backend is running on http://localhost:3002\n');

setTimeout(() => {
  runAllTests();
}, 3000);
