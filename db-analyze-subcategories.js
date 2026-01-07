/**
 * Direct MongoDB query to check fund subcategories
 * This connects directly to avoid API issues
 */
const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://harshshukladev:Harsh%401729@cluster0.tplse.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function analyzeSubcategories() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected!\n');

    const db = mongoose.connection.db;
    const fundsCollection = db.collection('funds');

    // Get total count
    const total = await fundsCollection.countDocuments();
    console.log(`📊 Total funds in database: ${total}\n`);

    // Analyze each category
    const categories = ['equity', 'debt', 'hybrid', 'other'];

    for (const category of categories) {
      console.log('='.repeat(70));
      console.log(`📂 ${category.toUpperCase()} FUNDS`);
      console.log('='.repeat(70));

      const categoryCount = await fundsCollection.countDocuments({
        category: { $regex: new RegExp(`^${category}$`, 'i') },
      });
      console.log(`Total: ${categoryCount} funds\n`);

      if (categoryCount > 0) {
        // Get unique subcategories
        const subcategories = await fundsCollection
          .aggregate([
            {
              $match: {
                category: { $regex: new RegExp(`^${category}$`, 'i') },
              },
            },
            {
              $group: {
                _id: '$subCategory',
                count: { $sum: 1 },
                samples: { $push: '$schemeName' },
              },
            },
            {
              $project: {
                _id: 1,
                count: 1,
                sample: { $arrayElemAt: ['$samples', 0] },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
          ])
          .toArray();

        console.log(`Found ${subcategories.length} subcategories:\n`);
        subcategories.forEach((sub) => {
          console.log(
            `  ${sub.count.toString().padStart(5)} | ${sub._id || '(null)'}`
          );
          if (sub.sample) {
            console.log(`         └─ ${sub.sample.substring(0, 65)}...`);
          }
        });
        console.log();
      }
    }

    // Search for commodity-related funds (gold, silver)
    console.log('='.repeat(70));
    console.log(`💰 COMMODITY-RELATED FUNDS (Gold/Silver)`);
    console.log('='.repeat(70));

    const commodityKeywords = [
      'gold',
      'silver',
      'commodity',
      'etf gold',
      'etf silver',
    ];

    for (const keyword of commodityKeywords) {
      const count = await fundsCollection.countDocuments({
        $or: [
          { schemeName: { $regex: keyword, $options: 'i' } },
          { subCategory: { $regex: keyword, $options: 'i' } },
        ],
      });

      if (count > 0) {
        console.log(`\n"${keyword}": ${count} funds`);

        // Get sample
        const samples = await fundsCollection
          .find({
            $or: [
              { schemeName: { $regex: keyword, $options: 'i' } },
              { subCategory: { $regex: keyword, $options: 'i' } },
            ],
          })
          .limit(3)
          .toArray();

        samples.forEach((f) => {
          console.log(`  - ${f.schemeName.substring(0, 70)}...`);
          console.log(
            `    Category: ${f.category} | SubCategory: ${f.subCategory}`
          );
        });
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Analysis complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeSubcategories();
