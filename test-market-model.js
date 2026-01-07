require('dotenv').config();
const mongoose = require('mongoose');
const MarketIndex = require('./src/models/MarketIndex.model');

mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    console.log('📝 Creating test market index...\n');

    const testIndex = await MarketIndex.create({
      symbol: 'TEST_INDEX',
      name: 'Test Market Index',
      value: 12345.67,
      change: {
        value: 123.45,
        percent: 1.01,
      },
      open: 12222.22,
      high: 12500.0,
      low: 12100.0,
      previousClose: 12222.22,
      lastUpdated: new Date(),
      marketStatus: 'CLOSED',
      category: 'BROAD_MARKET',
      isActive: true,
    });

    console.log('✅ Test index created:', testIndex);

    console.log('\n🔍 Querying back...\n');
    const found = await MarketIndex.findOne({ symbol: 'TEST_INDEX' });
    console.log('Found:', found);

    console.log('\n📂 Checking collection...\n');
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    collections.forEach((col) => {
      if (col.name.includes('market') || col.name.includes('index')) {
        console.log(`   - ${col.name}`);
      }
    });

    // Clean up
    await MarketIndex.deleteOne({ symbol: 'TEST_INDEX' });
    console.log('\n✅ Test completed, cleanup done');

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
