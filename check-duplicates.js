const mongoose = require('mongoose');
require('dotenv').config();
const Fund = require('./src/models/Fund.model');

async function checkDuplicates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Check for duplicate scheme codes
    const duplicates = await Fund.aggregate([
      {
        $group: {
          _id: '$schemeCode',
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          names: { $push: '$name' },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    console.log('📊 Top 10 Duplicate Scheme Codes:');
    duplicates.forEach((dup, i) => {
      console.log(`\n${i + 1}. Scheme Code: ${dup._id}`);
      console.log(`   Count: ${dup.count}`);
      console.log(`   First Name: ${dup.names[0]}`);
    });

    // Count total duplicates
    const totalDups = await Fund.aggregate([
      {
        $group: {
          _id: '$schemeCode',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $count: 'total',
      },
    ]);

    console.log(
      `\n📈 Total duplicate scheme codes: ${totalDups[0]?.total || 0}`
    );

    // Total funds
    const total = await Fund.countDocuments();
    console.log(`📦 Total funds in database: ${total}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDuplicates();
