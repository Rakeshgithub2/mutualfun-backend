// Seed funds data to MongoDB with fund manager references
const { MongoClient } = require('mongodb');

const uri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual_funds_db';

const sampleFunds = [
  // HDFC Funds (Manager: Rajiv Sharma - mgr001)
  {
    fundId: 'hdfc001',
    name: 'HDFC Top 100 Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'HDFC Asset Management',
    launchDate: new Date('2010-01-15'),
    aum: 85000,
    expenseRatio: 1.05,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr001',
    fundManager: 'Rajiv Sharma',
    returns: {
      day: 0.15,
      week: 0.8,
      month: 2.1,
      threeMonth: 5.2,
      sixMonth: 10.5,
      oneYear: 15.2,
      threeYear: 18.5,
      fiveYear: 22.3,
      sinceInception: 14.8,
    },
    riskMetrics: {
      sharpeRatio: 1.45,
      standardDeviation: 12.5,
      beta: 0.98,
      alpha: 2.8,
      rSquared: 0.92,
      sortino: 1.68,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 458.75,
    previousNav: 457.12,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 5,
      valueResearch: 5,
    },
    tags: ['large-cap', 'equity', 'hdfc', 'blue-chip'],
    searchTerms: ['hdfc top 100', 'hdfc', 'large cap', 'top 100'],
    popularity: 950,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'hdfc002',
    name: 'HDFC Balanced Advantage Fund',
    category: 'hybrid',
    subCategory: 'Dynamic Asset Allocation',
    fundType: 'mutual_fund',
    fundHouse: 'HDFC Asset Management',
    launchDate: new Date('2013-06-01'),
    aum: 45000,
    expenseRatio: 0.95,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr001',
    fundManager: 'Rajiv Sharma',
    returns: {
      day: 0.12,
      week: 0.6,
      month: 1.8,
      threeMonth: 4.5,
      sixMonth: 8.2,
      oneYear: 12.8,
      threeYear: 16.2,
      fiveYear: 19.5,
      sinceInception: 13.2,
    },
    riskMetrics: {
      sharpeRatio: 1.32,
      standardDeviation: 9.8,
      beta: 0.75,
      alpha: 2.3,
      rSquared: 0.88,
      sortino: 1.52,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 312.45,
    previousNav: 311.28,
    navDate: new Date(),
    ratings: {
      morningstar: 4,
      crisil: 5,
      valueResearch: 4,
    },
    tags: ['hybrid', 'balanced', 'hdfc', 'dynamic'],
    searchTerms: ['hdfc balanced', 'hdfc', 'hybrid', 'balanced advantage'],
    popularity: 820,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  // SBI Funds (Manager: Priya Desai - mgr002)
  {
    fundId: 'sbi001',
    name: 'SBI Blue Chip Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'SBI Mutual Fund',
    launchDate: new Date('2006-02-14'),
    aum: 62000,
    expenseRatio: 0.85,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr002',
    fundManager: 'Priya Desai',
    returns: {
      day: 0.18,
      week: 0.9,
      month: 2.4,
      threeMonth: 6.1,
      sixMonth: 11.8,
      oneYear: 17.8,
      threeYear: 19.2,
      fiveYear: 24.1,
      sinceInception: 16.5,
    },
    riskMetrics: {
      sharpeRatio: 1.58,
      standardDeviation: 13.2,
      beta: 1.02,
      alpha: 3.2,
      rSquared: 0.94,
      sortino: 1.82,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 576.32,
    previousNav: 574.89,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 5,
      valueResearch: 5,
    },
    tags: ['large-cap', 'equity', 'sbi', 'blue-chip'],
    searchTerms: ['sbi blue chip', 'sbi', 'large cap', 'blue chip'],
    popularity: 920,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'sbi003',
    name: 'SBI Small Cap Fund',
    category: 'equity',
    subCategory: 'Small Cap',
    fundType: 'mutual_fund',
    fundHouse: 'SBI Mutual Fund',
    launchDate: new Date('2009-09-15'),
    aum: 28000,
    expenseRatio: 1.25,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr002',
    fundManager: 'Priya Desai',
    returns: {
      day: 0.25,
      week: 1.2,
      month: 3.5,
      threeMonth: 8.8,
      sixMonth: 15.2,
      oneYear: 22.5,
      threeYear: 28.2,
      fiveYear: 32.8,
      sinceInception: 19.8,
    },
    riskMetrics: {
      sharpeRatio: 1.42,
      standardDeviation: 18.5,
      beta: 1.15,
      alpha: 4.5,
      rSquared: 0.86,
      sortino: 1.65,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 124.87,
    previousNav: 123.56,
    navDate: new Date(),
    ratings: {
      morningstar: 4,
      crisil: 4,
      valueResearch: 5,
    },
    tags: ['small-cap', 'equity', 'sbi', 'growth'],
    searchTerms: ['sbi small cap', 'sbi', 'small cap'],
    popularity: 750,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  // ICICI Funds (Manager: Amit Verma - mgr003)
  {
    fundId: 'icici001',
    name: 'ICICI Prudential Bond Fund',
    category: 'debt',
    subCategory: 'Corporate Bond',
    fundType: 'mutual_fund',
    fundHouse: 'ICICI Prudential',
    launchDate: new Date('2008-08-01'),
    aum: 48000,
    expenseRatio: 0.75,
    exitLoad: 0.5,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr003',
    fundManager: 'Amit Verma',
    returns: {
      day: 0.02,
      week: 0.15,
      month: 0.65,
      threeMonth: 1.95,
      sixMonth: 3.8,
      oneYear: 7.5,
      threeYear: 8.2,
      fiveYear: 9.1,
      sinceInception: 8.5,
    },
    riskMetrics: {
      sharpeRatio: 1.85,
      standardDeviation: 2.5,
      beta: 0.28,
      alpha: 1.5,
      rSquared: 0.75,
      sortino: 2.15,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 85.42,
    previousNav: 85.38,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 5,
      valueResearch: 4,
    },
    tags: ['debt', 'bond', 'icici', 'corporate-bond'],
    searchTerms: ['icici bond', 'icici prudential', 'bond fund', 'debt'],
    popularity: 680,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'icici002',
    name: 'ICICI Prudential Liquid Fund',
    category: 'debt',
    subCategory: 'Liquid',
    fundType: 'mutual_fund',
    fundHouse: 'ICICI Prudential',
    launchDate: new Date('2005-11-04'),
    aum: 95000,
    expenseRatio: 0.25,
    exitLoad: 0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr003',
    fundManager: 'Amit Verma',
    returns: {
      day: 0.018,
      week: 0.125,
      month: 0.55,
      threeMonth: 1.68,
      sixMonth: 3.4,
      oneYear: 6.8,
      threeYear: 7.1,
      fiveYear: 7.5,
      sinceInception: 7.2,
    },
    riskMetrics: {
      sharpeRatio: 2.15,
      standardDeviation: 0.8,
      beta: 0.12,
      alpha: 0.8,
      rSquared: 0.65,
      sortino: 2.85,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 312.58,
    previousNav: 312.52,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 5,
      valueResearch: 5,
    },
    tags: ['debt', 'liquid', 'icici', 'money-market'],
    searchTerms: ['icici liquid', 'icici prudential', 'liquid fund'],
    popularity: 890,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  // Nippon India Funds (for testing "nip" search)
  {
    fundId: 'nippon001',
    name: 'Nippon India Small Cap Fund',
    category: 'equity',
    subCategory: 'Small Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Nippon India Mutual Fund',
    launchDate: new Date('2010-09-01'),
    aum: 38500,
    expenseRatio: 1.35,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr002',
    fundManager: 'Priya Desai',
    returns: {
      day: 0.28,
      week: 1.35,
      month: 3.8,
      threeMonth: 9.5,
      sixMonth: 16.8,
      oneYear: 24.5,
      threeYear: 30.2,
      fiveYear: 35.8,
      sinceInception: 21.5,
    },
    riskMetrics: {
      sharpeRatio: 1.48,
      standardDeviation: 19.8,
      beta: 1.18,
      alpha: 5.2,
      rSquared: 0.84,
      sortino: 1.72,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 98.65,
    previousNav: 97.82,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 5,
      valueResearch: 5,
    },
    tags: ['small-cap', 'equity', 'nippon', 'growth'],
    searchTerms: ['nippon small cap', 'nippon india', 'nippon', 'small cap'],
    popularity: 820,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'nippon002',
    name: 'Nippon India Large Cap Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Nippon India Mutual Fund',
    launchDate: new Date('2007-08-01'),
    aum: 52000,
    expenseRatio: 0.95,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManagerId: 'mgr001',
    fundManager: 'Rajiv Sharma',
    returns: {
      day: 0.16,
      week: 0.85,
      month: 2.2,
      threeMonth: 5.8,
      sixMonth: 11.2,
      oneYear: 16.8,
      threeYear: 18.9,
      fiveYear: 23.5,
      sinceInception: 15.8,
    },
    riskMetrics: {
      sharpeRatio: 1.52,
      standardDeviation: 12.8,
      beta: 1.0,
      alpha: 3.0,
      rSquared: 0.93,
      sortino: 1.75,
    },
    holdings: [],
    sectorAllocation: [],
    currentNav: 432.18,
    previousNav: 430.95,
    navDate: new Date(),
    ratings: {
      morningstar: 5,
      crisil: 4,
      valueResearch: 5,
    },
    tags: ['large-cap', 'equity', 'nippon', 'blue-chip'],
    searchTerms: ['nippon large cap', 'nippon india', 'nippon', 'large cap'],
    popularity: 780,
    isActive: true,
    dataSource: 'manual',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

async function seedFunds() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db('mutual_funds_db');
    const fundsCollection = database.collection('funds');

    // Delete existing sample funds
    const deleteResult = await fundsCollection.deleteMany({
      fundId: { $in: sampleFunds.map((f) => f.fundId) },
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing funds`);

    // Insert new funds
    const result = await fundsCollection.insertMany(sampleFunds);
    console.log(`✅ Inserted ${result.insertedCount} funds`);

    // Display inserted funds
    console.log('\n📋 Funds by Fund Manager:\n');

    const managers = {
      mgr001: 'Rajiv Sharma (HDFC)',
      mgr002: 'Priya Desai (SBI)',
      mgr003: 'Amit Verma (ICICI)',
    };

    Object.entries(managers).forEach(([id, name]) => {
      console.log(`\n👤 ${name}:`);
      sampleFunds
        .filter((f) => f.fundManagerId === id)
        .forEach((fund) => {
          console.log(`   ├─ ${fund.name}`);
          console.log(
            `   │  AUM: ₹${(fund.aum / 10000).toFixed(1)}K Cr | 1Y: +${fund.returns.oneYear}% | NAV: ₹${fund.currentNav}`
          );
        });
    });

    console.log('\n✅ Funds seeded successfully!');
    console.log('\n💡 Test searches:');
    console.log('   - "nippon" → Shows 2 Nippon India funds');
    console.log('   - "hdfc" → Shows 2 HDFC funds (managed by Rajiv Sharma)');
    console.log(
      '   - "sbi blue chip" → Shows SBI Blue Chip fund (managed by Priya Desai)'
    );
    console.log(
      '   - "icici liquid" → Shows ICICI Liquid fund (managed by Amit Verma)'
    );
  } catch (error) {
    console.error('❌ Error seeding funds:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seedFunds();
