const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

async function fixCommoditySubcategories() {
  console.log('🔧 FIXING COMMODITY SUBCATEGORY NAMES');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Fix 'Gold' to 'Gold Fund'
    console.log('📝 Updating "Gold" to "Gold Fund"...');
    const goldResult = await fundsCollection.updateMany(
      { category: 'Commodity', subCategory: 'Gold' },
      { $set: { subCategory: 'Gold Fund' } }
    );
    console.log(`   Updated ${goldResult.modifiedCount} funds\n`);

    // Fix 'Silver' to 'Silver Fund'
    console.log('📝 Updating "Silver" to "Silver Fund"...');
    const silverResult = await fundsCollection.updateMany(
      { category: 'Commodity', subCategory: 'Silver' },
      { $set: { subCategory: 'Silver Fund' } }
    );
    console.log(`   Updated ${silverResult.modifiedCount} funds\n`);

    // Verification
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    const goldFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Gold Fund',
    });
    const silverFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Silver Fund',
    });
    const multiCommodityFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Multi Commodity Fund',
    });
    const totalCommodity = await fundsCollection.countDocuments({
      category: 'Commodity',
    });

    console.log('Commodity funds breakdown:');
    console.log(`  Gold Fund: ${goldFunds}`);
    console.log(`  Silver Fund: ${silverFunds}`);
    console.log(`  Multi Commodity Fund: ${multiCommodityFunds}`);
    console.log(`  Total Commodity: ${totalCommodity}`);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Commodity subcategory names fixed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

fixCommoditySubcategories();
