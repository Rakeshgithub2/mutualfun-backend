const mongoose = require('mongoose');
require('dotenv').config();

// Schema for Fund NAV History
const fundNavSchema = new mongoose.Schema({
  fundId: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  nav: { type: Number, required: true },
  change: Number,
  changePercent: Number,
  createdAt: { type: Date, default: Date.now },
});

const FundNav = mongoose.model('FundNav', fundNavSchema, 'fund_navs');

async function generateNavHistory() {
  try {
    console.log('\n📈 Starting NAV History Generation...\n');

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB Connected');
    console.log(`📍 Database: ${mongoose.connection.db.databaseName}\n`);

    // Get all funds
    const fundsCollection = mongoose.connection.db.collection('funds');
    const funds = await fundsCollection.find().toArray();
    console.log(`📊 Found ${funds.length} funds\n`);

    // Clear existing NAV history
    await FundNav.deleteMany({});
    console.log('🗑️  Cleared existing NAV history\n');

    let totalNavRecords = 0;

    for (const fund of funds) {
      const currentNav = fund.currentNav || 100;
      const returns1Y = fund.returns?.oneYear || 12;

      // Calculate starting NAV (2 years ago)
      const startNav = currentNav / Math.pow(1 + returns1Y / 100, 2);

      // Generate daily NAV for last 2 years
      const navHistory = [];
      const now = new Date();

      for (let i = 730; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Calculate NAV with growth and volatility
        const daysSinceStart = 730 - i;
        const growthFactor = Math.pow(
          1 + returns1Y / 100,
          daysSinceStart / 365
        );
        const volatility = 1 + (Math.random() * 0.03 - 0.015); // ±1.5% daily volatility
        const nav = parseFloat(
          (startNav * growthFactor * volatility).toFixed(2)
        );

        // Calculate change from previous NAV
        const previousNav =
          navHistory.length > 0 ? navHistory[navHistory.length - 1].nav : nav;
        const change = parseFloat((nav - previousNav).toFixed(2));
        const changePercent = parseFloat(
          ((change / previousNav) * 100).toFixed(2)
        );

        navHistory.push({
          fundId: fund.fundId,
          date: date,
          nav: nav,
          change: change,
          changePercent: changePercent,
          createdAt: new Date(),
        });
      }

      // Insert NAV history in batches
      if (navHistory.length > 0) {
        await FundNav.insertMany(navHistory);
        totalNavRecords += navHistory.length;

        // Update fund's current NAV to latest
        const latestNav = navHistory[navHistory.length - 1];
        await fundsCollection.updateOne(
          { _id: fund._id },
          {
            $set: {
              currentNav: latestNav.nav,
              previousNav:
                navHistory[navHistory.length - 2]?.nav || latestNav.nav,
            },
          }
        );
      }

      if ((funds.indexOf(fund) + 1) % 10 === 0) {
        console.log(
          `✅ Processed ${funds.indexOf(fund) + 1}/${funds.length} funds...`
        );
      }
    }

    console.log(`\n📊 Generated ${totalNavRecords} NAV records`);
    console.log(
      `📈 Average ${Math.floor(totalNavRecords / funds.length)} records per fund`
    );
    console.log('\n🎉 NAV history generation complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed\n');
  }
}

generateNavHistory();
