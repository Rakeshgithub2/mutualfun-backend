/**
 * MASSIVE FUND DATABASE SEEDER - 4,459+ Funds
 * Seeds local and production databases with complete mutual fund data
 */

const mongoose = require('mongoose');
require('dotenv').config();

const fundSchema = new mongoose.Schema({
  fundId: String,
  name: String,
  category: String,
  subCategory: String,
  fundHouse: String,
  fundType: String,
  currentNav: Number,
  previousNav: Number,
  navDate: Date,
  returns: Object,
  riskMetrics: Object,
  aum: Number,
  expenseRatio: Number,
  exitLoad: Number,
  minInvestment: Number,
  sipMinAmount: Number,
  ratings: Object,
  holdings: Array,
  sectorAllocation: Array,
  assetAllocation: Object,
  fundManager: Object,
  tags: [String],
  popularity: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const Fund = mongoose.model('Fund', fundSchema);

const fundHouses = [
  'ICICI Prudential',
  'HDFC',
  'SBI',
  'Aditya Birla Sun Life',
  'Axis',
  'Kotak Mahindra',
  'UTI',
  'Nippon India',
  'Franklin Templeton',
  'DSP',
  'Mirae Asset',
  'Invesco',
  'L&T',
  'Sundaram',
  'IDFC',
  'Tata',
  'Edelweiss',
  'PGIM India',
  'Mahindra Manulife',
  'Baroda BNP Paribas',
  'HSBC',
  'Principal',
  'Quantum',
  'JM Financial',
  'BOI AXA',
];

const equitySubCategories = [
  'Large Cap',
  'Mid Cap',
  'Small Cap',
  'Flexi Cap',
  'Multi Cap',
  'Large & Mid Cap',
  'Focused',
  'Sectoral/Thematic',
  'Value',
  'Contra',
  'Dividend Yield',
  'ELSS',
];

const debtSubCategories = [
  'Liquid',
  'Overnight',
  'Ultra Short Duration',
  'Low Duration',
  'Money Market',
  'Short Duration',
  'Medium Duration',
  'Long Duration',
  'Dynamic Bond',
  'Corporate Bond',
  'Credit Risk',
  'Banking & PSU',
  'Gilt',
  'Floater',
];

const hybridSubCategories = [
  'Conservative Hybrid',
  'Balanced Hybrid',
  'Aggressive Hybrid',
  'Dynamic Asset Allocation',
  'Multi Asset Allocation',
  'Arbitrage',
  'Equity Savings',
];

function generateFund(category, subCategory, fundHouse, index) {
  const baseNav =
    category === 'equity'
      ? Math.random() * 400 + 10
      : category === 'debt'
        ? Math.random() * 20 + 10
        : Math.random() * 100 + 10;

  const fundId = `${fundHouse.replace(/\s+/g, '_').toUpperCase()}_${category.toUpperCase()}_${subCategory.replace(/[\s&/]/g, '_').toUpperCase()}_${index}`;

  return {
    fundId,
    name: `${fundHouse} ${subCategory} Fund ${index > 1 ? index : ''}`.trim(),
    category,
    subCategory,
    fundHouse,
    fundType: 'mutual_fund',
    currentNav: parseFloat(baseNav.toFixed(2)),
    previousNav: parseFloat((baseNav * 0.99).toFixed(2)),
    navDate: new Date(),
    returns: {
      day: Math.random() * 2 - 0.5,
      week: Math.random() * 4 - 1,
      month: Math.random() * 8 - 2,
      threeMonth: Math.random() * 15 - 3,
      sixMonth: Math.random() * 20 - 2,
      oneYear: Math.random() * 40 - 5,
      threeYear: Math.random() * 25 + 5,
      fiveYear: Math.random() * 20 + 5,
      sinceInception: Math.random() * 18 + 5,
    },
    riskMetrics: {
      sharpeRatio: Math.random() * 3,
      standardDeviation: Math.random() * 20 + 5,
      beta: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 5 - 1,
      rSquared: Math.random() * 0.3 + 0.7,
      sortino: Math.random() * 3,
    },
    aum: Math.floor(Math.random() * 50000) + 500,
    expenseRatio: Math.random() * 2 + 0.5,
    exitLoad: Math.random() < 0.5 ? 1 : 0,
    minInvestment: 5000,
    sipMinAmount: 500,
    ratings: {
      morningstar: Math.floor(Math.random() * 3) + 3,
      crisil: Math.floor(Math.random() * 3) + 3,
      valueResearch: Math.floor(Math.random() * 3) + 3,
    },
    holdings: generateHoldings(category),
    sectorAllocation: generateSectorAllocation(category),
    assetAllocation: generateAssetAllocation(category),
    fundManager: {
      name: `Manager ${Math.floor(Math.random() * 100)}`,
      experience: Math.floor(Math.random() * 20) + 5,
      qualification: 'MBA, CFA',
    },
    tags: [category, subCategory.toLowerCase()],
    popularity: Math.floor(Math.random() * 1000),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateHoldings(category) {
  if (category !== 'equity') return [];

  const companies = [
    'Reliance Industries',
    'HDFC Bank',
    'Infosys',
    'ICICI Bank',
    'TCS',
    'Bharti Airtel',
    'Kotak Mahindra Bank',
    'ITC',
    'Hindustan Unilever',
    'SBI',
    'Axis Bank',
    'L&T',
    'Asian Paints',
    'Bajaj Finance',
    'Maruti Suzuki',
  ];

  return companies.slice(0, 10).map((company) => ({
    companyName: company,
    sector: 'Banking',
    percentage: Math.random() * 8 + 2,
    quantity: Math.floor(Math.random() * 100000),
    value: Math.random() * 1000000,
  }));
}

function generateSectorAllocation(category) {
  if (category === 'equity') {
    return [
      { sector: 'Banking & Financial Services', percentage: 28.5 },
      { sector: 'Information Technology', percentage: 18.2 },
      { sector: 'Energy & Utilities', percentage: 12.4 },
      { sector: 'FMCG', percentage: 10.3 },
      { sector: 'Automobile', percentage: 8.7 },
    ];
  }
  return [];
}

function generateAssetAllocation(category) {
  if (category === 'equity') {
    return { equity: 95.5, debt: 2.5, cash: 2.0, others: 0 };
  } else if (category === 'debt') {
    return { equity: 0, debt: 97.0, cash: 3.0, others: 0 };
  } else if (category === 'hybrid') {
    return { equity: 65.0, debt: 30.0, cash: 4.0, others: 1.0 };
  }
  return { equity: 0, debt: 0, cash: 100, others: 0 };
}

async function seedMassiveDatabase() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

    console.log('\n🚀 MASSIVE DATABASE SEEDING - 4,459+ Funds\n');
    console.log(
      '📡 Connecting to:',
      MONGODB_URI.includes('localhost') ? 'Local DB' : 'Production DB'
    );

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing
    const deleted = await Fund.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing funds\n`);

    const allFunds = [];

    // Generate EQUITY funds (2,500 funds)
    console.log('📈 Generating EQUITY funds...');
    for (const fundHouse of fundHouses) {
      for (const subCat of equitySubCategories) {
        const fundsPerCombination = 8; // 25 houses * 12 subcats * 8 = 2,400
        for (let i = 1; i <= fundsPerCombination; i++) {
          allFunds.push(generateFund('equity', subCat, fundHouse, i));
        }
      }
    }
    console.log(`✅ Generated ${allFunds.length} equity funds`);

    // Generate DEBT funds (1,400 funds)
    console.log('📊 Generating DEBT funds...');
    const debtStart = allFunds.length;
    for (const fundHouse of fundHouses) {
      for (const subCat of debtSubCategories) {
        const fundsPerCombination = 4; // 25 * 14 * 4 = 1,400
        for (let i = 1; i <= fundsPerCombination; i++) {
          allFunds.push(generateFund('debt', subCat, fundHouse, i));
        }
      }
    }
    console.log(`✅ Generated ${allFunds.length - debtStart} debt funds`);

    // Generate HYBRID funds (450 funds)
    console.log('🔀 Generating HYBRID funds...');
    const hybridStart = allFunds.length;
    for (const fundHouse of fundHouses) {
      for (const subCat of hybridSubCategories) {
        const fundsPerCombination = 3; // 25 * 7 * 3 = 525
        for (let i = 1; i <= fundsPerCombination; i++) {
          allFunds.push(generateFund('hybrid', subCat, fundHouse, i));
        }
      }
    }
    console.log(`✅ Generated ${allFunds.length - hybridStart} hybrid funds`);

    // Generate other categories (159 funds to reach 4,459)
    console.log('📦 Generating OTHER category funds...');
    const otherStart = allFunds.length;
    const otherCategories = ['commodity', 'index', 'elss', 'international'];
    for (const category of otherCategories) {
      for (const fundHouse of fundHouses.slice(0, 10)) {
        for (let i = 1; i <= 4; i++) {
          allFunds.push(
            generateFund(
              category,
              category === 'commodity' ? 'Gold' : 'Index',
              fundHouse,
              i
            )
          );
        }
      }
    }
    console.log(
      `✅ Generated ${allFunds.length - otherStart} other category funds\n`
    );

    // Insert in batches
    console.log(`📤 Inserting ${allFunds.length} funds into database...`);
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < allFunds.length; i += BATCH_SIZE) {
      const batch = allFunds.slice(i, i + BATCH_SIZE);
      await Fund.insertMany(batch, { ordered: false });
      inserted += batch.length;
      const progress = ((inserted / allFunds.length) * 100).toFixed(1);
      process.stdout.write(
        `Progress: ${inserted}/${allFunds.length} (${progress}%) \r`
      );
    }

    console.log(`\n\n✅ SUCCESSFULLY INSERTED ${inserted} FUNDS!\n`);

    // Verify
    const counts = await Fund.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('📊 Category Breakdown:');
    counts.forEach((cat) => {
      console.log(`   ${cat._id}: ${cat.count} funds`);
    });

    const total = await Fund.countDocuments({ isActive: true });
    console.log(`\n🎉 TOTAL ACTIVE FUNDS: ${total}`);
    console.log('\n✅ DATABASE SEEDING COMPLETE!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedMassiveDatabase();
