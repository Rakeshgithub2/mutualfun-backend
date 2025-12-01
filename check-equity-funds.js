const { MongoClient } = require('mongodb');

async function checkEquityFunds() {
  const client = new MongoClient(
    'mongodb+srv://rakeshd01042024_db_user:<db_password>@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
  );

  try {
    await client.connect();
    const db = client.db('mutual_funds_db');

    const samples = await db
      .collection('funds')
      .find({
        category: 'equity',
        subCategory: {
          $in: ['Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap', 'Flexi Cap'],
        },
      })
      .limit(10)
      .toArray();

    console.log('Equity funds with proper subcategories:\n');
    samples.forEach((f) =>
      console.log(`  ${f.name.substring(0, 60).padEnd(60)} - ${f.subCategory}`)
    );

    console.log('\n\nCategory counts:');
    const largeCap = await db
      .collection('funds')
      .countDocuments({ category: 'equity', subCategory: 'Large Cap' });
    const midCap = await db
      .collection('funds')
      .countDocuments({ category: 'equity', subCategory: 'Mid Cap' });
    const smallCap = await db
      .collection('funds')
      .countDocuments({ category: 'equity', subCategory: 'Small Cap' });
    const multiCap = await db
      .collection('funds')
      .countDocuments({ category: 'equity', subCategory: 'Multi Cap' });
    const flexiCap = await db
      .collection('funds')
      .countDocuments({ category: 'equity', subCategory: 'Flexi Cap' });

    console.log(`  Large Cap: ${largeCap}`);
    console.log(`  Mid Cap: ${midCap}`);
    console.log(`  Small Cap: ${smallCap}`);
    console.log(`  Multi Cap: ${multiCap}`);
    console.log(`  Flexi Cap: ${flexiCap}`);
    console.log(
      `  Total Proper Equity: ${largeCap + midCap + smallCap + multiCap + flexiCap}`
    );

    const commodity = await db
      .collection('funds')
      .countDocuments({ category: 'commodity' });
    console.log(`\n  Commodity funds: ${commodity}`);
  } finally {
    await client.close();
  }
}

checkEquityFunds().catch(console.error);
