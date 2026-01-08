const mongoose = require('mongoose');

async function clearAndImportRealDataOnly() {
  await mongoose.connect('mongodb://localhost:27017/mutual-funds');
  const db = mongoose.connection.db;

  console.log('🗑️  Clearing ALL existing holdings data...');
  const result = await db.collection('fund_holdings').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} records\n`);

  await mongoose.disconnect();

  // Now run the real import
  console.log('📥 Importing REAL FACTSHEET DATA only...\n');
  require('./import-real-factsheet-data.js');
}

clearAndImportRealDataOnly().catch(console.error);
