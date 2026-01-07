const mongoose = require('mongoose');
require('dotenv').config();

async function fixSchemeCodeIndex() {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    console.log('🔗 Connecting to:', dbUrl.replace(/:[^:@]+@/, ':***@'));

    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database name:', mongoose.connection.name);

    const db = mongoose.connection.db;
    const collection = db.collection('funds');

    // Check existing indexes
    console.log('\n📊 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach((idx) => {
      console.log(
        `  - ${idx.name}:`,
        JSON.stringify(idx.key),
        idx.unique ? '(unique)' : '',
        idx.sparse ? '(sparse)' : ''
      );
    });

    // Drop the existing schemeCode_1 index
    console.log('\n🗑️ Dropping old schemeCode_1 index...');
    try {
      await collection.dropIndex('schemeCode_1');
      console.log('✅ Old index dropped');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('ℹ️ Index already dropped or does not exist');
      } else {
        throw error;
      }
    }

    // Create new sparse unique index
    console.log('\n🔨 Creating new sparse unique index on schemeCode...');
    await collection.createIndex(
      { schemeCode: 1 },
      {
        unique: true,
        sparse: true, // This is the key - only enforce uniqueness when field exists
        name: 'schemeCode_1_sparse',
      }
    );
    console.log('✅ New sparse index created');

    // Verify new indexes
    console.log('\n📊 Updated indexes:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach((idx) => {
      console.log(
        `  - ${idx.name}:`,
        JSON.stringify(idx.key),
        idx.unique ? '(unique)' : '',
        idx.sparse ? '(sparse)' : ''
      );
    });

    // Count funds with and without schemeCode
    const withSchemeCode = await collection.countDocuments({
      schemeCode: { $ne: null, $exists: true },
    });
    const withoutSchemeCode = await collection.countDocuments({
      $or: [{ schemeCode: null }, { schemeCode: { $exists: false } }],
    });

    console.log('\n📈 Fund statistics:');
    console.log(`  - Funds with schemeCode: ${withSchemeCode}`);
    console.log(`  - Funds without schemeCode: ${withoutSchemeCode}`);
    console.log(`  - Total funds: ${withSchemeCode + withoutSchemeCode}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected - Index fix complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

fixSchemeCodeIndex();
