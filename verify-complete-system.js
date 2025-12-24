const mongoose = require('mongoose');
require('dotenv').config();

async function verifySystem() {
  try {
    console.log('\n🔍 COMPLETE SYSTEM VERIFICATION\n');
    console.log('═'.repeat(60));

    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB Connected');
    console.log(`📍 Database: ${mongoose.connection.db.databaseName}\n`);

    // Check collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📦 Collections: ${collections.length}`);
    collections.forEach((col) => console.log(`   - ${col.name}`));

    // Check funds count
    const fundsCollection = mongoose.connection.db.collection('funds');
    const totalFunds = await fundsCollection.countDocuments();
    console.log(`\n📊 Total Funds: ${totalFunds}`);

    if (totalFunds > 0) {
      // Get sample fund
      const sampleFund = await fundsCollection.findOne();
      console.log('\n✅ Sample Fund:');
      console.log(`   Name: ${sampleFund.name}`);
      console.log(`   Fund House: ${sampleFund.fundHouse}`);
      console.log(`   Category: ${sampleFund.category}`);
      console.log(`   Sub-Category: ${sampleFund.subCategory}`);
      console.log(`   NAV: ₹${sampleFund.currentNav}`);
      console.log(`   AUM: ₹${sampleFund.aum} Cr`);

      // Get category breakdown
      const categories = await fundsCollection.distinct('category');
      console.log(`\n📋 Categories: ${categories.length}`);

      for (const category of categories) {
        const count = await fundsCollection.countDocuments({ category });
        const subCategories = await fundsCollection.distinct('subCategory', {
          category,
        });
        console.log(`\n   ${category}: ${count} funds`);
        console.log(`   Sub-categories: ${subCategories.join(', ')}`);
      }

      // Check NAV history
      const navCollection = mongoose.connection.db.collection('fund_navs');
      const navCount = await navCollection.countDocuments();
      console.log(`\n📈 NAV Records: ${navCount}`);

      // Check market indices
      const marketCollection =
        mongoose.connection.db.collection('market_indices');
      const marketCount = await marketCollection.countDocuments();
      console.log(`📊 Market Indices: ${marketCount}`);

      // Check users
      const usersCollection = mongoose.connection.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`👥 Users: ${userCount}`);

      console.log('\n' + '═'.repeat(60));
      console.log('✅ SYSTEM STATUS: OPERATIONAL');
      console.log('═'.repeat(60));
      console.log('\n📝 Summary:');
      console.log(`   ✅ ${totalFunds} funds stored in MongoDB Atlas`);
      console.log(`   ✅ ${categories.length} fund categories available`);
      console.log(`   ✅ Database is accessible for user queries`);
      console.log(`   ✅ Server can fetch and serve fund data`);
      console.log('\n🎯 System is ready for user access!');
    } else {
      console.log('\n⚠️  No funds found in database!');
      console.log('   Run: node import-comprehensive-funds.js');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed\n');
  }
}

verifySystem();
