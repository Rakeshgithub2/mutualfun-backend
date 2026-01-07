const mongoose = require('mongoose');

async function checkHoldingsData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mutualfunds');
    console.log('✅ Connected to MongoDB');

    const Fund = mongoose.model(
      'Fund',
      new mongoose.Schema({}, { strict: false })
    );

    // Get a few sample funds
    const funds = await Fund.find({}).limit(5).lean();

    console.log('\n📊 Checking holdings data structure for 5 sample funds:\n');

    funds.forEach((fund, index) => {
      console.log(`Fund ${index + 1}: ${fund.schemeName || fund.name}`);
      console.log(`  ID: ${fund._id}`);
      console.log(`  Scheme Code: ${fund.schemeCode}`);

      if (fund.holdings && fund.holdings.length > 0) {
        console.log(`  Holdings count: ${fund.holdings.length}`);
        console.log(`  First holding structure:`);
        console.log(JSON.stringify(fund.holdings[0], null, 4));
      } else {
        console.log('  ❌ No holdings data');
      }
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHoldingsData();
