const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/mutual_funds_db';

async function addMoreCommodityFunds() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Add 7 more commodity funds to reach 50+
    const additionalFunds = [
      {
        fundId: 'UTI_GOLD_ETF_NEW',
        name: 'UTI Gold Exchange Traded Fund',
        category: 'commodity',
        subCategory: 'Gold',
        fundType: 'etf',
        fundHouse: 'UTI Mutual Fund',
        launchDate: new Date('2018-03-15'),
        aum: 680,
        expenseRatio: 0.58,
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'Swati Kulkarni',
        currentNav: 59.85,
        previousNav: 59.42,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.72,
          week: 1.95,
          month: 3.45,
          threeMonth: 6.15,
          sixMonth: 9.25,
          oneYear: 13.15,
          threeYear: 16.25,
          fiveYear: 11.85,
          sinceInception: 10.45,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'INVESCO_GOLD_ETF',
        name: 'Invesco India Gold ETF',
        category: 'commodity',
        subCategory: 'Gold',
        fundType: 'etf',
        fundHouse: 'Invesco Mutual Fund',
        launchDate: new Date('2019-08-10'),
        aum: 450,
        expenseRatio: 0.62,
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'Rahul Singh',
        currentNav: 54.25,
        previousNav: 53.98,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.5,
          week: 1.75,
          month: 3.05,
          threeMonth: 5.85,
          sixMonth: 8.75,
          oneYear: 12.05,
          threeYear: 15.25,
          fiveYear: 10.85,
          sinceInception: 9.95,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'QUANTUM_GOLD_FUND',
        name: 'Quantum Gold Fund Direct Plan Growth',
        category: 'commodity',
        subCategory: 'Gold',
        fundType: 'mutual_fund',
        fundHouse: 'Quantum Mutual Fund',
        launchDate: new Date('2016-12-05'),
        aum: 320,
        expenseRatio: 0.75,
        exitLoad: 0.25,
        minInvestment: 5000,
        sipMinAmount: 1000,
        fundManager: 'Chirag Mehta',
        currentNav: 28.95,
        previousNav: 28.75,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.69,
          week: 1.85,
          month: 3.25,
          threeMonth: 5.95,
          sixMonth: 8.95,
          oneYear: 12.85,
          threeYear: 15.85,
          fiveYear: 11.45,
          sinceInception: 10.25,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'MOTILAL_SILVER_ETF',
        name: 'Motilal Oswal Silver ETF',
        category: 'commodity',
        subCategory: 'Silver',
        fundType: 'etf',
        fundHouse: 'Motilal Oswal Mutual Fund',
        launchDate: new Date('2020-02-18'),
        aum: 285,
        expenseRatio: 0.68,
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'Rakesh Singh',
        currentNav: 68.45,
        previousNav: 68.12,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.48,
          week: 2.25,
          month: 4.95,
          threeMonth: 8.15,
          sixMonth: 13.25,
          oneYear: 8.95,
          threeYear: 12.85,
          fiveYear: 10.25,
          sinceInception: 11.85,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'EDELWEISS_COMMODITY_FUND',
        name: 'Edelweiss Multi-Commodity Fund',
        category: 'commodity',
        subCategory: 'Multi-Commodity',
        fundType: 'mutual_fund',
        fundHouse: 'Edelweiss Mutual Fund',
        launchDate: new Date('2021-06-30'),
        aum: 180,
        expenseRatio: 1.25,
        exitLoad: 0.5,
        minInvestment: 5000,
        sipMinAmount: 1000,
        fundManager: 'Bhavesh Jain',
        currentNav: 15.85,
        previousNav: 15.72,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.83,
          week: 2.45,
          month: 5.25,
          threeMonth: 8.95,
          sixMonth: 12.85,
          oneYear: 9.25,
          threeYear: 11.45,
          fiveYear: 0,
          sinceInception: 10.85,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'TATA_COMMODITY_ETF',
        name: 'Tata Multi-Commodity ETF',
        category: 'commodity',
        subCategory: 'Multi-Commodity',
        fundType: 'etf',
        fundHouse: 'Tata Mutual Fund',
        launchDate: new Date('2022-01-15'),
        aum: 125,
        expenseRatio: 0.95,
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'Murthy Nagarajan',
        currentNav: 12.45,
        previousNav: 12.35,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.81,
          week: 2.15,
          month: 4.85,
          threeMonth: 7.95,
          sixMonth: 11.25,
          oneYear: 8.45,
          threeYear: 10.25,
          fiveYear: 0,
          sinceInception: 9.85,
        },
        isActive: true,
        createdAt: new Date(),
      },
      {
        fundId: 'MAHINDRA_GOLD_ETF',
        name: 'Mahindra Manulife Gold ETF',
        category: 'commodity',
        subCategory: 'Gold',
        fundType: 'etf',
        fundHouse: 'Mahindra Manulife Mutual Fund',
        launchDate: new Date('2020-09-25'),
        aum: 225,
        expenseRatio: 0.65,
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'Ashutosh Bisht',
        currentNav: 51.25,
        previousNav: 50.95,
        navDate: new Date('2025-11-19'),
        returns: {
          day: 0.59,
          week: 1.85,
          month: 3.15,
          threeMonth: 5.75,
          sixMonth: 8.85,
          oneYear: 11.95,
          threeYear: 14.85,
          fiveYear: 10.45,
          sinceInception: 9.85,
        },
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // Insert additional funds
    const result = await fundsCollection.insertMany(additionalFunds);
    console.log(
      `✅ Inserted ${result.insertedCount} additional commodity funds`
    );

    // Count final numbers
    const equityCount = await fundsCollection.countDocuments({
      category: 'equity',
    });
    const commodityCount = await fundsCollection.countDocuments({
      category: 'commodity',
    });
    const totalCount = await fundsCollection.countDocuments();

    console.log(`📊 Final count - Equity funds: ${equityCount}`);
    console.log(`📊 Final count - Commodity funds: ${commodityCount}`);
    console.log(`📊 Total funds: ${totalCount}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

addMoreCommodityFunds().catch(console.error);
