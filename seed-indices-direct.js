/**
 * DIRECT SEED MARKET INDICES
 * Directly inserts market data into MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function seedMarketIndices() {
  try {
    console.log('\n🔄 DIRECT MARKET INDICES SEEDING\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Define schema and model
    const marketIndexSchema = new mongoose.Schema(
      {
        symbol: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
        change: {
          value: Number,
          percent: Number,
        },
        open: Number,
        high: Number,
        low: Number,
        close: Number,
        previousClose: Number,
        volume: Number,
        lastUpdated: { type: Date, required: true },
        marketStatus: {
          type: String,
          enum: ['PRE_OPEN', 'OPEN', 'CLOSED', 'HOLIDAY'],
          default: 'CLOSED',
        },
        category: {
          type: String,
          enum: ['BROAD_MARKET', 'SECTORAL', 'THEMATIC', 'STRATEGY'],
          default: 'BROAD_MARKET',
        },
        exchange: { type: String, enum: ['NSE', 'BSE'], default: 'NSE' },
        isActive: { type: Boolean, default: true },
      },
      { timestamps: true, collection: 'market_indices' }
    );

    const MarketIndex = mongoose.model('MarketIndex', marketIndexSchema);

    // Clear existing data
    console.log('🗑️  Clearing existing indices...');
    await MarketIndex.deleteMany({});
    console.log('✅ Cleared\n');

    // Prepare fresh data with current timestamp
    const now = new Date();
    const indices = [
      {
        symbol: 'NIFTY50',
        name: 'NIFTY 50',
        value: 26129.6,
        change: { value: 192.85, percent: 0.74 },
        open: 25936.75,
        high: 26145.2,
        low: 25920.0,
        close: 26129.6,
        previousClose: 25936.75,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'BROAD_MARKET',
        exchange: 'NSE',
        isActive: true,
      },
      {
        symbol: 'SENSEX',
        name: 'SENSEX',
        value: 85220.6,
        change: { value: 541.95, percent: 0.64 },
        open: 84678.65,
        high: 85300.45,
        low: 84650.0,
        close: 85220.6,
        previousClose: 84678.65,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'BROAD_MARKET',
        exchange: 'BSE',
        isActive: true,
      },
      {
        symbol: 'BANKNIFTY',
        name: 'NIFTY BANK',
        value: 59581.85,
        change: { value: 408.55, percent: 0.69 },
        open: 59173.3,
        high: 59650.0,
        low: 59100.0,
        close: 59581.85,
        previousClose: 59173.3,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'SECTORAL',
        exchange: 'NSE',
        isActive: true,
      },
      {
        symbol: 'NIFTYIT',
        name: 'NIFTY IT',
        value: 40245.3,
        change: { value: 125.6, percent: 0.31 },
        open: 40119.7,
        high: 40300.0,
        low: 40050.0,
        close: 40245.3,
        previousClose: 40119.7,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'SECTORAL',
        exchange: 'NSE',
        isActive: true,
      },
      {
        symbol: 'NIFTYMIDCAP',
        name: 'NIFTY MIDCAP 100',
        value: 57890.45,
        change: { value: -156.3, percent: -0.27 },
        open: 58046.75,
        high: 58100.0,
        low: 57800.0,
        close: 57890.45,
        previousClose: 58046.75,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'BROAD_MARKET',
        exchange: 'NSE',
        isActive: true,
      },
      {
        symbol: 'NIFTYSMALLCAP',
        name: 'NIFTY SMALLCAP 100',
        value: 18765.2,
        change: { value: -89.4, percent: -0.47 },
        open: 18854.6,
        high: 18900.0,
        low: 18700.0,
        close: 18765.2,
        previousClose: 18854.6,
        volume: 0,
        lastUpdated: now,
        marketStatus: 'CLOSED',
        category: 'BROAD_MARKET',
        exchange: 'NSE',
        isActive: true,
      },
    ];

    console.log('💾 Inserting market indices...');
    const result = await MarketIndex.insertMany(indices, { ordered: true });
    console.log(`✅ Inserted ${result.length} indices\n`);

    // Wait for MongoDB to commit (important!)
    console.log('⏳ Waiting for MongoDB to persist data...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Verify
    const count = await MarketIndex.countDocuments();
    console.log(`📊 Verification: ${count} documents in database\n`);

    if (count > 0) {
      const saved = await MarketIndex.find().lean();
      console.log('✅ Saved Indices:');
      saved.forEach((idx) => {
        const changeSign = idx.change.percent >= 0 ? '+' : '';
        console.log(
          `   • ${idx.name}: ${idx.value} (${changeSign}${idx.change.percent.toFixed(2)}%)`
        );
      });
    }

    console.log('\n✅ SEEDING COMPLETE!\n');

    // Wait before disconnecting
    console.log('⏳ Ensuring data is persisted...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Properly close connection
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run
seedMarketIndices();
