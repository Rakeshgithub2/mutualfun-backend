const mongoose = require('mongoose');
require('dotenv').config();

const Fund = require('./src/models/Fund.model');

async function checkFundData() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Get a sample midcap fund
    const midcapFunds = await Fund.find({
      category: 'equity',
      subCategory: 'midcap',
      status: { $in: ['Active', null] },
    }).limit(3);

    console.log(`Found ${midcapFunds.length} midcap funds\n`);

    midcapFunds.forEach((fund, index) => {
      console.log(`\n========== FUND ${index + 1} ==========`);
      console.log('ID:', fund._id);
      console.log('Name:', fund.name || fund.schemeName || 'NO NAME');
      console.log('Scheme Code:', fund.schemeCode);
      console.log('Category:', fund.category);
      console.log('SubCategory:', fund.subCategory);
      console.log('Fund House:', fund.fundHouse);
      console.log('NAV:', fund.currentNav || fund.nav);
      console.log('Returns:', JSON.stringify(fund.returns, null, 2));
      console.log('AUM:', fund.aum);
      console.log('Expense Ratio:', fund.expenseRatio);
      console.log('Status:', fund.status);
    });

    // Check total funds with returns
    const fundsWithReturns = await Fund.countDocuments({
      'returns.oneYear': { $exists: true, $ne: null, $ne: 0 },
    });

    console.log(`\n\n📊 STATISTICS:`);
    console.log(`Total midcap funds: ${midcapFunds.length}`);
    console.log(`Total funds with returns.oneYear: ${fundsWithReturns}`);

    // Check total funds with names
    const fundsWithNames = await Fund.countDocuments({
      name: { $exists: true, $ne: null, $ne: '' },
    });

    console.log(`Total funds with name field: ${fundsWithNames}`);

    // Check schemeName
    const fundsWithSchemeNames = await Fund.countDocuments({
      schemeName: { $exists: true, $ne: null, $ne: '' },
    });

    console.log(`Total funds with schemeName field: ${fundsWithSchemeNames}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkFundData();
