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
    console.log('📂 All Collections:');
    for (const col of collections) {
      const colName = col.name;
      const count = await mongoose.connection.db
        .collection(colName)
        .countDocuments();
      console.log(`   - ${colName}: ${count} documents`);
    }

    console.log('\n🔍 Looking for market indices in all collections:\n');

    for (const col of collections) {
      if (
        col.name.toLowerCase().includes('market') ||
        col.name.toLowerCase().includes('index') ||
        col.name.toLowerCase().includes('indices')
      ) {
        const collection = mongoose.connection.db.collection(col.name);
        const count = await collection.countDocuments();
        console.log(`📊 ${col.name}: ${count} documents`);
        if (count > 0) {
          const sample = await collection.findOne();
          console.log('   Sample:', JSON.stringify(sample, null, 2));
        }
        console.log('');
      }
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
