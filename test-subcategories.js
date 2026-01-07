require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    const Fund = mongoose.model(
      'Fund',
      new mongoose.Schema({}, { collection: 'funds', strict: false })
    );

    console.log('\n=== TESTING SUBCATEGORY QUERIES ===\n');

    // Test flexicap
    const flexicap = await Fund.countDocuments({
      category: /^equity$/i,
      $or: [{ subCategory: /^flexicap$/i }, { subcategory: /^flexicap$/i }],
    });
    console.log(`Flexicap: ${flexicap} funds`);

    // Test dividend
    const dividend = await Fund.countDocuments({
      category: /^equity$/i,
      $or: [{ subCategory: /^dividend$/i }, { subcategory: /^dividend$/i }],
    });
    console.log(`Dividend: ${dividend} funds`);

    // Sample flexicap fund
    const sample = await Fund.findOne({
      category: /^equity$/i,
      subCategory: 'flexicap',
    });

    if (sample) {
      console.log('\nSample flexicap fund:');
      console.log({
        name: sample.schemeName,
        category: sample.category,
        subCategory: sample.subCategory,
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
