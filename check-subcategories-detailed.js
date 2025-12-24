const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

async function checkSubcategories() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const funds = db.collection('funds');

    // Get all unique subcategories by category
    console.log('📊 ALL SUBCATEGORIES IN DATABASE:');
    console.log('='.repeat(70));

    const allSubcategories = await funds
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

    let currentCategory = '';
    allSubcategories.forEach((item) => {
      if (item._id.category !== currentCategory) {
        currentCategory = item._id.category;
        console.log(`\n📁 ${currentCategory.toUpperCase()}:`);
      }
      console.log(
        `  ✓ ${item._id.subCategory || '[NULL/MISSING]'}: ${item.count} funds`
      );
    });

    // Check required equity subcategories
    console.log('\n\n🔍 REQUIRED EQUITY SUBCATEGORIES CHECK:');
    console.log('='.repeat(70));

    const requiredEquitySubcats = [
      'Large Cap',
      'Mid Cap',
      'Small Cap',
      'Multi Cap',
      'Flexi Cap',
      'Index Fund',
    ];

    for (const subcat of requiredEquitySubcats) {
      const count = await funds.countDocuments({
        category: 'Equity',
        subCategory: subcat,
      });
      const status = count > 0 ? '✅' : '❌';
      console.log(`  ${status} ${subcat}: ${count} funds`);
    }

    // Check required commodity subcategories
    console.log('\n\n🔍 REQUIRED COMMODITY SUBCATEGORIES CHECK:');
    console.log('='.repeat(70));

    const requiredCommoditySubcats = [
      'Gold Fund',
      'Silver Fund',
      'Multi Commodity Fund',
    ];

    for (const subcat of requiredCommoditySubcats) {
      const count = await funds.countDocuments({
        category: 'Commodity',
        subCategory: subcat,
      });
      const status = count > 0 ? '✅' : '❌';
      console.log(`  ${status} ${subcat}: ${count} funds`);
    }

    // Check for debt funds
    console.log('\n\n🔍 DEBT CATEGORY CHECK:');
    console.log('='.repeat(70));

    const debtCount = await funds.countDocuments({ category: 'Debt' });
    if (debtCount === 0) {
      console.log('  ❌ NO DEBT FUNDS IN DATABASE');
      console.log(
        '  ⚠️  CRITICAL: Need to add ~800-1000 debt funds across 16 subcategories'
      );
    } else {
      console.log(`  ✅ Found ${debtCount} debt funds`);
    }

    console.log('\n' + '='.repeat(70));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkSubcategories();
