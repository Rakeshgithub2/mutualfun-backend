const mongoose = require('mongoose');
require('dotenv').config();

const MarketIndex = require('./src/models/MarketIndex.model');

async function removeDuplicates() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Remove duplicate indices with 0 values
    const duplicatesToRemove = [
      'NIFTY_50',
      'NIFTY_BANK',
      'NIFTY_IT',
      'NIFTY_MIDCAP_100',
      'NIFTY_SMALLCAP_100',
    ];

    for (const symbol of duplicatesToRemove) {
      const result = await MarketIndex.deleteOne({ symbol });
      if (result.deletedCount > 0) {
        console.log(`✅ Removed duplicate: ${symbol}`);
      }
    }

    console.log('\n✅ Cleanup complete');

    // Show final list
    const indices = await MarketIndex.find({ isActive: true }).sort({
      symbol: 1,
    });
    console.log('\n📊 Final indices list:');
    indices.forEach((idx) => {
      console.log(
        `   ${idx.symbol.padEnd(20)} - ${idx.name.padEnd(25)} ₹${idx.value.toFixed(2)}`
      );
    });

    console.log(`\n📊 Total: ${indices.length} indices`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeDuplicates();
