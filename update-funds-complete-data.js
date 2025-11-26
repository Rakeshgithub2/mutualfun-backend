const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/mutual_funds_db';

async function updateFundsWithCompleteData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const fundsCollection = db.collection('funds');

    // Update each fund with complete data
    const fundsData = [
      {
        name: 'HDFC Top 100 Fund Direct Plan Growth',
        currentNav: 734.52,
        previousNav: 732.18,
        navDate: new Date(),
        aum: 45820,
        minInvestment: 5000,
        sipMinAmount: 500,
        exitLoad: 1.0,
        fundHouse: 'HDFC Mutual Fund',
        fundType: 'mutual_fund',
        subCategory: 'Large Cap',
        fundManager: 'Chirag Setalvad',
        launchDate: new Date('2010-01-15'),
        returns: {
          day: 0.32,
          week: 1.45,
          month: 3.21,
          threeMonth: 8.54,
          sixMonth: 12.34,
          oneYear: 24.56,
          threeYear: 18.92,
          fiveYear: 16.45,
          sinceInception: 14.89,
        },
        riskMetrics: {
          sharpeRatio: 1.85,
          standardDeviation: 12.34,
          beta: 0.95,
          alpha: 2.45,
          rSquared: 0.92,
          sortino: 2.15,
        },
        ratings: {
          morningstar: 5,
          valueResearch: 5,
          crisil: 5,
        },
        popularity: 950,
        tags: ['large-cap', 'equity', 'growth', 'blue-chip'],
      },
      {
        name: 'ICICI Prudential Bluechip Fund Direct Growth',
        currentNav: 98.45,
        previousNav: 97.82,
        navDate: new Date(),
        aum: 62340,
        minInvestment: 5000,
        sipMinAmount: 100,
        exitLoad: 1.0,
        fundHouse: 'ICICI Prudential Mutual Fund',
        fundType: 'mutual_fund',
        subCategory: 'Large Cap',
        fundManager: 'Sankaran Naren & Mrinal Singh',
        launchDate: new Date('2008-08-04'),
        returns: {
          day: 0.64,
          week: 1.85,
          month: 4.12,
          threeMonth: 9.84,
          sixMonth: 14.23,
          oneYear: 26.78,
          threeYear: 20.34,
          fiveYear: 18.23,
          sinceInception: 16.92,
        },
        riskMetrics: {
          sharpeRatio: 1.92,
          standardDeviation: 11.89,
          beta: 0.98,
          alpha: 2.87,
          rSquared: 0.94,
          sortino: 2.34,
        },
        ratings: {
          morningstar: 5,
          valueResearch: 5,
          crisil: 5,
        },
        popularity: 980,
        tags: ['large-cap', 'equity', 'bluechip', 'growth'],
      },
      {
        name: 'Axis Bluechip Fund Direct Growth',
        currentNav: 67.23,
        previousNav: 66.89,
        navDate: new Date(),
        aum: 48920,
        minInvestment: 5000,
        sipMinAmount: 500,
        exitLoad: 1.0,
        fundHouse: 'Axis Mutual Fund',
        fundType: 'mutual_fund',
        subCategory: 'Large Cap',
        fundManager: 'Shreyash Devalkar',
        launchDate: new Date('2013-01-01'),
        returns: {
          day: 0.51,
          week: 1.67,
          month: 3.89,
          threeMonth: 8.92,
          sixMonth: 13.45,
          oneYear: 25.34,
          threeYear: 19.67,
          fiveYear: 17.23,
          sinceInception: 15.78,
        },
        riskMetrics: {
          sharpeRatio: 1.78,
          standardDeviation: 12.12,
          beta: 0.97,
          alpha: 2.34,
          rSquared: 0.93,
          sortino: 2.08,
        },
        ratings: {
          morningstar: 5,
          valueResearch: 5,
          crisil: 5,
        },
        popularity: 920,
        tags: ['large-cap', 'equity', 'bluechip', 'growth'],
      },
      {
        name: 'Parag Parikh Flexi Cap Fund Direct Growth',
        currentNav: 78.92,
        previousNav: 78.34,
        navDate: new Date(),
        aum: 73450,
        minInvestment: 1000,
        sipMinAmount: 1000,
        exitLoad: 2.0,
        fundHouse: 'PPFAS Mutual Fund',
        fundType: 'mutual_fund',
        subCategory: 'Flexi Cap',
        fundManager: 'Rajeev Thakkar & Raj Mehta',
        launchDate: new Date('2013-05-28'),
        returns: {
          day: 0.74,
          week: 2.12,
          month: 4.67,
          threeMonth: 10.23,
          sixMonth: 15.89,
          oneYear: 29.45,
          threeYear: 22.78,
          fiveYear: 19.92,
          sinceInception: 18.45,
        },
        riskMetrics: {
          sharpeRatio: 2.12,
          standardDeviation: 13.45,
          beta: 1.02,
          alpha: 3.45,
          rSquared: 0.89,
          sortino: 2.67,
        },
        ratings: {
          morningstar: 5,
          valueResearch: 5,
          crisil: 5,
        },
        popularity: 995,
        tags: ['flexi-cap', 'equity', 'international', 'growth'],
      },
      {
        name: 'Motilal Oswal Midcap Fund Direct Growth',
        currentNav: 92.67,
        previousNav: 91.95,
        navDate: new Date(),
        aum: 38760,
        minInvestment: 5000,
        sipMinAmount: 500,
        exitLoad: 1.0,
        fundHouse: 'Motilal Oswal Mutual Fund',
        fundType: 'mutual_fund',
        subCategory: 'Mid Cap',
        fundManager: 'Niket Shah & Ajay Khandelwal',
        launchDate: new Date('2014-03-17'),
        returns: {
          day: 0.78,
          week: 2.34,
          month: 5.12,
          threeMonth: 11.45,
          sixMonth: 16.78,
          oneYear: 31.23,
          threeYear: 24.56,
          fiveYear: 21.34,
          sinceInception: 19.87,
        },
        riskMetrics: {
          sharpeRatio: 1.95,
          standardDeviation: 15.23,
          beta: 1.15,
          alpha: 4.12,
          rSquared: 0.87,
          sortino: 2.45,
        },
        ratings: {
          morningstar: 5,
          valueResearch: 4,
          crisil: 5,
        },
        popularity: 880,
        tags: ['mid-cap', 'equity', 'growth', 'high-risk'],
      },
    ];

    console.log('📝 Updating funds with complete data...');
    let updated = 0;

    for (const fundData of fundsData) {
      const result = await fundsCollection.updateOne(
        { name: fundData.name },
        {
          $set: {
            currentNav: fundData.currentNav,
            previousNav: fundData.previousNav,
            navDate: fundData.navDate,
            aum: fundData.aum,
            minInvestment: fundData.minInvestment,
            sipMinAmount: fundData.sipMinAmount,
            exitLoad: fundData.exitLoad,
            fundHouse: fundData.fundHouse,
            fundType: fundData.fundType,
            subCategory: fundData.subCategory,
            fundManager: fundData.fundManager,
            launchDate: fundData.launchDate,
            returns: fundData.returns,
            riskMetrics: fundData.riskMetrics,
            ratings: fundData.ratings,
            popularity: fundData.popularity,
            tags: fundData.tags,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount > 0) {
        updated++;
        console.log(`   ✅ Updated: ${fundData.name}`);
      }
    }

    console.log(`\n✅ Updated ${updated} funds with complete data`);

    // Verify
    console.log('\n🔍 Verification:');
    const sampleFund = await fundsCollection.findOne({
      name: 'HDFC Top 100 Fund Direct Plan Growth',
    });
    console.log('Sample Fund Data:');
    console.log(`- Name: ${sampleFund.name}`);
    console.log(`- Current NAV: ₹${sampleFund.currentNav}`);
    console.log(`- AUM: ₹${sampleFund.aum} Cr`);
    console.log(`- 1Y Return: ${sampleFund.returns.oneYear}%`);
    console.log(`- Risk (Sharpe): ${sampleFund.riskMetrics.sharpeRatio}`);
    console.log(`- Rating: ${sampleFund.ratings.morningstar}⭐`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Update complete - disconnected from MongoDB');
  }
}

updateFundsWithCompleteData();
