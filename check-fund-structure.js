const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds';
const client = new MongoClient(uri);

async function checkFundStructure() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const funds = db.collection('funds');

    // Get sample funds
    const sampleFunds = await funds
      .find({ isActive: true })
      .limit(10)
      .toArray();

    console.log('\n📊 FUND STRUCTURE');
    console.log('='.repeat(70));

    sampleFunds.forEach((fund, index) => {
      console.log(`\n${index + 1}. ${fund.name}`);
      console.log('   category:', fund.category);
      console.log('   subCategory:', fund.subCategory);
      console.log('   fundType:', fund.fundType);
      console.log('   currentNav:', fund.currentNav);
      console.log('   _id:', fund._id);
      console.log('   fundId:', fund.fundId);
    });

    // Check distinct values
    const categories = await funds.distinct('category');
    const subCategories = await funds.distinct('subCategory');

    console.log('\n📁 DISTINCT CATEGORIES:', categories);
    console.log('\n📁 DISTINCT SUBCATEGORIES:', subCategories);

    // Count by category
    console.log('\n📊 COUNT BY CATEGORY:');
    for (const cat of categories) {
      const count = await funds.countDocuments({
        category: cat,
        isActive: true,
      });
      console.log(`   ${cat}: ${count}`);
    }

    await client.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkFundStructure();
