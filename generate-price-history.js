const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Generate realistic price history for each fund
async function generatePriceHistory() {
  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');
    const pricesCollection = db.collection('fundPrices');

    // Clear existing price history
    await pricesCollection.deleteMany({});
    console.log('🗑️  Cleared existing price history');

    // Get all funds
    const funds = await fundsCollection.find({ isActive: true }).toArray();
    console.log(`\n📊 Generating price history for ${funds.length} funds...`);

    let totalPrices = 0;

    for (const fund of funds) {
      const currentNav = fund.currentNav;
      const returns1Y = fund.returns?.oneYear || 15; // Default 15% if not available

      // Calculate starting NAV based on 1-year return
      const startNav = currentNav / (1 + returns1Y / 100);

      // Generate daily prices for the last 2 years (730 days)
      const priceHistory = [];
      const now = new Date();

      for (let i = 730; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Create realistic NAV progression with some volatility
        const progress = (730 - i) / 730; // 0 to 1
        const expectedNav = startNav + (currentNav - startNav) * progress;

        // Add some random volatility (±2%)
        const volatility = 1 + (Math.random() * 0.04 - 0.02);
        const nav = expectedNav * volatility;

        // Create OHLC data (simplified - all values similar for mutual funds)
        const dayVolatility = Math.random() * 0.01; // ±1% intraday

        priceHistory.push({
          fundId: fund._id.toString(),
          date: date,
          nav: parseFloat(nav.toFixed(2)),
          open: parseFloat((nav * (1 - dayVolatility)).toFixed(2)),
          high: parseFloat((nav * (1 + dayVolatility)).toFixed(2)),
          low: parseFloat((nav * (1 - dayVolatility * 0.8)).toFixed(2)),
          close: parseFloat(nav.toFixed(2)),
          volume: Math.floor(Math.random() * 10000000) + 1000000, // Random volume
          createdAt: new Date(),
        });
      }

      // Insert price history
      if (priceHistory.length > 0) {
        await pricesCollection.insertMany(priceHistory);
        totalPrices += priceHistory.length;
      }
    }

    console.log(`\n✅ Generated ${totalPrices} price history records`);
    console.log(
      `📈 Average ${Math.floor(totalPrices / funds.length)} days per fund`
    );
    console.log('\n🎉 Price history generation complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

generatePriceHistory();
