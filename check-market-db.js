const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/mutualFunds?retryWrites=true&w=majority'
  )
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const MarketIndex = mongoose.model(
      'MarketIndex',
      new mongoose.Schema(
        {},
        {
          strict: false,
          collection: 'market_indices_hourly',
        }
      )
    );

    const count = await MarketIndex.countDocuments();
    console.log('Market Indices Count:', count);

    const indices = await MarketIndex.find().limit(10);
    console.log('\nIndices in Database:');
    indices.forEach((idx) => {
      console.log(
        `- ${idx.indexId || idx.symbol}: ${idx.value || idx.currentValue} (${idx.changePercent}%)`
      );
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
