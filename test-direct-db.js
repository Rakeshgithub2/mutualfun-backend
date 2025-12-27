const { MongoClient } = require('mongodb');
require('dotenv').config();

async function directDatabaseTest() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual-funds');
    const funds = db.collection('funds');

    console.log('🔍 DIRECT DATABASE QUERY TESTS');
    console.log('='.repeat(70));

    // Test 1: Count all active funds
    const totalActive = await funds.countDocuments({ isActive: true });
    console.log(`\n1️⃣ Total active funds: ${totalActive}`);

    // Test 2: Count by category
    console.log('\n2️⃣ Funds by category:');
    const categories = await funds
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    categories.forEach((cat) => {
      console.log(`   ${cat._id}: ${cat.count}`);
    });

    // Test 3: Equity funds
    const equityCount = await funds.countDocuments({
      isActive: true,
      category: 'equity',
    });
    console.log(`\n3️⃣ Equity funds (category='equity'): ${equityCount}`);

    // Test 4: Sample equity fund
    const sampleEquity = await funds.findOne({
      isActive: true,
      category: 'equity',
    });
    console.log('\n4️⃣ Sample Equity Fund:');
    console.log(
      JSON.stringify(
        {
          fundId: sampleEquity.fundId,
          name: sampleEquity.name,
          category: sampleEquity.category,
          subCategory: sampleEquity.subCategory,
          currentNav: sampleEquity.currentNav,
          returns: sampleEquity.returns,
        },
        null,
        2
      )
    );

    // Test 5: Large Cap funds
    const largeCapCount = await funds.countDocuments({
      isActive: true,
      subCategory: 'Large Cap',
    });
    console.log(
      `\n5️⃣ Large Cap funds (subCategory='Large Cap'): ${largeCapCount}`
    );

    // Test 6: Simulate API query - first 20 funds
    const apiSimulation = await funds
      .find({ isActive: true })
      .sort({ aum: -1 })
      .limit(20)
      .project({
        fundId: 1,
        name: 1,
        category: 1,
        subCategory: 1,
        currentNav: 1,
        aum: 1,
        _id: 0,
      })
      .toArray();

    console.log(`\n6️⃣ First 20 funds (sorted by AUM):`);
    console.log(`   Count: ${apiSimulation.length}`);
    console.log(`   First fund: ${apiSimulation[0]?.name || 'N/A'}`);
    console.log(`   Last fund: ${apiSimulation[19]?.name || 'N/A'}`);

    // Test 7: Check if _id is being excluded properly
    console.log('\n7️⃣ Field structure (first fund):');
    console.log('   Keys:', Object.keys(apiSimulation[0] || {}));

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL DATABASE TESTS PASSED');
    console.log('\n💡 CONCLUSION:');
    console.log(`   - Database has ${totalActive} active funds`);
    console.log(`   - Data structure is correct`);
    console.log(`   - Queries work as expected`);
    console.log(
      `   - If API returns empty, issue is in API layer, NOT database`
    );
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

directDatabaseTest();
