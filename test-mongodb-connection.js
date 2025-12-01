const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log('📍 URL:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB Atlas');

    // Extract database name
    let dbName = 'mutual_funds_db';
    const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
    if (match && match[1]) {
      dbName = match[1];
    }

    console.log('📦 Database name:', dbName);

    const db = client.db(dbName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(
      '\n📚 Collections found:',
      collections.map((c) => c.name).join(', ')
    );

    // Check funds collection
    const fundsCollection = db.collection('funds');
    const fundCount = await fundsCollection.countDocuments();
    console.log('\n💰 Total funds in database:', fundCount);

    if (fundCount > 0) {
      // Get sample funds
      const sampleFunds = await fundsCollection.find().limit(5).toArray();
      console.log('\n📊 Sample funds:');
      sampleFunds.forEach((fund) => {
        console.log(
          `  - ${fund.name} (${fund.category || 'N/A'}) - ${fund.fundHouse || 'N/A'}`
        );
      });

      // Check categories
      const categories = await fundsCollection.distinct('category');
      console.log('\n📁 Categories:', categories.join(', '));
    } else {
      console.log(
        '\n⚠️  No funds found in database. You need to seed the database.'
      );
      console.log('Run: npm run import:real-world:comprehensive');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

testConnection();
