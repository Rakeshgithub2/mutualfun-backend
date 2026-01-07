require('dotenv').config();
const mongoose = require('mongoose');
const MarketIndex = require('./src/models/MarketIndices.model');

async function testQuery() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    const requiredNames = [
      'nifty50',
      'sensex',
      'niftymidcap',
      'niftysmallcap',
      'niftybank',
      'niftyit',
      'niftypharma',
      'niftyauto',
      'niftyfmcg',
      'niftymetal',
      'commodity',
      'giftnifty',
    ];

    console.log('\n📊 Testing query with names:', requiredNames.slice(0, 3));

    const indices = await MarketIndex.find({
      name: { $in: requiredNames },
    })
      .sort({ name: 1 })
      .lean();

    console.log(`\n✅ Found ${indices.length} indices`);
    indices.forEach((idx) => {
      console.log(`  - ${idx.name}: ${idx.value} (${idx.percent_change}%)`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testQuery();
