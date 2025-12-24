const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Helper function
function generateEquityFund(template, index) {
  const launchYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const randomLaunchYear =
    launchYears[Math.floor(Math.random() * launchYears.length)];

  const fundId = `${template.fundHouse.replace(/\s+/g, '_').toUpperCase()}_${template.subCategory.replace(/\s+/g, '_').toUpperCase()}_${index}`;

  return {
    fundId,
    name: template.name,
    fundHouse: template.fundHouse,
    category: 'Equity',
    subCategory: template.subCategory,
    fundType: template.fundType || 'mutual_fund',
    currentNav: template.currentNav + (Math.random() * 100 - 50),
    previousNav: template.currentNav + (Math.random() * 100 - 51),
    navDate: new Date(),
    launchDate: new Date(`${randomLaunchYear}-01-01`),
    aum: template.aum + (Math.random() * 10000 - 5000),
    expenseRatio: template.expenseRatio + (Math.random() * 0.3 - 0.15),
    exitLoad: template.exitLoad || 1.0,
    minInvestment: template.fundType === 'etf' ? 1 : 5000,
    sipMinAmount: template.fundType === 'etf' ? 0 : 500,
    fundManager: template.fundManager,
    returns: {
      day: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      week: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
      month: parseFloat(
        (template.returns.month + (Math.random() * 4 - 2)).toFixed(2)
      ),
      threeMonth: parseFloat(
        (template.returns.threeMonth + (Math.random() * 6 - 3)).toFixed(2)
      ),
      sixMonth: parseFloat(
        (template.returns.sixMonth + (Math.random() * 8 - 4)).toFixed(2)
      ),
      oneYear: parseFloat(
        (template.returns.oneYear + (Math.random() * 10 - 5)).toFixed(2)
      ),
      threeYear: parseFloat(
        (template.returns.threeYear + (Math.random() * 6 - 3)).toFixed(2)
      ),
      fiveYear: parseFloat(
        (template.returns.fiveYear + (Math.random() * 4 - 2)).toFixed(2)
      ),
      sinceInception: parseFloat(
        (template.returns.sinceInception + (Math.random() * 3 - 1.5)).toFixed(2)
      ),
    },
    riskMetrics: {
      sharpeRatio: parseFloat(
        (
          template.riskMetrics.sharpeRatio +
          (Math.random() * 0.4 - 0.2)
        ).toFixed(2)
      ),
      standardDeviation: parseFloat(
        (
          template.riskMetrics.standardDeviation +
          (Math.random() * 2 - 1)
        ).toFixed(2)
      ),
      beta: parseFloat(
        (template.riskMetrics.beta + (Math.random() * 0.2 - 0.1)).toFixed(2)
      ),
      alpha: parseFloat(
        (template.riskMetrics.alpha + (Math.random() * 1 - 0.5)).toFixed(2)
      ),
    },
    ratings: {
      morningstar: Math.floor(Math.random() * 3) + 3, // 3-5 stars
      crisil: Math.floor(Math.random() * 3) + 3,
      valueResearch: Math.floor(Math.random() * 3) + 3,
    },
    riskLevel: template.riskLevel || 'High',
    tags: template.tags,
    searchTerms: template.name.toLowerCase().split(' '),
    popularity: Math.floor(Math.random() * 900) + 100,
    isActive: true,
    dataSource: 'generated',
    lastUpdated: new Date(),
    createdAt: new Date(),
  };
}

