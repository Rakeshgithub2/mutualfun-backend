const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');

require('dotenv').config();

async function checkSpecificFund(schemeCode) {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    console.log('🔗 Connecting to:', dbUrl.replace(/:[^:@]+@/, ':***@'));
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB\n');

    // Find the fund by scheme code
    const fund = await Fund.findOne({
      schemeCode: parseInt(schemeCode),
    }).lean();

    if (!fund) {
      console.log(
        `❌ Fund with scheme code ${schemeCode} not found in database`
      );
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('📊 Fund Details:');
    console.log('================');
    console.log(`Scheme Name: ${fund.schemeName}`);
    console.log(`Scheme Code: ${fund.schemeCode}`);
    console.log(`Category: ${fund.category}`);
    console.log(`Sub Category: ${fund.subCategory}`);
    console.log(`Current NAV: ${fund.currentNav}`);
    console.log(`NAV Date: ${fund.navDate}`);
    console.log(`AUM: ${fund.aum}`);
    console.log(`Expense Ratio: ${fund.expenseRatio}`);
    console.log(`Min Investment: ${fund.minInvestment}`);
    console.log(`Fund Manager: ${JSON.stringify(fund.fundManager, null, 2)}`);

    console.log('\n📈 Returns:');
    console.log(JSON.stringify(fund.returns, null, 2));

    console.log('\n🏢 Holdings:');
    if (fund.holdings && fund.holdings.length > 0) {
      console.log(`  Total: ${fund.holdings.length} holdings`);
      fund.holdings.slice(0, 5).forEach((h, i) => {
        console.log(`  ${i + 1}. ${h.companyName} - ${h.holdingPercent}%`);
      });
    } else {
      console.log('  ❌ No holdings data');
    }

    console.log('\n🏭 Sector Allocation:');
    if (fund.sectorAllocation && fund.sectorAllocation.length > 0) {
      console.log(`  Total: ${fund.sectorAllocation.length} sectors`);
      fund.sectorAllocation.slice(0, 5).forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.sectorName} - ${s.allocation}%`);
      });
    } else {
      console.log('  ❌ No sector allocation data');
    }

    console.log('\n📅 Historical NAV Data:');
    if (fund.historicalNav && fund.historicalNav.length > 0) {
      console.log(`  Total: ${fund.historicalNav.length} records`);
      console.log(
        `  Latest: ${fund.historicalNav[0]?.date} - ₹${fund.historicalNav[0]?.nav}`
      );
      console.log(
        `  Oldest: ${fund.historicalNav[fund.historicalNav.length - 1]?.date} - ₹${fund.historicalNav[fund.historicalNav.length - 1]?.nav}`
      );
    } else {
      console.log('  ❌ No historical NAV data');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

const schemeCode = process.argv[2] || '140539';
checkSpecificFund(schemeCode);
