const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function checkCategoryIssues() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual-funds');
    const funds = db.collection('funds');

    // Check all unique category values (case-sensitive)
    console.log('📋 CATEGORY VALUE ANALYSIS:');
    console.log('='.repeat(70));

    const categoryVariations = await funds
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    console.log('\n🔍 Category Variations Found:');
    categoryVariations.forEach((cat) => {
      const value = cat._id || 'NULL';
      const type = typeof cat._id;
      console.log(`  "${value}" (${type}): ${cat.count} funds`);
    });

    // Check subcategory variations
    console.log('\n🔍 SubCategory Variations:');
    const subCategoryVariations = await funds
      .aggregate([
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    subCategoryVariations.forEach((sub) => {
      const value = sub._id || 'NULL';
      console.log(`  "${value}": ${sub.count} funds`);
    });

    // Check for case sensitivity issues in equity subcategories
    console.log('\n⚠️  POTENTIAL EQUITY SUBCATEGORY ISSUES:');
    const potentialEquityVariations = [
      'Large Cap',
      'LargeCap',
      'large cap',
      'LARGE_CAP',
      'Mid Cap',
      'MidCap',
      'mid cap',
      'MID_CAP',
      'Small Cap',
      'SmallCap',
      'small cap',
      'SMALL_CAP',
    ];

    for (const variation of potentialEquityVariations) {
      const count = await funds.countDocuments({ subCategory: variation });
      if (count > 0) {
        console.log(`  "${variation}": ${count} funds`);
      }
    }

    // Check isActive field
    console.log('\n🔍 isActive Field Check:');
    const activeTrue = await funds.countDocuments({ isActive: true });
    const activeFalse = await funds.countDocuments({ isActive: false });
    const activeNull = await funds.countDocuments({
      $or: [{ isActive: null }, { isActive: { $exists: false } }],
    });
    console.log(`  isActive: true = ${activeTrue}`);
    console.log(`  isActive: false = ${activeFalse}`);
    console.log(`  isActive: null/missing = ${activeNull}`);

    // Sample equity fund to check structure
    console.log('\n📝 SAMPLE EQUITY FUND STRUCTURE:');
    const equityFund = await funds.findOne({ category: 'equity' });
    if (equityFund) {
      console.log(
        JSON.stringify(
          {
            fundId: equityFund.fundId,
            name: equityFund.name,
            category: equityFund.category,
            subCategory: equityFund.subCategory,
            fundType: equityFund.fundType,
            isActive: equityFund.isActive,
            currentNav: equityFund.currentNav,
            returns: equityFund.returns,
          },
          null,
          2
        )
      );
    }

    console.log('\n' + '='.repeat(70));
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
  }
}

checkCategoryIssues();
