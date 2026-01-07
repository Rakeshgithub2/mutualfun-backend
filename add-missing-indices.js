const mongoose = require('mongoose');
require('dotenv').config();

const MarketIndex = require('./src/models/MarketIndex.model');

const missingIndices = [
  {
    symbol: 'FINNIFTY',
    name: 'FIN NIFTY',
    value: 23450.75,
    change: { value: 125.3, percent: 0.54 },
    open: 23325.45,
    high: 23500.0,
    low: 23300.0,
    close: 23450.75,
    previousClose: 23325.45,
    volume: 0,
    lastUpdated: new Date(),
    marketStatus: 'CLOSED',
    category: 'SECTORAL',
    exchange: 'NSE',
    isActive: true,
  },
  {
    symbol: 'NIFTYFMCG',
    name: 'NIFTY FMCG',
    value: 55890.3,
    change: { value: -78.2, percent: -0.14 },
    open: 55968.5,
    high: 56000.0,
    low: 55850.0,
    close: 55890.3,
    previousClose: 55968.5,
    volume: 0,
    lastUpdated: new Date(),
    marketStatus: 'CLOSED',
    category: 'SECTORAL',
    exchange: 'NSE',
    isActive: true,
  },
  {
    symbol: 'NIFTYAUTO',
    name: 'NIFTY AUTO',
    value: 22345.6,
    change: { value: 98.45, percent: 0.44 },
    open: 22247.15,
    high: 22400.0,
    low: 22200.0,
    close: 22345.6,
    previousClose: 22247.15,
    volume: 0,
    lastUpdated: new Date(),
    marketStatus: 'CLOSED',
    category: 'SECTORAL',
    exchange: 'NSE',
    isActive: true,
  },
  {
    symbol: 'NIFTYPHARMA',
    name: 'NIFTY PHARMA',
    value: 20789.45,
    change: { value: 56.8, percent: 0.27 },
    open: 20732.65,
    high: 20850.0,
    low: 20700.0,
    close: 20789.45,
    previousClose: 20732.65,
    volume: 0,
    lastUpdated: new Date(),
    marketStatus: 'CLOSED',
    category: 'SECTORAL',
    exchange: 'NSE',
    isActive: true,
  },
  {
    symbol: 'GIFTNIFTY',
    name: 'GIFT NIFTY',
    value: 26150.8,
    change: { value: 205.6, percent: 0.79 },
    open: 25945.2,
    high: 26180.0,
    low: 25930.0,
    close: 26150.8,
    previousClose: 25945.2,
    volume: 0,
    lastUpdated: new Date(),
    marketStatus: 'CLOSED',
    category: 'BROAD_MARKET',
    exchange: 'NSE',
    isActive: true,
  },
];

async function addMissingIndices() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    for (const indexData of missingIndices) {
      const existing = await MarketIndex.findOne({ symbol: indexData.symbol });

      if (existing) {
        console.log(`⚠️  ${indexData.symbol} already exists, updating...`);
        await MarketIndex.updateOne({ symbol: indexData.symbol }, indexData);
        console.log(`✅ Updated ${indexData.symbol}`);
      } else {
        await MarketIndex.create(indexData);
        console.log(`✅ Added ${indexData.symbol} - ${indexData.name}`);
      }
    }

    console.log('\n✅ All missing indices added successfully');

    // Show final count
    const total = await MarketIndex.countDocuments({ isActive: true });
    console.log(`📊 Total active indices: ${total}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMissingIndices();
