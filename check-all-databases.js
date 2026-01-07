const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');
require('dotenv').config();

async function checkAllDatabases() {
  try {
    // Check current DATABASE_URL database
    const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    console.log('🔗 Current DATABASE_URL:', dbUrl.replace(/:[^:@]+@/, ':***@'));

    await mongoose.connect(dbUrl);
    console.log('\n📍 Connected to database:', mongoose.connection.name);

    const total = await Fund.countDocuments({});
    console.log('📊 Total funds:', total);

    const byCategory = await Fund.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📊 Funds by category:');
    byCategory.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

    const bySubCategory = await Fund.aggregate([
      { $match: { category: { $in: ['equity', 'Equity'] } } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    console.log('\n📊 Top 10 equity subcategories:');
    bySubCategory.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

    // Check if there are funds with returns data
    const withReturns = await Fund.countDocuments({
      'returns.1Y': { $exists: true, $ne: null },
    });
    const withOneYear = await Fund.countDocuments({
      'returns.oneYear': { $exists: true, $ne: null },
    });

    console.log('\n📈 Funds with returns data:');
    console.log(`  With returns.1Y: ${withReturns}`);
    console.log(`  With returns.oneYear: ${withOneYear}`);

    await mongoose.disconnect();

    // Now check the other database
    console.log('\n\n=====================================');
    console.log('Checking "test" database...');
    console.log('=====================================\n');

    const testDbUrl = dbUrl.replace(/\/[^/]+\?/, '/test?');
    await mongoose.connect(testDbUrl);
    console.log('📍 Connected to database:', mongoose.connection.name);

    const testTotal = await Fund.countDocuments({});
    console.log('📊 Total funds:', testTotal);

    const testByCategory = await Fund.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📊 Funds by category:');
    testByCategory.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

    const testBySubCategory = await Fund.aggregate([
      { $match: { category: { $in: ['equity', 'Equity'] } } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    console.log('\n📊 Top 10 equity subcategories:');
    testBySubCategory.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

    const testWithReturns = await Fund.countDocuments({
      'returns.1Y': { $exists: true, $ne: null },
    });
    const testWithOneYear = await Fund.countDocuments({
      'returns.oneYear': { $exists: true, $ne: null },
    });

    console.log('\n📈 Funds with returns data:');
    console.log(`  With returns.1Y: ${testWithReturns}`);
    console.log(`  With returns.oneYear: ${testWithOneYear}`);

    await mongoose.disconnect();
    console.log('\n✅ Analysis complete');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

checkAllDatabases();
