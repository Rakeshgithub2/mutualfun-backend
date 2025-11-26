const { MongoClient } = require('mongodb');

async function checkRecentFunds() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');

  try {
    await client.connect();
    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Get most recently imported equity funds (by _id timestamp)
    const recent = await fundsCollection
      .find({
        category: 'equity',
        isActive: true,
      })
      .sort({ _id: -1 })
      .limit(20)
      .toArray();

    console.log('=== MOST RECENTLY IMPORTED EQUITY FUNDS ===');
    recent.forEach((f) => {
      console.log(`${f.subCategory.padEnd(12)} | ${f.name.substring(0, 60)}`);
    });

    // Check if our recently imported funds have proper subcategories
    const recentSubCategories = [...new Set(recent.map((f) => f.subCategory))];
    console.log('\n=== SUBCATEGORIES IN RECENT IMPORTS ===');
    recentSubCategories.forEach((sub) => {
      const count = recent.filter((f) => f.subCategory === sub).length;
      console.log(`${sub}: ${count} funds`);
    });

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkRecentFunds();
