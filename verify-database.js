const mongoose = require('mongoose');

async function verifyDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mutual-funds');

    const Fund = mongoose.model('Fund', new mongoose.Schema({}));

    const total = await Fund.countDocuments({ isActive: true });
    const categories = await Fund.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n✅ DATABASE VERIFICATION\n');
    console.log('═══════════════════════════════════════');
    console.log(`Total Active Funds: ${total}`);
    console.log('═══════════════════════════════════════\n');

    console.log('Category Breakdown:');
    categories.forEach((cat) => {
      console.log(`  ${cat._id.padEnd(15)}: ${cat.count} funds`);
    });

    console.log('\n═══════════════════════════════════════');

    if (total >= 4400) {
      console.log('✅ SUCCESS! Database has sufficient funds');
    } else {
      console.log('⚠️  WARNING: Expected 4400+ funds, found', total);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyDatabase();
