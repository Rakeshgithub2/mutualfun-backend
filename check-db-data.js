const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');

require('dotenv').config();

async function checkDatabase() {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    console.log('🔗 Connecting to:', dbUrl.replace(/:[^:@]+@/, ':***@'));
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database name:', mongoose.connection.name);

    // Get distinct subcategories
    const subcategories = await Fund.distinct('subCategory');
    console.log('\n📊 Distinct subcategories in database:');
    subcategories.forEach((sub) => console.log(`  - ${sub}`));

    // Get count by category
    const categories = await Fund.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📊 Fund counts by category:');
    categories.forEach((cat) =>
      console.log(`  - ${cat._id}: ${cat.count} funds`)
    );

    // Get sample funds with returns data
    const sampleWithReturns = await Fund.findOne({
      'returns.1Y': { $exists: true, $ne: null },
    }).lean();
    console.log('\n📈 Sample fund with returns:');
    if (sampleWithReturns) {
      console.log(`  Name: ${sampleWithReturns?.schemeName}`);
      console.log(`  Category: ${sampleWithReturns?.category}`);
      console.log(`  SubCategory: ${sampleWithReturns?.subCategory}`);
      console.log(
        `  Returns:`,
        JSON.stringify(sampleWithReturns?.returns, null, 2)
      );
    } else {
      console.log('  ⚠️ No funds found with returns.1Y field');

      // Try to find any fund
      const anyFund = await Fund.findOne().lean();
      if (anyFund) {
        console.log('\n📊 First fund in database:');
        console.log(`  Name: ${anyFund?.schemeName}`);
        console.log(`  Category: ${anyFund?.category}`);
        console.log(`  SubCategory: ${anyFund?.subCategory}`);
        console.log(`  Returns keys:`, Object.keys(anyFund?.returns || {}));
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

checkDatabase();
