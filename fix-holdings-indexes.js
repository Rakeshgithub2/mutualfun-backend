/**
 * Drop old holdings indexes
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

async function dropIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('fund_holdings');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📇 Current Indexes:');
    indexes.forEach((idx) => {
      console.log(`  - ${idx.name}`);
    });

    // Drop all indexes except _id
    console.log('\n🗑️  Dropping old indexes...');
    await collection.dropIndexes();
    console.log('✅ Old indexes dropped');

    // Recreate proper indexes
    console.log('\n📇 Creating new indexes...');
    await collection.createIndex({ schemeCode: 1, reportDate: -1 });
    await collection.createIndex({ fundName: 1, reportDate: -1 });
    await collection.createIndex({ security: 1, reportDate: -1 });
    await collection.createIndex({ weight: -1 });
    await collection.createIndex({ schemeCode: 1 });
    await collection.createIndex({ sector: 1 });
    console.log('✅ New indexes created');

    const newIndexes = await collection.indexes();
    console.log('\n📇 New Indexes:');
    newIndexes.forEach((idx) => {
      console.log(`  - ${idx.name}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

dropIndexes();
