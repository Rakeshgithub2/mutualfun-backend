const { MongoClient } = require('mongodb');

async function checkFunds() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('mutual_funds_db');

    const stats = await db
      .collection('funds')
      .aggregate([
        {
          $group: {
            _id: { category: '$category', subCategory: '$subCategory' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.category': 1, count: -1 } },
      ])
      .toArray();

    console.log('Fund Distribution by Category:\n');
    let currentCat = '';
    stats.forEach((s) => {
      if (s._id.category !== currentCat) {
        currentCat = s._id.category;
        console.log(`\n${currentCat ? currentCat.toUpperCase() : 'UNKNOWN'}:`);
      }
      console.log(`  ${s._id.subCategory || 'No SubCategory'}: ${s.count}`);
    });

    const equity = await db
      .collection('funds')
      .countDocuments({ category: 'equity' });
    const debt = await db
      .collection('funds')
      .countDocuments({ category: 'debt' });
    const commodity = await db
      .collection('funds')
      .countDocuments({ category: 'commodity' });
    const hybrid = await db
      .collection('funds')
      .countDocuments({ category: 'hybrid' });
    const solution = await db
      .collection('funds')
      .countDocuments({ category: 'solution' });

    console.log(`\n\nSUMMARY:`);
    console.log(`  Equity: ${equity}`);
    console.log(`  Debt: ${debt}`);
    console.log(`  Commodity: ${commodity}`);
    console.log(`  Hybrid: ${hybrid}`);
    console.log(`  Solution: ${solution}`);
    console.log(`  Total: ${equity + debt + commodity + hybrid + solution}`);
  } finally {
    await client.close();
  }
}

checkFunds().catch(console.error);
