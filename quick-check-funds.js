const mongoose = require('mongoose');

async function checkFunds() {
  await mongoose.connect('mongodb://localhost:27017/mutual-funds');
  const db = mongoose.connection.db;

  const count = await db.collection('funds').countDocuments();
  const sample = await db.collection('funds').find({}).limit(5).toArray();

  console.log('Total funds:', count);
  console.log('\nSample funds:');
  sample.forEach((f) => {
    console.log(
      `  • ${f.schemeName || f.name} (Code: ${f.schemeCode || 'N/A'})`
    );
  });

  await mongoose.disconnect();
}

checkFunds().catch(console.error);
