const { MongoClient } = require('mongodb');

async function checkDatabase() {
  const client = new MongoClient(
    'mongodb+srv://rakeshd01042024_db_user:<db_password>@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds'
  );

  try {
    await client.connect();
    const db = client.db('mutual_funds_db');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('=== COLLECTIONS IN DATABASE ===');
    console.log(collections.map((c) => c.name));

    // Check funds collection
    const fundsCollection = db.collection('funds');

    // Total count
    const totalCount = await fundsCollection.countDocuments({ isActive: true });
    console.log(`\n=== TOTAL ACTIVE FUNDS: ${totalCount} ===`);

    // Count by category
    const categoryCounts = await fundsCollection
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    console.log('\n=== FUNDS BY CATEGORY ===');
    categoryCounts.forEach((cat) => {
      console.log(`${cat._id}: ${cat.count} funds`);
    });

    // Count equity funds by subcategory
    const equitySubcategories = await fundsCollection
      .aggregate([
        { $match: { category: 'equity', isActive: true } },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    console.log('\n=== EQUITY FUNDS BY SUBCATEGORY ===');
    equitySubcategories.forEach((sub) => {
      console.log(`${sub._id}: ${sub.count} funds`);
    });

    // Show recent equity funds (by _id)
    const recentEquity = await fundsCollection
      .find({
        category: 'equity',
        isActive: true,
      })
      .sort({ _id: -1 })
      .limit(10)
      .toArray();

    console.log('\n=== MOST RECENTLY ADDED EQUITY FUNDS ===');
    recentEquity.forEach((f) => {
      console.log(
        `${f.name} | ${f.subCategory} | ${f.fundHouse} | NAV: ${f.currentNav}`
      );
    });

    // Show equity funds with proper subcategories (not "Other")
    const properEquity = await fundsCollection
      .find({
        category: 'equity',
        subCategory: { $ne: 'Other' },
        isActive: true,
      })
      .limit(10)
      .toArray();

    console.log('\n=== EQUITY FUNDS WITH PROPER SUBCATEGORIES ===');
    properEquity.forEach((f) => {
      console.log(
        `${f.name} | ${f.subCategory} | ${f.fundHouse} | NAV: ${f.currentNav}`
      );
    });

    // Check commodity funds
    const commodityFunds = await fundsCollection
      .find({
        category: 'commodity',
        isActive: true,
      })
      .limit(5)
      .toArray();

    console.log('\n=== COMMODITY FUNDS ===');
    commodityFunds.forEach((f) => {
      console.log(
        `${f.name} | ${f.subCategory} | ${f.fundHouse} | NAV: ${f.currentNav}`
      );
    });

    // Check funds sorted by popularity (like API does)
    const popularFunds = await fundsCollection
      .find({
        category: 'equity',
        isActive: true,
      })
      .sort({ popularity: -1 })
      .limit(10)
      .toArray();

    console.log('\n=== TOP 10 EQUITY FUNDS BY POPULARITY (API DEFAULT) ===');
    popularFunds.forEach((f) => {
      console.log(
        `${f.name} | ${f.subCategory} | Popularity: ${f.popularity || 0}`
      );
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();
