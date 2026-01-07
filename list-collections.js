const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/mutualFunds?retryWrites=true&w=majority'
  )
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log('📂 Collections in database:');
    collections.forEach((col) => console.log(`   - ${col.name}`));

    console.log('\n🔍 Checking market-related collections:\n');

    // Check marketindices collection (lowercase)
    const MarketIndex1 = mongoose.model(
      'MI1',
      new mongoose.Schema(
        {},
        {
          strict: false,
          collection: 'marketindices',
        }
      )
    );
    const count1 = await MarketIndex1.countDocuments();
    console.log(`marketindices: ${count1} documents`);
    if (count1 > 0) {
      const sample1 = await MarketIndex1.findOne();
      console.log('  Sample:', JSON.stringify(sample1, null, 2));
    }

    // Check market_indices_hourly collection
    const MarketIndex2 = mongoose.model(
      'MI2',
      new mongoose.Schema(
        {},
        {
          strict: false,
          collection: 'market_indices_hourly',
        }
      )
    );
    const count2 = await MarketIndex2.countDocuments();
    console.log(`\nmarket_indices_hourly: ${count2} documents`);
    if (count2 > 0) {
      const sample2 = await MarketIndex2.findOne();
      console.log('  Sample:', JSON.stringify(sample2, null, 2));
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
