const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Helper function
function generateEquityFund(template, index) {
  const launchYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const randomLaunchYear =
    launchYears[Math.floor(Math.random() * launchYears.length)];

  const fundId = `${template.fundHouse.replace(/\s+/g, '_').toUpperCase()}_${template.subCategory.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}_${index}`;

  return {
    fundId,
    name: `${template.name} ${index}`,
    fundHouse: template.fundHouse,
    category: 'Equity',
    subCategory: template.subCategory,
    fundType: template.fundType || 'mutual_fund',
    currentNav: template.currentNav + (Math.random() * 150 - 75),
    previousNav: template.currentNav + (Math.random() * 150 - 76),
    navDate: new Date(),
    launchDate: new Date(
      `${randomLaunchYear}-${Math.floor(Math.random() * 12) + 1}-01`
    ),
    aum: template.aum + (Math.random() * 15000 - 7500),
    expenseRatio: parseFloat(
      (template.expenseRatio + (Math.random() * 0.4 - 0.2)).toFixed(2)
    ),
    exitLoad: template.exitLoad || 1.0,
    minInvestment: template.fundType === 'etf' ? 1 : 5000,
    sipMinAmount: template.fundType === 'etf' ? 0 : 500,
    fundManager: template.fundManager,
    returns: {
      day: parseFloat((Math.random() * 3 - 1.5).toFixed(2)),
      week: parseFloat((Math.random() * 6 - 3).toFixed(2)),
      month: parseFloat(
        (template.returns.month + (Math.random() * 5 - 2.5)).toFixed(2)
      ),
      threeMonth: parseFloat(
        (template.returns.threeMonth + (Math.random() * 8 - 4)).toFixed(2)
      ),
      sixMonth: parseFloat(
        (template.returns.sixMonth + (Math.random() * 10 - 5)).toFixed(2)
      ),
      oneYear: parseFloat(
        (template.returns.oneYear + (Math.random() * 12 - 6)).toFixed(2)
      ),
      threeYear: parseFloat(
        (template.returns.threeYear + (Math.random() * 8 - 4)).toFixed(2)
      ),
      fiveYear: parseFloat(
        (template.returns.fiveYear + (Math.random() * 5 - 2.5)).toFixed(2)
      ),
      sinceInception: parseFloat(
        (template.returns.sinceInception + (Math.random() * 4 - 2)).toFixed(2)
      ),
    },
    riskMetrics: {
      sharpeRatio: parseFloat(
        (
          template.riskMetrics.sharpeRatio +
          (Math.random() * 0.5 - 0.25)
        ).toFixed(2)
      ),
      standardDeviation: parseFloat(
        (
          template.riskMetrics.standardDeviation +
          (Math.random() * 3 - 1.5)
        ).toFixed(2)
      ),
      beta: parseFloat(
        (template.riskMetrics.beta + (Math.random() * 0.25 - 0.125)).toFixed(2)
      ),
      alpha: parseFloat(
        (template.riskMetrics.alpha + (Math.random() * 1.5 - 0.75)).toFixed(2)
      ),
    },
    ratings: {
      morningstar: Math.floor(Math.random() * 3) + 3,
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

const largeCapTemplates = [
  {
    name: 'HDFC Top 100 Fund',
    fundHouse: 'HDFC Mutual Fund',
    subCategory: 'Large Cap',
    currentNav: 812.45,
    aum: 28500,
    expenseRatio: 1.05,
    fundManager: 'Chirag Setalvad',
    returns: {
      month: 3.2,
      threeMonth: 8.5,
      sixMonth: 15.2,
      oneYear: 28.4,
      threeYear: 18.5,
      fiveYear: 16.2,
      sinceInception: 14.8,
    },
    riskMetrics: {
      sharpeRatio: 1.85,
      standardDeviation: 12.5,
      beta: 0.95,
      alpha: 2.5,
    },
    riskLevel: 'Moderately High',
    tags: ['large cap', 'equity', 'hdfc', 'blue chip'],
  },
  {
    name: 'ICICI Prudential Bluechip Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    subCategory: 'Large Cap',
    currentNav: 98.67,
    aum: 42000,
    expenseRatio: 1.12,
    fundManager: 'Anish Tawakley',
    returns: {
      month: 3.0,
      threeMonth: 8.2,
      sixMonth: 14.8,
      oneYear: 27.8,
      threeYear: 18.2,
      fiveYear: 15.9,
      sinceInception: 14.5,
    },
    riskMetrics: {
      sharpeRatio: 1.82,
      standardDeviation: 12.3,
      beta: 0.97,
      alpha: 2.3,
    },
    riskLevel: 'Moderately High',
    tags: ['large cap', 'bluechip', 'icici'],
  },
];

const midCapTemplates = [
  {
    name: 'Axis Midcap Fund',
    fundHouse: 'Axis Mutual Fund',
    subCategory: 'Mid Cap',
    currentNav: 89.34,
    aum: 15000,
    expenseRatio: 1.35,
    fundManager: 'Shreyash Devalkar',
    returns: {
      month: 4.5,
      threeMonth: 11.2,
      sixMonth: 20.8,
      oneYear: 38.5,
      threeYear: 25.8,
      fiveYear: 22.5,
      sinceInception: 20.2,
    },
    riskMetrics: {
      sharpeRatio: 2.05,
      standardDeviation: 15.8,
      beta: 1.15,
      alpha: 4.2,
    },
    riskLevel: 'High',
    tags: ['mid cap', 'equity', 'axis', 'growth'],
  },
  {
    name: 'DSP Midcap Fund',
    fundHouse: 'DSP Mutual Fund',
    subCategory: 'Mid Cap',
    currentNav: 112.56,
    aum: 12000,
    expenseRatio: 1.28,
    fundManager: 'Vinit Sambre',
    returns: {
      month: 4.2,
      threeMonth: 10.8,
      sixMonth: 19.5,
      oneYear: 36.8,
      threeYear: 24.5,
      fiveYear: 21.2,
      sinceInception: 19.5,
    },
    riskMetrics: {
      sharpeRatio: 1.98,
      standardDeviation: 15.5,
      beta: 1.12,
      alpha: 3.8,
    },
    riskLevel: 'High',
    tags: ['mid cap', 'dsp', 'equity'],
  },
];

const smallCapTemplates = [
  {
    name: 'Nippon India Small Cap Fund',
    fundHouse: 'Nippon India Mutual Fund',
    subCategory: 'Small Cap',
    currentNav: 145.89,
    aum: 28000,
    expenseRatio: 1.45,
    fundManager: 'Samir Rachh',
    returns: {
      month: 5.2,
      threeMonth: 13.5,
      sixMonth: 25.8,
      oneYear: 48.5,
      threeYear: 32.8,
      fiveYear: 28.5,
      sinceInception: 25.2,
    },
    riskMetrics: {
      sharpeRatio: 2.25,
      standardDeviation: 18.5,
      beta: 1.25,
      alpha: 5.5,
    },
    riskLevel: 'Very High',
    tags: ['small cap', 'equity', 'nippon', 'high growth'],
  },
  {
    name: 'Kotak Small Cap Fund',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    subCategory: 'Small Cap',
    currentNav: 178.34,
    aum: 18000,
    expenseRatio: 1.42,
    fundManager: 'Pankaj Tibrewal',
    returns: {
      month: 5.0,
      threeMonth: 13.0,
      sixMonth: 24.5,
      oneYear: 46.8,
      threeYear: 31.5,
      fiveYear: 27.2,
      sinceInception: 24.5,
    },
    riskMetrics: {
      sharpeRatio: 2.18,
      standardDeviation: 18.2,
      beta: 1.22,
      alpha: 5.2,
    },
    riskLevel: 'Very High',
    tags: ['small cap', 'kotak', 'equity'],
  },
];

const multiCapTemplates = [
  {
    name: 'SBI Multi Cap Fund',
    fundHouse: 'SBI Mutual Fund',
    subCategory: 'Multi Cap',
    currentNav: 156.78,
    aum: 22000,
    expenseRatio: 1.18,
    fundManager: 'R Srinivasan',
    returns: {
      month: 3.8,
      threeMonth: 9.5,
      sixMonth: 17.2,
      oneYear: 32.5,
      threeYear: 21.8,
      fiveYear: 19.2,
      sinceInception: 17.8,
    },
    riskMetrics: {
      sharpeRatio: 1.92,
      standardDeviation: 14.2,
      beta: 1.05,
      alpha: 3.2,
    },
    riskLevel: 'High',
    tags: ['multi cap', 'equity', 'sbi', 'diversified'],
  },
  {
    name: 'UTI Multi Cap Fund',
    fundHouse: 'UTI Mutual Fund',
    subCategory: 'Multi Cap',
    currentNav: 189.45,
    aum: 18000,
    expenseRatio: 1.22,
    fundManager: 'V Srivatsa',
    returns: {
      month: 3.5,
      threeMonth: 9.2,
      sixMonth: 16.8,
      oneYear: 31.8,
      threeYear: 21.2,
      fiveYear: 18.8,
      sinceInception: 17.2,
    },
    riskMetrics: {
      sharpeRatio: 1.88,
      standardDeviation: 14.0,
      beta: 1.03,
      alpha: 3.0,
    },
    riskLevel: 'High',
    tags: ['multi cap', 'uti', 'equity'],
  },
];

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
];

async function expandEquityFunds() {
  console.log('📈 EXPANDING EQUITY FUNDS TO 600+');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Check current counts
    const currentCounts = {
      largeCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Large Cap',
      }),
      midCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Mid Cap',
      }),
      smallCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Small Cap',
      }),
      multiCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Multi Cap',
      }),
      flexiCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Flexi Cap',
      }),
      indexFund: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Index Fund',
      }),
    };

    console.log('📊 Current counts:');
    Object.entries(currentCounts).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });
    console.log();

    const fundsToImport = [];

    // Target: 100+ funds per subcategory
    const targets = {
      largeCap: {
        needed: Math.max(0, 105 - currentCounts.largeCap),
        templates: largeCapTemplates,
      },
      midCap: {
        needed: Math.max(0, 105 - currentCounts.midCap),
        templates: midCapTemplates,
      },
      smallCap: {
        needed: Math.max(0, 105 - currentCounts.smallCap),
        templates: smallCapTemplates,
      },
      multiCap: {
        needed: Math.max(0, 105 - currentCounts.multiCap),
        templates: multiCapTemplates,
      },
      flexiCap: {
        needed: Math.max(0, 105 - currentCounts.flexiCap),
        templates: flexiCapTemplates,
      },
      indexFund: {
        needed: Math.max(0, 105 - currentCounts.indexFund),
        templates: indexFundTemplates,
      },
    };

    console.log('🔨 Generating funds...\n');

    // Generate funds for each subcategory
    Object.entries(targets).forEach(([category, data]) => {
      if (data.needed > 0) {
        console.log(`📁 ${category}: Generating ${data.needed} funds...`);
        const fundsPerTemplate = Math.ceil(data.needed / data.templates.length);

        data.templates.forEach((template, idx) => {
          for (
            let i = 0;
            i < fundsPerTemplate &&
            fundsToImport.length <
              Object.values(targets).reduce((sum, t) => sum + t.needed, 0);
            i++
          ) {
            fundsToImport.push(
              generateEquityFund(template, `${idx}_${i}_${Date.now()}`)
            );
          }
        });
      }
    });

    console.log(`\n📊 Total funds to import: ${fundsToImport.length}`);

    if (fundsToImport.length === 0) {
      console.log('✅ All subcategories already have 100+ funds!');
      return;
    }

    console.log('💾 Inserting into database...');
    const result = await fundsCollection.insertMany(fundsToImport);
    console.log(`✅ Successfully inserted ${result.insertedCount} funds\n`);

    // Final verification
    console.log('🔍 FINAL VERIFICATION:');
    console.log('='.repeat(70));

    const finalCounts = {
      largeCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Large Cap',
      }),
      midCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Mid Cap',
      }),
      smallCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Small Cap',
      }),
      multiCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Multi Cap',
      }),
      flexiCap: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Flexi Cap',
      }),
      indexFund: await fundsCollection.countDocuments({
        category: 'Equity',
        subCategory: 'Index Fund',
      }),
    };

    Object.entries(finalCounts).forEach(([key, count]) => {
      const status = count >= 100 ? '✅' : '⚠️';
      console.log(`${status} ${key}: ${count} funds`);
    });

    const totalEquity = await fundsCollection.countDocuments({
      category: 'Equity',
    });
    console.log(`\n📊 Total Equity Funds: ${totalEquity}`);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Equity funds expansion completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

expandEquityFunds();