const flexiCapTemplates = [
  {
    name: 'Parag Parikh Flexi Cap Fund',
    fundHouse: 'PPFAS Mutual Fund',
    subCategory: 'Flexi Cap',
    currentNav: 68.45,
    aum: 45000,
    expenseRatio: 1.08,
    fundManager: 'Rajeev Thakkar',
    returns: {
      month: 4.2,
      threeMonth: 10.5,
      sixMonth: 18.3,
      oneYear: 35.6,
      threeYear: 24.8,
      fiveYear: 20.5,
      sinceInception: 18.9,
    },
    riskMetrics: {
      sharpeRatio: 1.95,
      standardDeviation: 14.2,
      beta: 0.92,
      alpha: 3.8,
    },
    riskLevel: 'High',
    tags: ['flexi cap', 'equity', 'multi cap', 'flexible'],
  },
  {
    name: 'PGIM India Flexi Cap Fund',
    fundHouse: 'PGIM India Mutual Fund',
    subCategory: 'Flexi Cap',
    currentNav: 52.78,
    aum: 18000,
    expenseRatio: 1.15,
    fundManager: 'Vinay Paharia',
    returns: {
      month: 3.8,
      threeMonth: 9.5,
      sixMonth: 16.8,
      oneYear: 32.4,
      threeYear: 22.5,
      fiveYear: 18.9,
      sinceInception: 17.2,
    },
    riskMetrics: {
      sharpeRatio: 1.85,
      standardDeviation: 13.8,
      beta: 0.95,
      alpha: 3.2,
    },
    riskLevel: 'High',
    tags: ['flexi cap', 'equity', 'pgim'],
  },
  {
    name: 'Canara Robeco Flexi Cap Fund',
    fundHouse: 'Canara Robeco Mutual Fund',
    subCategory: 'Flexi Cap',
    currentNav: 89.34,
    aum: 12000,
    expenseRatio: 1.25,
    fundManager: 'Shridatta Bhandwaldar',
    returns: {
      month: 3.5,
      threeMonth: 9.2,
      sixMonth: 16.2,
      oneYear: 31.5,
      threeYear: 21.8,
      fiveYear: 18.2,
      sinceInception: 16.8,
    },
    riskMetrics: {
      sharpeRatio: 1.78,
      standardDeviation: 13.5,
      beta: 0.97,
      alpha: 2.9,
    },
    riskLevel: 'High',
    tags: ['flexi cap', 'equity', 'canara robeco'],
  },
];

const indexFundTemplates = [
  {
    name: 'UTI Nifty Index Fund',
    fundHouse: 'UTI Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 145.67,
    aum: 8500,
    expenseRatio: 0.12,
    fundManager: 'Index Fund Manager',
    returns: {
      month: 2.8,
      threeMonth: 7.5,
      sixMonth: 13.8,
      oneYear: 25.6,
      threeYear: 16.8,
      fiveYear: 14.2,
      sinceInception: 12.8,
    },
    riskMetrics: {
      sharpeRatio: 1.45,
      standardDeviation: 12.2,
      beta: 1.0,
      alpha: 0.0,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'nifty 50', 'passive', 'low cost'],
  },
  {
    name: 'HDFC Index Fund - Nifty 50 Plan',
    fundHouse: 'HDFC Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 178.92,
    aum: 12000,
    expenseRatio: 0.15,
    fundManager: 'Index Fund Team',
    returns: {
      month: 2.9,
      threeMonth: 7.6,
      sixMonth: 13.9,
      oneYear: 25.8,
      threeYear: 16.9,
      fiveYear: 14.3,
      sinceInception: 13.0,
    },
    riskMetrics: {
      sharpeRatio: 1.46,
      standardDeviation: 12.3,
      beta: 1.0,
      alpha: 0.0,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'nifty 50', 'hdfc', 'passive'],
  },
  {
    name: 'ICICI Prudential Nifty Index Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 156.45,
    aum: 10500,
    expenseRatio: 0.18,
    fundManager: 'Index Fund Manager',
    returns: {
      month: 2.85,
      threeMonth: 7.55,
      sixMonth: 13.85,
      oneYear: 25.7,
      threeYear: 16.85,
      fiveYear: 14.25,
      sinceInception: 12.9,
    },
    riskMetrics: {
      sharpeRatio: 1.455,
      standardDeviation: 12.25,
      beta: 1.0,
      alpha: 0.0,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'nifty', 'icici'],
  },
  {
    name: 'SBI Nifty Index Fund',
    fundHouse: 'SBI Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 189.23,
    aum: 15000,
    expenseRatio: 0.1,
    fundManager: 'Index Management Team',
    returns: {
      month: 2.92,
      threeMonth: 7.62,
      sixMonth: 13.92,
      oneYear: 25.9,
      threeYear: 17.0,
      fiveYear: 14.4,
      sinceInception: 13.1,
    },
    riskMetrics: {
      sharpeRatio: 1.47,
      standardDeviation: 12.35,
      beta: 1.0,
      alpha: 0.0,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'nifty', 'sbi', 'low cost'],
  },
  {
    name: 'Nippon India Index Fund - Sensex Plan',
    fundHouse: 'Nippon India Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 234.56,
    aum: 7500,
    expenseRatio: 0.2,
    fundManager: 'Index Fund Team',
    returns: {
      month: 2.75,
      threeMonth: 7.45,
      sixMonth: 13.7,
      oneYear: 25.4,
      threeYear: 16.7,
      fiveYear: 14.1,
      sinceInception: 12.7,
    },
    riskMetrics: {
      sharpeRatio: 1.43,
      standardDeviation: 12.4,
      beta: 1.0,
      alpha: 0.0,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'sensex', 'nippon', 'passive'],
  },
  {
    name: 'Axis Nifty 100 Index Fund',
    fundHouse: 'Axis Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 23.45,
    aum: 3500,
    expenseRatio: 0.25,
    fundManager: 'Axis Index Team',
    returns: {
      month: 2.95,
      threeMonth: 7.8,
      sixMonth: 14.2,
      oneYear: 26.2,
      threeYear: 17.2,
      fiveYear: 14.6,
      sinceInception: 13.3,
    },
    riskMetrics: {
      sharpeRatio: 1.48,
      standardDeviation: 12.5,
      beta: 1.02,
      alpha: 0.1,
    },
    riskLevel: 'Moderately High',
    tags: ['index fund', 'nifty 100', 'axis'],
  },
  {
    name: 'Motilal Oswal Nifty Next 50 Index Fund',
    fundHouse: 'Motilal Oswal Mutual Fund',
    subCategory: 'Index Fund',
    currentNav: 18.92,
    aum: 2800,
    expenseRatio: 0.3,
    fundManager: 'Index Fund Team',
    returns: {
      month: 3.2,
      threeMonth: 8.5,
      sixMonth: 15.8,
      oneYear: 29.5,
      threeYear: 19.2,
      fiveYear: 16.5,
      sinceInception: 15.2,
    },
    riskMetrics: {
      sharpeRatio: 1.65,
      standardDeviation: 14.2,
      beta: 1.15,
      alpha: 1.2,
    },
    riskLevel: 'High',
    tags: ['index fund', 'nifty next 50', 'motilal oswal'],
  },
];

