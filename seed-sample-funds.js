const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/mutual_funds_db';

const sampleFunds = [
  {
    _id: '1',
    amfiCode: 'MF001',
    name: 'HDFC Equity Fund - Direct Plan - Growth',
    type: 'Equity',
    category: 'Large Cap',
    benchmark: 'Nifty 50',
    expenseRatio: 1.25,
    inceptionDate: new Date('2010-01-15'),
    description: 'A large cap equity fund focusing on blue-chip companies',
    currentNav: 285.5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    amfiCode: 'MF002',
    name: 'ICICI Prudential Balanced Advantage Fund - Direct - Growth',
    type: 'Hybrid',
    category: 'Dynamic Asset Allocation',
    benchmark: 'CRISIL Hybrid 35+65 Index',
    expenseRatio: 0.98,
    inceptionDate: new Date('2012-05-20'),
    description:
      'A balanced fund that dynamically allocates between equity and debt',
    currentNav: 156.75,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    amfiCode: 'MF003',
    name: 'SBI Small Cap Fund - Direct Plan - Growth',
    type: 'Equity',
    category: 'Small Cap',
    benchmark: 'Nifty Smallcap 100',
    expenseRatio: 1.15,
    inceptionDate: new Date('2015-03-10'),
    description: 'High growth potential small cap equity fund',
    currentNav: 98.25,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    amfiCode: 'MF004',
    name: 'Axis Bluechip Fund - Direct Plan - Growth',
    type: 'Equity',
    category: 'Large Cap',
    benchmark: 'Nifty 100',
    expenseRatio: 0.85,
    inceptionDate: new Date('2013-01-01'),
    description: 'Invests in fundamentally strong large cap companies',
    currentNav: 312.4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    amfiCode: 'MF005',
    name: 'Mirae Asset Emerging Bluechip Fund - Direct - Growth',
    type: 'Equity',
    category: 'Large & Mid Cap',
    benchmark: 'Nifty Large Midcap 250',
    expenseRatio: 1.05,
    inceptionDate: new Date('2014-07-15'),
    description: 'Invests in both large and mid cap companies',
    currentNav: 185.9,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Clear existing data
    await fundsCollection.deleteMany({});
    console.log('🗑️  Cleared existing funds');

    // Insert sample funds
    const result = await fundsCollection.insertMany(sampleFunds);
    console.log(`✅ Inserted ${result.insertedCount} sample funds`);

    // Verify insertion
    const count = await fundsCollection.countDocuments();
    console.log(`📊 Total funds in database: ${count}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedData();
