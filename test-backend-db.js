const { MongoClient } = require('mongodb');

async function testBackendConnection() {
  console.log('\n🔍 TESTING BACKEND DATABASE CONNECTION...\n');
  console.log('='.repeat(60));

  const url = 'mongodb://localhost:27017/mutual_funds_db';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    console.log('✅ Database: mutual_funds_db');

    const collection = db.collection('funds');
    console.log('✅ Collection: funds');

    const count = await collection.countDocuments();
    console.log(`\n📊 Total funds in collection: ${count}`);

    if (count === 0) {
      console.log('\n❌ PROBLEM: Collection is EMPTY!');
      console.log('   The database was cleared or seeding failed');
    } else {
      console.log('✅ Collection has data!');

      // Get sample fund
      const sample = await collection.findOne();
      console.log('\n📋 Sample fund:');
      console.log(`   Name: ${sample.name}`);
      console.log(`   NAV: ₹${sample.currentNav}`);
      console.log(`   Category: ${sample.category}`);

      // Count by category
      const equity = await collection.countDocuments({ type: 'equity' });
      const commodity = await collection.countDocuments({ type: 'commodity' });
      console.log(`\n📊 Breakdown:`);
      console.log(`   Equity: ${equity} funds`);
      console.log(`   Commodity: ${commodity} funds`);
    }

    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

testBackendConnection();
