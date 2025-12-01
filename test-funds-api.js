const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;
let db;

async function connectDB() {
  const client = new MongoClient(DATABASE_URL);
  await client.connect();

  let dbName = 'mutual_funds_db';
  if (DATABASE_URL.includes('mongodb+srv://')) {
    const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
    if (match && match[1]) dbName = match[1];
  }

  db = client.db(dbName);
  console.log('✅ Connected to MongoDB Atlas');
}

app.get('/api/funds', async (req, res) => {
  try {
    console.log('📥 GET /api/funds request received');

    const fundsCollection = db.collection('funds');
    const funds = await fundsCollection
      .find({ isActive: true })
      .limit(20)
      .toArray();

    console.log(`✅ Found ${funds.length} funds`);

    const response = funds.map((fund) => ({
      id: fund._id,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      subCategory: fund.subCategory,
      fundHouse: fund.fundHouse,
      currentNav: fund.currentNav,
      returns: fund.returns,
    }));

    res.json({
      success: true,
      data: response,
      total: funds.length,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log(`📊 Test: http://localhost:${PORT}/api/funds`);
  });
});
