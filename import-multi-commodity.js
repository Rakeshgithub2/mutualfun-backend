const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

function generateCommodityFund(template, index) {
  const launchYears = [2018, 2019, 2020, 2021, 2022, 2023];
  const randomLaunchYear =
    launchYears[Math.floor(Math.random() * launchYears.length)];

  const fundId = `${template.fundHouse.replace(/\s+/g, '_').toUpperCase()}_${template.subCategory.replace(/\s+/g, '_').toUpperCase()}_${index}`;

  return {
    fundId,
    name: template.name,
    fundHouse: template.fundHouse,
    category: 'Commodity',
    subCategory: template.subCategory,
    fundType: template.fundType || 'mutual_fund',
    currentNav: template.currentNav + (Math.random() * 5 - 2.5),
    previousNav: template.currentNav + (Math.random() * 5 - 2.6),
    navDate: new Date(),
    launchDate: new Date(`${randomLaunchYear}-01-01`),
    aum: template.aum + (Math.random() * 2000 - 1000),
    expenseRatio: template.expenseRatio + (Math.random() * 0.2 - 0.1),
    exitLoad: template.exitLoad || 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: template.fundManager,
    returns: {
      day: parseFloat((Math.random() * 1.5 - 0.75).toFixed(2)),
      week: parseFloat((Math.random() * 3 - 1.5).toFixed(2)),
      month: parseFloat(
        (template.returns.month + (Math.random() * 2 - 1)).toFixed(2)
      ),
      threeMonth: parseFloat(
        (template.returns.threeMonth + (Math.random() * 3 - 1.5)).toFixed(2)
      ),
      sixMonth: parseFloat(
        (template.returns.sixMonth + (Math.random() * 4 - 2)).toFixed(2)
      ),
      oneYear: parseFloat(
        (template.returns.oneYear + (Math.random() * 5 - 2.5)).toFixed(2)
      ),
      threeYear: parseFloat(
        (template.returns.threeYear + (Math.random() * 3 - 1.5)).toFixed(2)
      ),
      fiveYear: parseFloat(
        (template.returns.fiveYear + (Math.random() * 2 - 1)).toFixed(2)
      ),
      sinceInception: parseFloat(
        (template.returns.sinceInception + (Math.random() * 2 - 1)).toFixed(2)
      ),
    },
    riskMetrics: {
      sharpeRatio: parseFloat(
        (
          template.riskMetrics.sharpeRatio +
          (Math.random() * 0.3 - 0.15)
        ).toFixed(2)
      ),
      standardDeviation: parseFloat(
        (
          template.riskMetrics.standardDeviation +
          (Math.random() * 1.5 - 0.75)
        ).toFixed(2)
      ),
      beta: parseFloat(
        (template.riskMetrics.beta + (Math.random() * 0.15 - 0.075)).toFixed(2)
      ),
      alpha: parseFloat(
        (template.riskMetrics.alpha + (Math.random() * 0.5 - 0.25)).toFixed(2)
      ),
    },
    ratings: {
      morningstar: Math.floor(Math.random() * 3) + 3, // 3-5 stars
      crisil: Math.floor(Math.random() * 3) + 3,
      valueResearch: Math.floor(Math.random() * 3) + 3,
    },
    riskLevel: template.riskLevel || 'Moderately High',
    tags: template.tags,
    searchTerms: template.name.toLowerCase().split(' '),
    popularity: Math.floor(Math.random() * 700) + 100,
    isActive: true,
    dataSource: 'generated',
    lastUpdated: new Date(),
    createdAt: new Date(),
  };
}

