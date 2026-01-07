require('dotenv').config();
const mongoose = require('mongoose');
const MarketIndex = require('./src/models/MarketIndices.model');

async function test() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to MongoDB');

  const requiredNames = [
    'nifty50',
    'sensex',
    'niftymidcap',
    'niftysmallcap',
    'niftybank',
    'niftyit',
    'niftypharma',
    'niftyauto',
    'niftyfmcg',
    'niftymetal',
    'commodity',
    'giftnifty',
  ];

  console.log('\n🔍 Query 1: Find with $in operator');
  const indices1 = await MarketIndex.find({
    name: { $in: requiredNames },
  }).lean();
  console.log(`Found: ${indices1.length} documents`);
  if (indices1.length > 0) {
    console.log('First:', indices1[0].name, indices1[0].value);
  }

  console.log('\n🔍 Query 2: Find all documents');
  const indices2 = await MarketIndex.find({}).lean();
  console.log(`Found: ${indices2.length} documents`);
  if (indices2.length > 0) {
    console.log('First:', indices2[0].name, indices2[0].value);
  }

  console.log('\n🔍 Query 3: Direct collection query');
  const db = mongoose.connection.db;
  const indices3 = await db.collection('marketindices').find({}).toArray();
  console.log(`Found: ${indices3.length} documents`);
  if (indices3.length > 0) {
    console.log('First:', indices3[0].name, indices3[0].value);
  }

  await mongoose.connection.close();
}

test().catch(console.error);
