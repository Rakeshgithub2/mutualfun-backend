const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

async function fixCategoryCase() {
  console.log('🔧 FIXING CATEGORY CASE CONSISTENCY');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Fix lowercase 'equity' to 'Equity'
    console.log('📝 Updating lowercase "equity" to "Equity"...');
    const equityResult = await fundsCollection.updateMany(
      { category: 'equity' },
      { $set: { category: 'Equity' } }
    );
    console.log(`   Updated ${equityResult.modifiedCount} funds\n`);

    // Fix lowercase 'commodity' to 'Commodity'
    console.log('📝 Updating lowercase "commodity" to "Commodity"...');
    const commodityResult = await fundsCollection.updateMany(
      { category: 'commodity' },
      { $set: { category: 'Commodity' } }
    );
    console.log(`   Updated ${commodityResult.modifiedCount} funds\n`);

    // Fix lowercase 'debt' to 'Debt' (if any)
    console.log('📝 Updating lowercase "debt" to "Debt"...');
    const debtResult = await fundsCollection.updateMany(
      { category: 'debt' },
      { $set: { category: 'Debt' } }
    );
    console.log(`   Updated ${debtResult.modifiedCount} funds\n`);

    // Verification
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    const totalFunds = await fundsCollection.countDocuments();
    const equityFunds = await fundsCollection.countDocuments({
      category: 'Equity',
    });
    const debtFunds = await fundsCollection.countDocuments({
      category: 'Debt',
    });
    const commodityFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
    });

    // Check for any remaining lowercase
    const lowercaseEquity = await fundsCollection.countDocuments({
      category: 'equity',
    });
    const lowercaseDebt = await fundsCollection.countDocuments({
      category: 'debt',
    });
    const lowercaseCommodity = await fundsCollection.countDocuments({
      category: 'commodity',
    });

    console.log('Total funds:', totalFunds);
    console.log('\nCategory Distribution:');
    console.log(`  Equity: ${equityFunds}`);
    console.log(`  Debt: ${debtFunds}`);
    console.log(`  Commodity: ${commodityFunds}`);

    if (lowercaseEquity > 0 || lowercaseDebt > 0 || lowercaseCommodity > 0) {
      console.log('\n⚠️  Remaining lowercase categories:');
      console.log(`  equity: ${lowercaseEquity}`);
      console.log(`  debt: ${lowercaseDebt}`);
      console.log(`  commodity: ${lowercaseCommodity}`);
    } else {
      console.log('\n✅ No lowercase categories remaining!');
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Category case fix completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

fixCategoryCase();
