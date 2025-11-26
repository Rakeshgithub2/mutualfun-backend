const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function checkFundCount() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const funds = db.collection('funds');

    const total = await funds.countDocuments();
    console.log('\n📊 DATABASE FUND COUNT');
    console.log('='.repeat(70));
    console.log('\n✅ Total funds in database:', total);

    // Check equity funds
    const equityCategories = [
      'LARGE_CAP',
      'MID_CAP',
      'SMALL_CAP',
      'FLEXI_CAP',
      'MULTI_CAP',
      'FOCUSED',
      'SECTORAL',
      'THEMATIC',
      'ELSS',
    ];
    const equity = await funds.countDocuments({
      category: { $in: equityCategories },
    });
    console.log('📈 Equity funds:', equity);

    // Check commodity funds
    const commodity = await funds.countDocuments({ fundType: 'commodity' });
    console.log('🥇 Commodity funds:', commodity);

    // Check debt funds
    const debt = await funds.countDocuments({ category: 'DEBT' });
    console.log('💰 Debt funds:', debt);

    // Category breakdown
    console.log('\n📋 Category breakdown:');
    const categories = await funds
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    categories.forEach((cat) => {
      console.log(`   ${cat._id || 'Unknown'}: ${cat.count} funds`);
    });

    // Fund type breakdown
    console.log('\n📋 Fund Type breakdown:');
    const types = await funds
      .aggregate([
        { $group: { _id: '$fundType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    types.forEach((type) => {
      console.log(`   ${type._id || 'Unknown'}: ${type.count} funds`);
    });

    // Sample fund names
    console.log('\n📝 Sample funds in database:');
    const samples = await funds.find().limit(5).toArray();
    samples.forEach((fund, i) => {
      console.log(`   ${i + 1}. ${fund.name} (${fund.category})`);
    });

    if (total < 150) {
      console.log('\n❌ ISSUE: Database only has', total, 'funds!');
      console.log(
        '💡 EXPECTED: 100+ equity funds + 50+ commodity funds = 150+ total'
      );
      console.log('🔧 SOLUTION: Need to seed more funds to the database');
    } else {
      console.log('\n✅ Database has sufficient funds!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkFundCount();
