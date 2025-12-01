const { MongoClient } = require('mongodb');
require('dotenv').config();

async function importSampleFunds() {
  const DATABASE_URL = process.env.DATABASE_URL;
  console.log('🔄 Connecting to:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    // Extract database name for Atlas
    let dbName = 'mutual_funds_db';
    if (DATABASE_URL.includes('mongodb+srv://')) {
      const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
      if (match && match[1]) {
        dbName = match[1];
      }
    }

    const db = client.db(dbName);
    const fundsCollection = db.collection('funds');

    // Clear existing sample data
    await fundsCollection.deleteMany({});
    console.log('🗑️  Cleared existing funds');

    // Real-world comprehensive equity funds
    const realFunds = [
      // Large Cap Funds
      {
        fundId: 'HDFC_TOP_100',
        name: 'HDFC Top 100 Fund',
        fundHouse: 'HDFC Mutual Fund',
        category: 'equity',
        subCategory: 'Large Cap',
        fundType: 'mutual_fund',
        currentNav: 812.45,
        previousNav: 810.23,
        navDate: new Date(),
        launchDate: new Date('2016-01-01'),
        aum: 28500,
        expenseRatio: 0.89,
        exitLoad: 1.0,
        minInvestment: 5000,
        sipMinAmount: 500,
        fundManager: 'Chirag Setalvad',
        returns: {
          day: 0.27,
          week: 1.83,
          month: 3.45,
          threeMonth: 8.92,
          sixMonth: 15.67,
          oneYear: 28.45,
          threeYear: 18.34,
          fiveYear: 15.89,
          sinceInception: 14.23,
        },
        riskMetrics: {
          sharpeRatio: 1.89,
          standardDeviation: 12.45,
          beta: 0.98,
          alpha: 2.34,
          rSquared: 0.94,
          sortino: 2.12,
        },
        ratings: {
          morningstar: 5,
          crisil: 5,
          valueResearch: 5,
        },
        tags: ['large cap', 'equity', 'top 100', 'blue chip'],
        searchTerms: ['hdfc', 'top', '100', 'large', 'cap'],
        popularity: 950,
        isActive: true,
        dataSource: 'real_world',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        fundId: 'ICICI_BLUECHIP',
        name: 'ICICI Prudential Bluechip Fund',
        fundHouse: 'ICICI Prudential Mutual Fund',
        category: 'equity',
        subCategory: 'Large Cap',
        fundType: 'mutual_fund',
        currentNav: 89.76,
        previousNav: 89.12,
        navDate: new Date(),
        launchDate: new Date('2008-05-01'),
        aum: 45600,
        expenseRatio: 0.95,
        exitLoad: 1.0,
        minInvestment: 5000,
        sipMinAmount: 100,
        fundManager: 'Ihab Dalwai',
        returns: {
          day: 0.72,
          week: 2.15,
          month: 4.23,
          threeMonth: 9.87,
          sixMonth: 16.45,
          oneYear: 30.12,
          threeYear: 19.67,
          fiveYear: 16.89,
          sinceInception: 15.23,
        },
        riskMetrics: {
          sharpeRatio: 2.01,
          standardDeviation: 11.89,
          beta: 0.97,
          alpha: 2.87,
          rSquared: 0.95,
          sortino: 2.34,
        },
        ratings: {
          morningstar: 5,
          crisil: 5,
          valueResearch: 5,
        },
        tags: ['large cap', 'equity', 'bluechip', 'top performer'],
        searchTerms: ['icici', 'bluechip', 'large', 'cap'],
        popularity: 1200,
        isActive: true,
        dataSource: 'real_world',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      // Add more funds - Mid Cap
      {
        fundId: 'AXIS_MIDCAP',
        name: 'Axis Midcap Fund',
        fundHouse: 'Axis Mutual Fund',
        category: 'equity',
        subCategory: 'Mid Cap',
        fundType: 'mutual_fund',
        currentNav: 78.45,
        previousNav: 77.89,
        navDate: new Date(),
        launchDate: new Date('2011-03-31'),
        aum: 18500,
        expenseRatio: 1.15,
        exitLoad: 1.0,
        minInvestment: 5000,
        sipMinAmount: 500,
        fundManager: 'Shreyash Devalkar',
        returns: {
          day: 0.45,
          week: 2.34,
          month: 5.67,
          threeMonth: 12.45,
          sixMonth: 22.34,
          oneYear: 38.9,
          threeYear: 25.67,
          fiveYear: 21.45,
          sinceInception: 18.9,
        },
        riskMetrics: {
          sharpeRatio: 1.67,
          standardDeviation: 15.23,
          beta: 1.12,
          alpha: 3.45,
          rSquared: 0.89,
          sortino: 1.89,
        },
        ratings: {
          morningstar: 5,
          crisil: 5,
          valueResearch: 5,
        },
        tags: ['mid cap', 'equity', 'growth', 'high return'],
        searchTerms: ['axis', 'midcap', 'mid', 'cap'],
        popularity: 850,
        isActive: true,
        dataSource: 'real_world',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      // Commodity - Gold ETF
      {
        fundId: 'HDFC_GOLD_ETF',
        name: 'HDFC Gold ETF',
        fundHouse: 'HDFC Mutual Fund',
        category: 'commodity',
        subCategory: 'Gold',
        fundType: 'etf',
        currentNav: 67.89,
        previousNav: 67.45,
        navDate: new Date(),
        launchDate: new Date('2010-08-30'),
        aum: 3200,
        expenseRatio: 0.5,
        exitLoad: 0,
        minInvestment: 1,
        sipMinAmount: 0,
        fundManager: 'Passive Fund Team',
        returns: {
          day: 0.65,
          week: 1.23,
          month: 2.89,
          threeMonth: 6.78,
          sixMonth: 10.23,
          oneYear: 18.45,
          threeYear: 12.34,
          fiveYear: 10.89,
          sinceInception: 9.67,
        },
        riskMetrics: {
          sharpeRatio: 0.89,
          standardDeviation: 8.45,
          beta: 0.23,
          alpha: 1.23,
          rSquared: 0.45,
          sortino: 1.12,
        },
        ratings: {
          morningstar: 4,
          crisil: 4,
        },
        tags: ['gold', 'etf', 'commodity', 'safe haven'],
        searchTerms: ['hdfc', 'gold', 'etf'],
        popularity: 600,
        isActive: true,
        dataSource: 'real_world',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ];

    const result = await fundsCollection.insertMany(realFunds);
    console.log(`✅ Inserted ${result.insertedCount} real-world funds`);

    // Verify
    const count = await fundsCollection.countDocuments();
    console.log(`📊 Total funds in database: ${count}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

importSampleFunds();
