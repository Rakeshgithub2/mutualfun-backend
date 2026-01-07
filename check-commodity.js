const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');

const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://mutualfunds:mutualfunds@cluster0.fb8t2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function checkCommodityFunds() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Check all categories
    const categories = await Fund.distinct('category');
    console.log('📊 All categories:', categories);

    // Count funds by category
    for (const cat of categories) {
      const count = await Fund.countDocuments({
        category: cat,
        status: 'Active',
      });
      console.log(`   ${cat}: ${count} funds`);
    }

    // Check for gold/silver funds by name
    console.log('\n🔍 Searching for commodity-related funds...\n');

    const goldFunds = await Fund.countDocuments({
      schemeName: /gold/i,
      status: 'Active',
    });
    console.log(`Gold funds (by name): ${goldFunds}`);

    const silverFunds = await Fund.countDocuments({
      schemeName: /silver/i,
      status: 'Active',
    });
    console.log(`Silver funds (by name): ${silverFunds}`);

    // Sample gold fund
    const sampleGold = await Fund.findOne({
      schemeName: /gold/i,
      status: 'Active',
    });
    if (sampleGold) {
      console.log('\n📋 Sample Gold Fund:');
      console.log(`   Name: ${sampleGold.schemeName}`);
      console.log(`   Category: ${sampleGold.category}`);
      console.log(`   SubCategory: ${sampleGold.subCategory}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCommodityFunds();
