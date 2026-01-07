require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    const Fund = mongoose.model(
      'Fund',
      new mongoose.Schema({}, { collection: 'funds', strict: false })
    );

    console.log('\n=== ALL EQUITY SUBCATEGORIES (Full Scan) ===\n');

    const subcats = await Fund.aggregate([
      { $match: { category: /^equity$/i } },
      {
        $group: {
          _id: { $toLower: { $ifNull: ['$subCategory', '$subcategory'] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    let total = 0;
    subcats.forEach((s) => {
      const name = s._id || '(null/missing)';
      const count = s.count;
      total += count;
      const status = count >= 500 ? '✓' : count >= 300 ? '⚠️' : '❌';
      console.log(
        `${name.padEnd(30)}: ${count.toString().padStart(5)} funds ${status}`
      );
    });

    console.log(`\nTotal equity funds: ${total}`);
    console.log('\n✓ = 500+ funds (meets requirement)');
    console.log('⚠️ = 300-499 funds (close)');
    console.log('❌ = <300 funds (needs more data)\n');

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
