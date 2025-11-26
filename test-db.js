const { MongoClient } = require('mongodb');

async function test() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('mutual_funds_db');
    const count = await db.collection('funds').countDocuments();
    console.log(`\n✅ Database has ${count} funds`);

    const sample = await db.collection('funds').find().limit(5).toArray();
    console.log('\nSample funds:');
    sample.forEach((f) => console.log(`  - ${f.name} [${f.category}]`));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

test();