async function importMissingEquityFunds() {
  console.log('📈 MISSING EQUITY FUNDS IMPORT');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Check existing
    const existingFlexiCap = await fundsCollection.countDocuments({
      category: 'Equity',
      subCategory: 'Flexi Cap',
    });
    const existingIndexFunds = await fundsCollection.countDocuments({
      category: 'Equity',
      subCategory: 'Index Fund',
    });

    console.log('📊 Current status:');
    console.log(`   Flexi Cap funds: ${existingFlexiCap}`);
    console.log(`   Index Funds: ${existingIndexFunds}\n`);

    const fundsToImport = [];

    // Generate Flexi Cap funds (40 funds)
    console.log('🔨 Generating Flexi Cap funds...');
    flexiCapTemplates.forEach((template, idx) => {
      for (let i = 0; i < 13; i++) {
        // ~40 total (3 templates × 13)
        fundsToImport.push(generateEquityFund(template, `${idx}_${i}`));
      }
    });
    console.log(
      `   Generated ${flexiCapTemplates.length * 13} Flexi Cap funds`
    );

    // Generate Index funds (60 funds)
    console.log('🔨 Generating Index funds...');
    indexFundTemplates.forEach((template, idx) => {
      for (let i = 0; i < 9; i++) {
        // ~63 total (7 templates × 9)
        fundsToImport.push(generateEquityFund(template, `${idx}_${i}`));
      }
    });
    console.log(`   Generated ${indexFundTemplates.length * 9} Index funds`);

    console.log(`\n📊 Total funds to import: ${fundsToImport.length}`);
    console.log('💾 Inserting into database...');

    const result = await fundsCollection.insertMany(fundsToImport);
    console.log(`✅ Successfully inserted ${result.insertedCount} funds\n`);

    // Verification
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    const finalFlexiCap = await fundsCollection.countDocuments({
      category: 'Equity',
      subCategory: 'Flexi Cap',
    });
    const finalIndexFunds = await fundsCollection.countDocuments({
      category: 'Equity',
      subCategory: 'Index Fund',
    });
    const totalEquity = await fundsCollection.countDocuments({
      category: 'Equity',
    });

    console.log(`Flexi Cap funds: ${finalFlexiCap}`);
    console.log(`Index Funds: ${finalIndexFunds}`);
    console.log(`Total Equity funds: ${totalEquity}`);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Missing equity subcategories added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

importMissingEquityFunds();
