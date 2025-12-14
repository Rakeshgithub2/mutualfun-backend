const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds';

async function testFundRetrieval() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const funds = db.collection('funds');

    // Test 1: Get all equity funds
    console.log('📊 TEST 1: Equity Funds');
    console.log('='.repeat(70));
    const equitySubcategories = [
      'Large Cap',
      'Mid Cap',
      'Small Cap',
      'Multi Cap',
      'Flexi Cap',
      'ELSS',
      'Sectoral',
      'Thematic',
      'Value Fund',
      'Contra Fund',
      'Dividend Yield',
      'Focused Fund',
      'Large & Mid Cap',
    ];

    const equityCount = await funds.countDocuments({
      subCategory: { $in: equitySubcategories },
      isActive: true,
    });
    console.log(`Total equity funds: ${equityCount}`);

    const equityFunds = await funds
      .find({ subCategory: { $in: equitySubcategories }, isActive: true })
      .limit(5)
      .toArray();

    console.log('\nSample equity funds:');
    equityFunds.forEach((fund, i) => {
      console.log(
        `  ${i + 1}. ${fund.name} - ${fund.subCategory} (NAV: ₹${fund.currentNav})`
      );
    });

    // Test 2: Get commodity funds (LOWERCASE)
    console.log('\n\n📊 TEST 2: Commodity Funds (lowercase search)');
    console.log('='.repeat(70));
    const commodityCount = await funds.countDocuments({
      category: 'commodity',
      isActive: true,
    });
    console.log(`Total commodity funds: ${commodityCount}`);

    const commodityFunds = await funds
      .find({ category: 'commodity', isActive: true })
      .limit(5)
      .toArray();

    console.log('\nSample commodity funds:');
    commodityFunds.forEach((fund, i) => {
      console.log(
        `  ${i + 1}. ${fund.name} - ${fund.subCategory} (NAV: ₹${fund.currentNav})`
      );
    });

    // Test 3: Try UPPERCASE (should fail)
    console.log(
      '\n\n📊 TEST 3: Commodity Funds (UPPERCASE search - should be 0)'
    );
    console.log('='.repeat(70));
    const commodityUpperCount = await funds.countDocuments({
      category: 'COMMODITY',
      isActive: true,
    });
    console.log(`Total commodity funds with UPPERCASE: ${commodityUpperCount}`);

    // Test 4: All funds
    console.log('\n\n📊 TEST 4: All Active Funds');
    console.log('='.repeat(70));
    const allCount = await funds.countDocuments({ isActive: true });
    console.log(`Total active funds: ${allCount}`);

    console.log('\n✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testFundRetrieval();
