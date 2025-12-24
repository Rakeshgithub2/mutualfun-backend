const mongoose = require('mongoose');
require('dotenv').config();

const marketIndexSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['broad', 'sectoral'], required: true },
  value: { type: Number, required: true },
  change: Number,
  changePercent: Number,
  open: Number,
  high: Number,
  low: Number,
  previousClose: Number,
  lastUpdated: { type: Date, default: Date.now },
  dataSource: { type: String, default: 'nse' },
  createdAt: { type: Date, default: Date.now },
});

const MarketIndex = mongoose.model(
  'MarketIndex',
  marketIndexSchema,
  'market_indices'
);

async function importMarketIndices() {
  try {
    console.log('\n📊 Starting Market Indices Import...\n');

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB Connected');
    console.log(`📍 Database: ${mongoose.connection.db.databaseName}\n`);

    // Clear existing indices
    await MarketIndex.deleteMany({});
    console.log('🗑️  Cleared existing market indices\n');

    // Market indices data
    const indices = [
      // Broad Market Indices
      {
        symbol: 'NIFTY50',
        name: 'Nifty 50',
        type: 'broad',
        value: 21731.4,
        open: 21650.0,
        high: 21850.3,
        low: 21580.5,
        previousClose: 21720.8,
        change: 10.6,
        changePercent: 0.05,
      },
      {
        symbol: 'NIFTYNEXT50',
        name: 'Nifty Next 50',
        type: 'broad',
        value: 48235.7,
        open: 48100.0,
        high: 48450.2,
        low: 47980.4,
        previousClose: 48180.3,
        change: 55.4,
        changePercent: 0.11,
      },
      {
        symbol: 'SENSEX',
        name: 'S&P BSE Sensex',
        type: 'broad',
        value: 72426.64,
        open: 72250.3,
        high: 72580.45,
        low: 72180.2,
        previousClose: 72398.5,
        change: 28.14,
        changePercent: 0.04,
      },
      {
        symbol: 'NIFTYMIDCAP100',
        name: 'Nifty Midcap 100',
        type: 'broad',
        value: 43825.35,
        open: 43650.2,
        high: 43980.7,
        low: 43520.4,
        previousClose: 43765.8,
        change: 59.55,
        changePercent: 0.14,
      },
      {
        symbol: 'NIFTYSMALLCAP100',
        name: 'Nifty Smallcap 100',
        type: 'broad',
        value: 14235.8,
        open: 14150.3,
        high: 14320.5,
        low: 14100.2,
        previousClose: 14198.4,
        change: 37.4,
        changePercent: 0.26,
      },

      // Sectoral Indices
      {
        symbol: 'NIFTYBANK',
        name: 'Nifty Bank',
        type: 'sectoral',
        value: 48650.25,
        open: 48500.5,
        high: 48825.7,
        low: 48380.3,
        previousClose: 48590.8,
        change: 59.45,
        changePercent: 0.12,
      },
      {
        symbol: 'NIFTYFINSERVICE',
        name: 'Nifty Financial Services',
        type: 'sectoral',
        value: 21345.6,
        open: 21280.4,
        high: 21420.8,
        low: 21230.5,
        previousClose: 21318.3,
        change: 27.3,
        changePercent: 0.13,
      },
      {
        symbol: 'NIFTYIT',
        name: 'Nifty IT',
        type: 'sectoral',
        value: 33456.8,
        open: 33320.5,
        high: 33580.4,
        low: 33250.3,
        previousClose: 33398.6,
        change: 58.2,
        changePercent: 0.17,
      },
      {
        symbol: 'NIFTYPHARMA',
        name: 'Nifty Pharma',
        type: 'sectoral',
        value: 17235.4,
        open: 17180.3,
        high: 17298.5,
        low: 17150.2,
        previousClose: 17208.7,
        change: 26.7,
        changePercent: 0.16,
      },
      {
        symbol: 'NIFTYAUTO',
        name: 'Nifty Auto',
        type: 'sectoral',
        value: 18432.9,
        open: 18350.6,
        high: 18520.3,
        low: 18310.4,
        previousClose: 18398.5,
        change: 34.4,
        changePercent: 0.19,
      },
      {
        symbol: 'NIFTYFMCG',
        name: 'Nifty FMCG',
        type: 'sectoral',
        value: 54320.7,
        open: 54250.3,
        high: 54450.8,
        low: 54180.5,
        previousClose: 54285.4,
        change: 35.3,
        changePercent: 0.07,
      },
      {
        symbol: 'NIFTYMETAL',
        name: 'Nifty Metal',
        type: 'sectoral',
        value: 7856.3,
        open: 7820.5,
        high: 7895.7,
        low: 7800.2,
        previousClose: 7838.6,
        change: 17.7,
        changePercent: 0.23,
      },
      {
        symbol: 'NIFTYREALTY',
        name: 'Nifty Realty',
        type: 'sectoral',
        value: 823.45,
        open: 818.3,
        high: 828.6,
        low: 815.2,
        previousClose: 820.8,
        change: 2.65,
        changePercent: 0.32,
      },
      {
        symbol: 'NIFTYENERGY',
        name: 'Nifty Energy',
        type: 'sectoral',
        value: 34567.8,
        open: 34480.5,
        high: 34680.3,
        low: 34420.7,
        previousClose: 34523.4,
        change: 44.4,
        changePercent: 0.13,
      },
      {
        symbol: 'NIFTYMEDIA',
        name: 'Nifty Media',
        type: 'sectoral',
        value: 1923.5,
        open: 1910.3,
        high: 1935.8,
        low: 1905.2,
        previousClose: 1918.7,
        change: 4.8,
        changePercent: 0.25,
      },
    ];

    // Insert indices
    await MarketIndex.insertMany(indices);

    console.log(`✅ Imported ${indices.length} market indices\n`);

    // Show summary
    const broadCount = indices.filter((i) => i.type === 'broad').length;
    const sectoralCount = indices.filter((i) => i.type === 'sectoral').length;

    console.log('📋 Summary:');
    console.log(`   Broad Market Indices: ${broadCount}`);
    console.log(`   Sectoral Indices: ${sectoralCount}`);
    console.log(`   Total: ${indices.length}`);

    console.log('\n📊 Broad Indices:');
    indices
      .filter((i) => i.type === 'broad')
      .forEach((idx) => {
        console.log(
          `   ${idx.name}: ${idx.value} (${idx.changePercent > 0 ? '+' : ''}${idx.changePercent}%)`
        );
      });

    console.log('\n📊 Sectoral Indices:');
    indices
      .filter((i) => i.type === 'sectoral')
      .forEach((idx) => {
        console.log(
          `   ${idx.name}: ${idx.value} (${idx.changePercent > 0 ? '+' : ''}${idx.changePercent}%)`
        );
      });

    console.log('\n🎉 Market indices import complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed\n');
  }
}

importMarketIndices();
