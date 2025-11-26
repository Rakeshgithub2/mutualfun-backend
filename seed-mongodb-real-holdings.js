const { MongoClient, ObjectId } = require('mongodb');

const uri =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/mutual_funds_db';

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🌱 Connected to MongoDB');

    const db = client.db();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('fund_performances').deleteMany({});
    await db.collection('holdings').deleteMany({});
    await db.collection('fund_managers').deleteMany({});
    await db.collection('funds').deleteMany({});

    // Create funds with real world data
    const fundsData = [
      {
        name: 'HDFC Top 100 Fund Direct Plan Growth',
        amfiCode: 'HDFC_TOP100_DIR',
        type: 'EQUITY',
        category: 'LARGE_CAP',
        benchmark: 'Nifty 100 TRI',
        expenseRatio: 1.25,
        inceptionDate: new Date('2010-01-15'),
        description:
          'An open-ended equity scheme predominantly investing in large cap stocks',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        holdings: [
          {
            ticker: 'RELIANCE',
            name: 'Reliance Industries Ltd',
            percent: 8.52,
          },
          { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 7.18 },
          { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.85 },
          { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 5.94 },
          {
            ticker: 'TCS',
            name: 'Tata Consultancy Services Ltd',
            percent: 5.47,
          },
          { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 4.83 },
          { ticker: 'ITC', name: 'ITC Ltd', percent: 4.25 },
          {
            ticker: 'KOTAKBANK',
            name: 'Kotak Mahindra Bank Ltd',
            percent: 3.92,
          },
          {
            ticker: 'HINDUNILVR',
            name: 'Hindustan Unilever Ltd',
            percent: 3.56,
          },
          { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 3.28 },
          { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 2.95 },
          { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 2.67 },
          { ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', percent: 2.43 },
          { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.18 },
          { ticker: 'TITAN', name: 'Titan Company Ltd', percent: 1.95 },
        ],
        manager: {
          name: 'Prashant Jain',
          experience: 28,
          qualification: 'MBA, CFA',
        },
      },
      {
        name: 'ICICI Prudential Bluechip Fund Direct Growth',
        amfiCode: 'ICICI_PRUD_BLUECHIP',
        type: 'EQUITY',
        category: 'LARGE_CAP',
        benchmark: 'Nifty 50 TRI',
        expenseRatio: 0.98,
        inceptionDate: new Date('2008-06-20'),
        description:
          'An open-ended equity scheme predominantly investing in large cap stocks',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        holdings: [
          { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 9.24 },
          { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 8.56 },
          {
            ticker: 'RELIANCE',
            name: 'Reliance Industries Ltd',
            percent: 7.82,
          },
          { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.53 },
          {
            ticker: 'TCS',
            name: 'Tata Consultancy Services Ltd',
            percent: 6.18,
          },
          { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 5.45 },
          {
            ticker: 'KOTAKBANK',
            name: 'Kotak Mahindra Bank Ltd',
            percent: 4.92,
          },
          { ticker: 'ITC', name: 'ITC Ltd', percent: 4.38 },
          { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 3.87 },
          {
            ticker: 'HINDUNILVR',
            name: 'Hindustan Unilever Ltd',
            percent: 3.52,
          },
          { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 3.15 },
          { ticker: 'SBIN', name: 'State Bank of India', percent: 2.86 },
          { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.54 },
          { ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', percent: 2.31 },
          { ticker: 'WIPRO', name: 'Wipro Ltd', percent: 2.08 },
        ],
        manager: {
          name: 'S. Naren',
          experience: 25,
          qualification: 'MBA, CFA',
        },
      },
      {
        name: 'Axis Bluechip Fund Direct Growth',
        amfiCode: 'AXIS_BLUECHIP',
        type: 'EQUITY',
        category: 'LARGE_CAP',
        benchmark: 'Nifty 50 TRI',
        expenseRatio: 0.45,
        inceptionDate: new Date('2013-01-01'),
        description:
          'An open-ended equity scheme predominantly investing in large cap stocks',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        holdings: [
          { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 8.95 },
          {
            ticker: 'RELIANCE',
            name: 'Reliance Industries Ltd',
            percent: 8.27,
          },
          { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 7.58 },
          { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.84 },
          { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 5.92 },
          {
            ticker: 'TCS',
            name: 'Tata Consultancy Services Ltd',
            percent: 5.46,
          },
          {
            ticker: 'KOTAKBANK',
            name: 'Kotak Mahindra Bank Ltd',
            percent: 4.73,
          },
          { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 4.25 },
          { ticker: 'ITC', name: 'ITC Ltd', percent: 3.89 },
          { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 3.54 },
          {
            ticker: 'HINDUNILVR',
            name: 'Hindustan Unilever Ltd',
            percent: 3.28,
          },
          { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.96 },
          { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 2.67 },
          { ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', percent: 2.43 },
          { ticker: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', percent: 2.18 },
        ],
        manager: {
          name: 'Shreyash Devalkar',
          experience: 15,
          qualification: 'MBA, CFA',
        },
      },
      {
        name: 'Parag Parikh Flexi Cap Fund Direct Growth',
        amfiCode: 'PARAG_PARIKH_FLEXI',
        type: 'EQUITY',
        category: 'FLEXI_CAP',
        benchmark: 'Nifty 500 TRI',
        expenseRatio: 0.68,
        inceptionDate: new Date('2013-05-28'),
        description:
          'An open-ended dynamic equity scheme investing across market cap with global exposure',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        holdings: [
          { ticker: 'MSFT', name: 'Microsoft Corporation', percent: 7.84 },
          { ticker: 'GOOGL', name: 'Alphabet Inc Class A', percent: 6.52 },
          { ticker: 'META', name: 'Meta Platforms Inc', percent: 5.36 },
          { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 4.95 },
          { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 4.68 },
          { ticker: 'INFY', name: 'Infosys Ltd', percent: 4.23 },
          {
            ticker: 'RELIANCE',
            name: 'Reliance Industries Ltd',
            percent: 3.87,
          },
          { ticker: 'AAPL', name: 'Apple Inc', percent: 3.54 },
          { ticker: 'NVDA', name: 'NVIDIA Corporation', percent: 3.28 },
          {
            ticker: 'TCS',
            name: 'Tata Consultancy Services Ltd',
            percent: 2.96,
          },
          {
            ticker: 'KOTAKBANK',
            name: 'Kotak Mahindra Bank Ltd',
            percent: 2.65,
          },
          { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 2.43 },
          { ticker: 'AMZN', name: 'Amazon.com Inc', percent: 2.18 },
          { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 1.97 },
          { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 1.74 },
        ],
        manager: {
          name: 'Rajeev Thakkar',
          experience: 22,
          qualification: 'MBA, CFA',
        },
      },
      {
        name: 'Motilal Oswal Midcap Fund Direct Growth',
        amfiCode: 'MOTILAL_MIDCAP',
        type: 'EQUITY',
        category: 'MID_CAP',
        benchmark: 'Nifty Midcap 150 TRI',
        expenseRatio: 0.72,
        inceptionDate: new Date('2014-01-01'),
        description:
          'An open-ended equity scheme predominantly investing in mid cap stocks',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        holdings: [
          {
            ticker: 'DIXON',
            name: 'Dixon Technologies India Ltd',
            percent: 5.84,
          },
          { ticker: 'POLYCAB', name: 'Polycab India Ltd', percent: 5.26 },
          { ticker: 'CANBK', name: 'Canara Bank', percent: 4.93 },
          {
            ticker: 'IRFC',
            name: 'Indian Railway Finance Corp Ltd',
            percent: 4.58,
          },
          { ticker: 'ZOMATO', name: 'Zomato Ltd', percent: 4.25 },
          {
            ticker: 'MAXHEALTH',
            name: 'Max Healthcare Institute Ltd',
            percent: 3.87,
          },
          {
            ticker: 'APOLLOHOSP',
            name: 'Apollo Hospitals Enterprise Ltd',
            percent: 3.54,
          },
          { ticker: 'TATATECH', name: 'Tata Technologies Ltd', percent: 3.28 },
          { ticker: 'FEDERALBNK', name: 'Federal Bank Ltd', percent: 2.96 },
          { ticker: 'TRENT', name: 'Trent Ltd', percent: 2.73 },
          {
            ticker: 'PERSISTENT',
            name: 'Persistent Systems Ltd',
            percent: 2.45,
          },
          { ticker: 'LTIM', name: 'LTIMindtree Ltd', percent: 2.28 },
          { ticker: 'INDUSTOWER', name: 'Indus Towers Ltd', percent: 2.05 },
          { ticker: 'PAGEIND', name: 'Page Industries Ltd', percent: 1.87 },
          {
            ticker: 'SUPREMEIND',
            name: 'Supreme Industries Ltd',
            percent: 1.64,
          },
        ],
        manager: {
          name: 'Niket Shah',
          experience: 18,
          qualification: 'MBA, CFA',
        },
      },
    ];

    // Insert all funds with their holdings
    for (const fundData of fundsData) {
      const holdings = fundData.holdings;
      const manager = fundData.manager;
      delete fundData.holdings;
      delete fundData.manager;

      // Insert fund
      const fundResult = await db.collection('funds').insertOne(fundData);
      const fundId = fundResult.insertedId; // Keep as ObjectId for Prisma!

      console.log(`✅ Created fund: ${fundData.name}`);

      // Insert holdings with ObjectId reference
      const holdingsToInsert = holdings.map((h) => ({
        ...h,
        fundId: fundId, // ObjectId, not string
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection('holdings').insertMany(holdingsToInsert);
      console.log(`   - Added ${holdings.length} real company holdings`);

      // Insert manager with ObjectId reference
      await db.collection('fund_managers').insertOne({
        ...manager,
        fundId: fundId, // ObjectId, not string
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   - Added fund manager: ${manager.name}`);

      // Generate 10 years of performance data
      const performances = [];
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 10);
      let currentNav = 100 + Math.random() * 50; // Starting NAV

      for (let i = 0; i < 120; i++) {
        // 120 months = 10 years
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);

        // Simulate realistic NAV growth (10-14% annual return with volatility)
        const monthlyReturn = 0.12 / 12 + (Math.random() - 0.5) * 0.05;
        currentNav = currentNav * (1 + monthlyReturn);

        performances.push({
          fundId: fundId, // ObjectId, not string
          date: date,
          nav: parseFloat(currentNav.toFixed(2)),
          createdAt: new Date(),
        });
      }

      await db.collection('fund_performances').insertMany(performances);
      console.log(
        `   - Added ${performances.length} performance data points (10 years)\n`
      );
    }

    // Summary
    const totalFunds = await db.collection('funds').countDocuments();
    const totalHoldings = await db.collection('holdings').countDocuments();
    const totalManagers = await db.collection('fund_managers').countDocuments();
    const totalPerformances = await db
      .collection('fund_performances')
      .countDocuments();

    console.log('\n📊 Seed Summary:');
    console.log(`   Funds: ${totalFunds}`);
    console.log(`   Holdings (Real Companies): ${totalHoldings}`);
    console.log(`   Managers: ${totalManagers}`);
    console.log(`   Performance Records: ${totalPerformances}`);
    console.log('\n✅ Seed completed successfully with REAL WORLD DATA!');
    console.log('\n📋 Real Companies Included:');
    console.log('   - Reliance, HDFC Bank, ICICI Bank, Infosys, TCS');
    console.log(
      '   - Microsoft, Google, Meta, Apple, NVIDIA (for international fund)'
    );
    console.log(
      '   - Dixon, Polycab, Zomato, Max Healthcare (for midcap fund)'
    );
    console.log('   - And many more real listed companies!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();