const multiCommodityTemplates = [
  {
    name: 'ICICI Prudential Commodities Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    subCategory: 'Multi Commodity Fund',
    currentNav: 18.45,
    aum: 450,
    expenseRatio: 1.75,
    fundManager: 'Manish Banthia',
    returns: {
      month: 1.8,
      threeMonth: 4.2,
      sixMonth: 7.5,
      oneYear: 12.8,
      threeYear: 8.5,
      fiveYear: 7.2,
      sinceInception: 6.8,
    },
    riskMetrics: {
      sharpeRatio: 0.95,
      standardDeviation: 9.5,
      beta: 0.45,
      alpha: 1.2,
    },
    riskLevel: 'Moderately High',
    tags: [
      'multi commodity',
      'commodity',
      'diversified',
      'gold',
      'silver',
      'crude',
    ],
  },
  {
    name: 'Aditya Birla Sun Life Commodities Fund',
    fundHouse: 'Aditya Birla Sun Life Mutual Fund',
    subCategory: 'Multi Commodity Fund',
    currentNav: 22.67,
    aum: 380,
    expenseRatio: 1.85,
    fundManager: 'Commodities Team',
    returns: {
      month: 1.9,
      threeMonth: 4.5,
      sixMonth: 7.8,
      oneYear: 13.2,
      threeYear: 8.8,
      fiveYear: 7.5,
      sinceInception: 7.1,
    },
    riskMetrics: {
      sharpeRatio: 0.98,
      standardDeviation: 9.8,
      beta: 0.47,
      alpha: 1.3,
    },
    riskLevel: 'Moderately High',
    tags: ['multi commodity', 'aditya birla', 'diversified'],
  },
  {
    name: 'SBI Multi Commodity Fund',
    fundHouse: 'SBI Mutual Fund',
    subCategory: 'Multi Commodity Fund',
    currentNav: 15.89,
    aum: 520,
    expenseRatio: 1.65,
    fundManager: 'Dinesh Ahuja',
    returns: {
      month: 1.7,
      threeMonth: 4.0,
      sixMonth: 7.2,
      oneYear: 12.5,
      threeYear: 8.2,
      fiveYear: 7.0,
      sinceInception: 6.6,
    },
    riskMetrics: {
      sharpeRatio: 0.92,
      standardDeviation: 9.2,
      beta: 0.43,
      alpha: 1.1,
    },
    riskLevel: 'Moderately High',
    tags: ['multi commodity', 'sbi', 'commodities'],
  },
];

async function importMultiCommodityFunds() {
  console.log('🛢️  MULTI COMMODITY FUNDS IMPORT');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Check existing
    const existingMultiCommodity = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Multi Commodity Fund',
    });

    console.log('📊 Current status:');
    console.log(`   Multi Commodity funds: ${existingMultiCommodity}\n`);

    const fundsToImport = [];

    // Generate Multi Commodity funds (30 funds)
    console.log('🔨 Generating Multi Commodity funds...');
    multiCommodityTemplates.forEach((template, idx) => {
      for (let i = 0; i < 10; i++) {
        // 30 total (3 templates × 10)
        fundsToImport.push(generateCommodityFund(template, `${idx}_${i}`));
      }
    });
    console.log(`   Generated ${fundsToImport.length} Multi Commodity funds`);

    console.log('💾 Inserting into database...');

    const result = await fundsCollection.insertMany(fundsToImport);
    console.log(`✅ Successfully inserted ${result.insertedCount} funds\n`);

    // Verification
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    const finalMultiCommodity = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Multi Commodity Fund',
    });
    const totalCommodity = await fundsCollection.countDocuments({
      category: 'Commodity',
    });
    const goldFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Gold Fund',
    });
    const silverFunds = await fundsCollection.countDocuments({
      category: 'Commodity',
      subCategory: 'Silver Fund',
    });

    console.log('Commodity funds breakdown:');
    console.log(`  Gold Fund: ${goldFunds}`);
    console.log(`  Silver Fund: ${silverFunds}`);
    console.log(`  Multi Commodity Fund: ${finalMultiCommodity}`);
    console.log(`  Total Commodity: ${totalCommodity}`);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Multi Commodity funds added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

importMultiCommodityFunds();
