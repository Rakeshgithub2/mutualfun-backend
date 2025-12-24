const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const funds = db.collection('funds');

    // Total fund count
    const total = await funds.countDocuments();
    console.log('📊 TOTAL FUNDS IN DATABASE:', total);
    console.log('='.repeat(70));

    // Category distribution
    console.log('\n📋 CATEGORY DISTRIBUTION:');
    const categories = await funds
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    categories.forEach((cat) => {
      console.log(`  ${cat._id || 'Unknown'}: ${cat.count} funds`);
    });

    // Equity subcategories
    console.log('\n📈 EQUITY SUBCATEGORIES:');
    const equitySubcategories = await funds
      .aggregate([
        { $match: { category: 'Equity' } },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    equitySubcategories.forEach((sub) => {
      console.log(`  ${sub._id || 'Unknown'}: ${sub.count} funds`);
    });

    // Debt subcategories
    console.log('\n💰 DEBT SUBCATEGORIES:');
    const debtSubcategories = await funds
      .aggregate([
        { $match: { category: 'Debt' } },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    debtSubcategories.forEach((sub) => {
      console.log(`  ${sub._id || 'Unknown'}: ${sub.count} funds`);
    });

    // Commodity subcategories
    console.log('\n🥇 COMMODITY SUBCATEGORIES:');
    const commoditySubcategories = await funds
      .aggregate([
        { $match: { category: 'Commodity' } },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    commoditySubcategories.forEach((sub) => {
      console.log(`  ${sub._id || 'Unknown'}: ${sub.count} funds`);
    });

    // Check for funds with 0 or null NAV
    console.log('\n⚠️  DATA QUALITY CHECKS:');
    const zeroNav = await funds.countDocuments({
      $or: [
        { currentNav: 0 },
        { currentNav: null },
        { currentNav: { $exists: false } },
      ],
    });
    console.log(`  Funds with 0/null NAV: ${zeroNav}`);

    const noReturns = await funds.countDocuments({
      $or: [
        { 'returns.oneYear': null },
        { 'returns.oneYear': { $exists: false } },
      ],
    });
    console.log(`  Funds missing 1-year return: ${noReturns}`);

    // Sample fund check
    console.log('\n📝 SAMPLE FUND DATA:');
    const sampleFund = await funds.findOne({ isActive: true });
    if (sampleFund) {
      console.log(`  Name: ${sampleFund.name}`);
      console.log(`  Category: ${sampleFund.category}`);
      console.log(`  SubCategory: ${sampleFund.subCategory || 'N/A'}`);
      console.log(`  Current NAV: ${sampleFund.currentNav || 'N/A'}`);
      console.log(`  AUM: ${sampleFund.aum || 'N/A'}`);
      console.log(`  1Y Return: ${sampleFund.returns?.oneYear || 'N/A'}`);
    }

    console.log('\n' + '='.repeat(70));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkDatabase();
