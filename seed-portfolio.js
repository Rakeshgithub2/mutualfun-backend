// Script to seed portfolio data for a user
const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual_funds_db';

// Your user ID from the token (from previous logs)
const USER_ID = '6921c38955baa4ce5473ce10';

async function seedPortfolio() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Get some funds from the database
    const funds = await db.collection('funds').find().limit(5).toArray();

    if (funds.length === 0) {
      console.error('❌ No funds found in database. Please seed funds first.');
      process.exit(1);
    }

    console.log(`📊 Found ${funds.length} funds`);

    // Create a portfolio
    const portfolio = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(USER_ID),
      name: 'My Investment Portfolio',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('portfolios').insertOne(portfolio);
    console.log('✅ Portfolio created:', portfolio._id);

    // Create portfolio items (investments)
    const portfolioItems = funds.map((fund, index) => {
      const investedAmount = (index + 1) * 10000; // ₹10k, ₹20k, ₹30k, etc.
      const currentNav = fund.currentNav || 50;
      const units = investedAmount / (currentNav * 0.9); // Bought at slightly lower NAV

      return {
        _id: new mongoose.Types.ObjectId(),
        portfolioId: portfolio._id,
        fundId: fund._id,
        units: parseFloat(units.toFixed(4)),
        investedAmount: investedAmount,
        purchaseDate: new Date(
          Date.now() - (90 - index * 10) * 24 * 60 * 60 * 1000
        ), // 90-50 days ago
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await db.collection('portfolioitems').insertMany(portfolioItems);
    console.log(`✅ Created ${portfolioItems.length} portfolio items`);

    // Calculate summary
    const totalInvested = portfolioItems.reduce(
      (sum, item) => sum + item.investedAmount,
      0
    );
    const totalCurrent = portfolioItems.reduce((sum, item) => {
      const fund = funds.find((f) => f._id.equals(item.fundId));
      return sum + item.units * (fund?.currentNav || 50);
    }, 0);
    const returns = totalCurrent - totalInvested;
    const returnsPercent = (returns / totalInvested) * 100;

    console.log('\n📈 Portfolio Summary:');
    console.log(`   Total Invested: ₹${totalInvested.toLocaleString('en-IN')}`);
    console.log(`   Current Value:  ₹${totalCurrent.toLocaleString('en-IN')}`);
    console.log(
      `   Returns:        ₹${returns.toLocaleString(
        'en-IN'
      )} (${returnsPercent.toFixed(2)}%)`
    );
    console.log('\n✅ Portfolio seeded successfully!');
    console.log(
      '\n🎉 Now login and visit http://localhost:5001/portfolio to see your investments!'
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding portfolio:', error);
    process.exit(1);
  }
}

seedPortfolio();
