const mongoose = require('mongoose');

const MONGODB_URI =
  'mongodb+srv://harshshukladev:Harsh%401729@cluster0.tplse.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function checkCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Get unique categories
    const categories = await db
      .collection('funds')
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log('\n📊 CATEGORIES IN DATABASE:');
    console.log('========================');
    categories.forEach((r) => {
      console.log(`  ${r._id || '(empty)'}: ${r.count} funds`);
    });
    console.log(`\nTotal: ${categories.length} unique categories`);

    // Sample funds from each category
    console.log('\n📋 SAMPLE FUNDS PER CATEGORY:');
    console.log('========================');
    for (const cat of categories.slice(0, 5)) {
      const samples = await db
        .collection('funds')
        .find({ category: cat._id })
        .limit(2)
        .toArray();
      console.log(`\n${cat._id}:`);
      samples.forEach((f) => console.log(`  - ${f.schemeName}`));
    }

    await mongoose.disconnect();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCategories();
