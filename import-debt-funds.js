const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Helper to generate realistic fund data
function generateDebtFund(template, index) {
  const launchYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const randomLaunchYear =
    launchYears[Math.floor(Math.random() * launchYears.length)];

  const fundId = `${template.fundHouse.replace(/\s+/g, '_').toUpperCase()}_${template.subCategory.replace(/\s+/g, '_').toUpperCase()}_${index}`;

  return {
    fundId,
    name: template.name,
    fundHouse: template.fundHouse,
    category: 'Debt',
    subCategory: template.subCategory,
    fundType: 'mutual_fund',
    currentNav: template.currentNav + (Math.random() * 20 - 10),
    previousNav: template.currentNav + (Math.random() * 20 - 11),
    navDate: new Date(),
    launchDate: new Date(`${randomLaunchYear}-01-01`),
    aum: template.aum + (Math.random() * 5000 - 2500),
    expenseRatio: template.expenseRatio + (Math.random() * 0.2 - 0.1),
    exitLoad: template.exitLoad || 0.5,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: template.fundManager,
    returns: {
      day: parseFloat((Math.random() * 0.02).toFixed(3)),
      week: parseFloat((Math.random() * 0.1).toFixed(3)),
      month: parseFloat(
        (template.returns.month + (Math.random() * 0.5 - 0.25)).toFixed(2)
      ),
      threeMonth: parseFloat(
        (template.returns.threeMonth + (Math.random() * 1 - 0.5)).toFixed(2)
      ),
      sixMonth: parseFloat(
        (template.returns.sixMonth + (Math.random() * 1.5 - 0.75)).toFixed(2)
      ),
      oneYear: parseFloat(
        (template.returns.oneYear + (Math.random() * 2 - 1)).toFixed(2)
      ),
      threeYear: parseFloat(
        (template.returns.threeYear + (Math.random() * 1.5 - 0.75)).toFixed(2)
      ),
      fiveYear: parseFloat(
        (template.returns.fiveYear + (Math.random() * 1 - 0.5)).toFixed(2)
      ),
      sinceInception: parseFloat(
        (template.returns.sinceInception + (Math.random() * 1 - 0.5)).toFixed(2)
      ),
    },
    riskMetrics: {
      sharpeRatio: parseFloat(
        (
          template.riskMetrics?.sharpeRatio || 1.2 + Math.random() * 0.5
        ).toFixed(2)
      ),
      standardDeviation: parseFloat(
        (
          template.riskMetrics?.standardDeviation || 1.5 + Math.random() * 1
        ).toFixed(2)
      ),
      beta: parseFloat(
        (template.riskMetrics?.beta || 0.3 + Math.random() * 0.2).toFixed(2)
      ),
      alpha: parseFloat(
        (template.riskMetrics?.alpha || 0.5 + Math.random() * 0.5).toFixed(2)
      ),
    },
    ratings: {
      morningstar: Math.floor(Math.random() * 2) + 3, // 3-5 stars
      crisil: Math.floor(Math.random() * 2) + 3,
      valueResearch: Math.floor(Math.random() * 2) + 3,
    },
    riskLevel: template.riskLevel || 'Low',
    tags: template.tags,
    searchTerms: template.name.toLowerCase().split(' '),
    popularity: Math.floor(Math.random() * 800) + 200,
    isActive: true,
    dataSource: 'generated',
    lastUpdated: new Date(),
    createdAt: new Date(),
  };
}

// Debt Fund Templates (16 subcategories as per SEBI classification)
const debtFundTemplates = {
  'Liquid Fund': [
    {
      name: 'HDFC Liquid Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Liquid Fund',
      currentNav: 4856.23,
      aum: 45000,
      expenseRatio: 0.18,
      exitLoad: 0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.58,
        threeMonth: 1.75,
        sixMonth: 3.52,
        oneYear: 7.12,
        threeYear: 6.85,
        fiveYear: 6.45,
        sinceInception: 6.23,
      },
      riskLevel: 'Very Low',
      tags: ['liquid', 'debt', 'low risk', 'short term'],
    },
    {
      name: 'ICICI Prudential Liquid Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Liquid Fund',
      currentNav: 328.45,
      aum: 38000,
      expenseRatio: 0.2,
      exitLoad: 0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.55,
        threeMonth: 1.68,
        sixMonth: 3.45,
        oneYear: 7.05,
        threeYear: 6.78,
        fiveYear: 6.38,
        sinceInception: 6.15,
      },
      riskLevel: 'Very Low',
      tags: ['liquid', 'debt', 'emergency fund', 'safe'],
    },
    {
      name: 'SBI Liquid Fund',
      fundHouse: 'SBI Mutual Fund',
      subCategory: 'Liquid Fund',
      currentNav: 3456.78,
      aum: 42000,
      expenseRatio: 0.16,
      exitLoad: 0,
      fundManager: 'Dinesh Ahuja',
      returns: {
        month: 0.6,
        threeMonth: 1.8,
        sixMonth: 3.58,
        oneYear: 7.18,
        threeYear: 6.92,
        fiveYear: 6.52,
        sinceInception: 6.3,
      },
      riskLevel: 'Very Low',
      tags: ['liquid', 'debt', 'sbi', 'safe'],
    },
  ],
  'Ultra Short Duration Fund': [
    {
      name: 'HDFC Ultra Short Term Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Ultra Short Duration Fund',
      currentNav: 12.45,
      aum: 18500,
      expenseRatio: 0.35,
      exitLoad: 0.5,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.62,
        threeMonth: 1.88,
        sixMonth: 3.78,
        oneYear: 7.65,
        threeYear: 7.12,
        fiveYear: 6.85,
        sinceInception: 6.58,
      },
      riskLevel: 'Low',
      tags: ['ultra short', 'debt', 'low duration'],
    },
    {
      name: 'Axis Ultra Short Term Fund',
      fundHouse: 'Axis Mutual Fund',
      subCategory: 'Ultra Short Duration Fund',
      currentNav: 11.89,
      aum: 12000,
      expenseRatio: 0.38,
      exitLoad: 0.5,
      fundManager: 'Devang Shah',
      returns: {
        month: 0.65,
        threeMonth: 1.92,
        sixMonth: 3.82,
        oneYear: 7.72,
        threeYear: 7.18,
        fiveYear: 6.92,
        sinceInception: 6.65,
      },
      riskLevel: 'Low',
      tags: ['ultra short', 'debt', 'axis'],
    },
  ],
  'Low Duration Fund': [
    {
      name: 'ICICI Prudential Low Duration Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Low Duration Fund',
      currentNav: 28.56,
      aum: 8500,
      expenseRatio: 0.42,
      exitLoad: 0.5,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.68,
        threeMonth: 2.05,
        sixMonth: 4.15,
        oneYear: 8.25,
        threeYear: 7.68,
        fiveYear: 7.25,
        sinceInception: 7.05,
      },
      riskLevel: 'Low',
      tags: ['low duration', 'debt', '6-12 months'],
    },
  ],
  'Money Market Fund': [
    {
      name: 'Aditya Birla Money Manager Fund',
      fundHouse: 'Aditya Birla Sun Life Mutual Fund',
      subCategory: 'Money Market Fund',
      currentNav: 2156.34,
      aum: 15000,
      expenseRatio: 0.22,
      exitLoad: 0,
      fundManager: 'Kaustubh Gupta',
      returns: {
        month: 0.58,
        threeMonth: 1.75,
        sixMonth: 3.55,
        oneYear: 7.15,
        threeYear: 6.88,
        fiveYear: 6.48,
        sinceInception: 6.25,
      },
      riskLevel: 'Very Low',
      tags: ['money market', 'debt', 'short term'],
    },
  ],
  'Short Duration Fund': [
    {
      name: 'HDFC Short Term Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Short Duration Fund',
      currentNav: 25.67,
      aum: 12000,
      expenseRatio: 0.45,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.72,
        threeMonth: 2.18,
        sixMonth: 4.45,
        oneYear: 8.85,
        threeYear: 8.12,
        fiveYear: 7.68,
        sinceInception: 7.45,
      },
      riskLevel: 'Low',
      tags: ['short duration', 'debt', '1-3 years'],
    },
    {
      name: 'ICICI Prudential Short Term Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Short Duration Fund',
      currentNav: 45.23,
      aum: 10500,
      expenseRatio: 0.48,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.75,
        threeMonth: 2.25,
        sixMonth: 4.55,
        oneYear: 8.95,
        threeYear: 8.22,
        fiveYear: 7.78,
        sinceInception: 7.55,
      },
      riskLevel: 'Low',
      tags: ['short duration', 'debt', 'icici'],
    },
  ],
  'Medium Duration Fund': [
    {
      name: 'HDFC Medium Term Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Medium Duration Fund',
      currentNav: 19.45,
      aum: 8000,
      expenseRatio: 0.52,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.82,
        threeMonth: 2.48,
        sixMonth: 5.05,
        oneYear: 10.15,
        threeYear: 9.25,
        fiveYear: 8.68,
        sinceInception: 8.35,
      },
      riskLevel: 'Moderate',
      tags: ['medium duration', 'debt', '3-4 years'],
    },
  ],
  'Medium to Long Duration Fund': [
    {
      name: 'ICICI Prudential Regular Savings Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Medium to Long Duration Fund',
      currentNav: 23.89,
      aum: 6500,
      expenseRatio: 0.58,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.92,
        threeMonth: 2.78,
        sixMonth: 5.65,
        oneYear: 11.25,
        threeYear: 10.12,
        fiveYear: 9.45,
        sinceInception: 9.15,
      },
      riskLevel: 'Moderate',
      tags: ['medium long duration', 'debt', '4-7 years'],
    },
  ],
  'Long Duration Fund': [
    {
      name: 'HDFC Long Term Advantage Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Long Duration Fund',
      currentNav: 18.67,
      aum: 5500,
      expenseRatio: 0.62,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 1.05,
        threeMonth: 3.15,
        sixMonth: 6.35,
        oneYear: 12.55,
        threeYear: 11.25,
        fiveYear: 10.35,
        sinceInception: 10.05,
      },
      riskLevel: 'Moderately High',
      tags: ['long duration', 'debt', '7+ years'],
    },
  ],
  'Dynamic Bond': [
    {
      name: 'ICICI Prudential Dynamic Bond Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Dynamic Bond',
      currentNav: 28.34,
      aum: 7800,
      expenseRatio: 0.68,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.95,
        threeMonth: 2.88,
        sixMonth: 5.85,
        oneYear: 11.65,
        threeYear: 10.45,
        fiveYear: 9.68,
        sinceInception: 9.35,
      },
      riskLevel: 'Moderate',
      tags: ['dynamic bond', 'debt', 'flexible'],
    },
    {
      name: 'HDFC Dynamic Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Dynamic Bond',
      currentNav: 30.12,
      aum: 8200,
      expenseRatio: 0.65,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.98,
        threeMonth: 2.92,
        sixMonth: 5.92,
        oneYear: 11.75,
        threeYear: 10.55,
        fiveYear: 9.78,
        sinceInception: 9.45,
      },
      riskLevel: 'Moderate',
      tags: ['dynamic bond', 'debt', 'hdfc'],
    },
  ],
  'Corporate Bond Fund': [
    {
      name: 'HDFC Corporate Bond Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Corporate Bond Fund',
      currentNav: 23.45,
      aum: 12500,
      expenseRatio: 0.48,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.78,
        threeMonth: 2.35,
        sixMonth: 4.78,
        oneYear: 9.55,
        threeYear: 8.85,
        fiveYear: 8.25,
        sinceInception: 8.05,
      },
      riskLevel: 'Low',
      tags: ['corporate bond', 'debt', 'AA+ rated'],
    },
    {
      name: 'ICICI Prudential Corporate Bond Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Corporate Bond Fund',
      currentNav: 21.89,
      aum: 11000,
      expenseRatio: 0.52,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.75,
        threeMonth: 2.28,
        sixMonth: 4.68,
        oneYear: 9.45,
        threeYear: 8.75,
        fiveYear: 8.15,
        sinceInception: 7.95,
      },
      riskLevel: 'Low',
      tags: ['corporate bond', 'debt', 'high rated'],
    },
  ],
  'Credit Risk Fund': [
    {
      name: 'HDFC Credit Risk Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Credit Risk Fund',
      currentNav: 16.78,
      aum: 4500,
      expenseRatio: 0.85,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 1.15,
        threeMonth: 3.45,
        sixMonth: 7.05,
        oneYear: 14.15,
        threeYear: 12.45,
        fiveYear: 11.25,
        sinceInception: 10.85,
      },
      riskLevel: 'High',
      tags: ['credit risk', 'debt', 'high return'],
    },
  ],
  'Banking and PSU Fund': [
    {
      name: 'HDFC Banking and PSU Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Banking and PSU Fund',
      currentNav: 18.23,
      aum: 9500,
      expenseRatio: 0.45,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.72,
        threeMonth: 2.18,
        sixMonth: 4.45,
        oneYear: 8.92,
        threeYear: 8.25,
        fiveYear: 7.78,
        sinceInception: 7.55,
      },
      riskLevel: 'Low',
      tags: ['banking psu', 'debt', 'safe'],
    },
    {
      name: 'ICICI Prudential Banking and PSU Debt Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Banking and PSU Fund',
      currentNav: 19.67,
      aum: 8800,
      expenseRatio: 0.48,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.75,
        threeMonth: 2.25,
        sixMonth: 4.55,
        oneYear: 9.05,
        threeYear: 8.35,
        fiveYear: 7.88,
        sinceInception: 7.65,
      },
      riskLevel: 'Low',
      tags: ['banking psu', 'debt', 'government backed'],
    },
  ],
  'Gilt Fund': [
    {
      name: 'SBI Magnum Gilt Fund',
      fundHouse: 'SBI Mutual Fund',
      subCategory: 'Gilt Fund',
      currentNav: 48.92,
      aum: 3500,
      expenseRatio: 0.55,
      exitLoad: 1.0,
      fundManager: 'Dinesh Ahuja',
      returns: {
        month: 0.88,
        threeMonth: 2.65,
        sixMonth: 5.35,
        oneYear: 10.75,
        threeYear: 9.85,
        fiveYear: 9.15,
        sinceInception: 8.85,
      },
      riskLevel: 'Moderate',
      tags: ['gilt', 'debt', 'government securities'],
    },
    {
      name: 'HDFC Gilt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Gilt Fund',
      currentNav: 56.34,
      aum: 3200,
      expenseRatio: 0.58,
      exitLoad: 1.0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.85,
        threeMonth: 2.58,
        sixMonth: 5.25,
        oneYear: 10.55,
        threeYear: 9.68,
        fiveYear: 9.05,
        sinceInception: 8.75,
      },
      riskLevel: 'Moderate',
      tags: ['gilt', 'debt', 'g-sec'],
    },
  ],
  'Gilt Fund with 10 year constant duration': [
    {
      name: 'ICICI Prudential Gilt Fund - Constant Maturity Plan',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Gilt Fund with 10 year constant duration',
      currentNav: 34.78,
      aum: 2800,
      expenseRatio: 0.62,
      exitLoad: 1.0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.92,
        threeMonth: 2.78,
        sixMonth: 5.65,
        oneYear: 11.35,
        threeYear: 10.25,
        fiveYear: 9.55,
        sinceInception: 9.25,
      },
      riskLevel: 'Moderately High',
      tags: ['gilt', 'debt', '10 year', 'constant duration'],
    },
  ],
  'Floater Fund': [
    {
      name: 'HDFC Floating Rate Debt Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Floater Fund',
      currentNav: 24.56,
      aum: 6500,
      expenseRatio: 0.45,
      exitLoad: 0.5,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.65,
        threeMonth: 1.98,
        sixMonth: 4.05,
        oneYear: 8.15,
        threeYear: 7.55,
        fiveYear: 7.15,
        sinceInception: 6.95,
      },
      riskLevel: 'Low',
      tags: ['floater', 'debt', 'floating rate'],
    },
    {
      name: 'Nippon India Floating Rate Fund',
      fundHouse: 'Nippon India Mutual Fund',
      subCategory: 'Floater Fund',
      currentNav: 32.89,
      aum: 5800,
      expenseRatio: 0.48,
      exitLoad: 0.5,
      fundManager: 'Kinjal Desai',
      returns: {
        month: 0.68,
        threeMonth: 2.05,
        sixMonth: 4.15,
        oneYear: 8.25,
        threeYear: 7.65,
        fiveYear: 7.25,
        sinceInception: 7.05,
      },
      riskLevel: 'Low',
      tags: ['floater', 'debt', 'variable rate'],
    },
  ],
  'Overnight Fund': [
    {
      name: 'HDFC Overnight Fund',
      fundHouse: 'HDFC Mutual Fund',
      subCategory: 'Overnight Fund',
      currentNav: 1156.78,
      aum: 25000,
      expenseRatio: 0.15,
      exitLoad: 0,
      fundManager: 'Anil Bamboli',
      returns: {
        month: 0.52,
        threeMonth: 1.58,
        sixMonth: 3.18,
        oneYear: 6.45,
        threeYear: 6.15,
        fiveYear: 5.85,
        sinceInception: 5.65,
      },
      riskLevel: 'Very Low',
      tags: ['overnight', 'debt', 'ultra safe'],
    },
    {
      name: 'ICICI Prudential Overnight Fund',
      fundHouse: 'ICICI Prudential Mutual Fund',
      subCategory: 'Overnight Fund',
      currentNav: 1123.45,
      aum: 22000,
      expenseRatio: 0.18,
      exitLoad: 0,
      fundManager: 'Manish Banthia',
      returns: {
        month: 0.5,
        threeMonth: 1.52,
        sixMonth: 3.12,
        oneYear: 6.35,
        threeYear: 6.05,
        fiveYear: 5.75,
        sinceInception: 5.55,
      },
      riskLevel: 'Very Low',
      tags: ['overnight', 'debt', '1 day maturity'],
    },
  ],
};

async function importDebtFunds() {
  console.log('💰 DEBT FUNDS IMPORT SCRIPT');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Check existing debt funds
    const existingDebtCount = await fundsCollection.countDocuments({
      category: 'Debt',
    });
    console.log(`📊 Current debt funds in database: ${existingDebtCount}\n`);

    if (existingDebtCount > 0) {
      console.log('⚠️  Debt funds already exist. Options:');
      console.log('   1. Delete existing debt funds and reimport');
      console.log('   2. Add more funds without deleting\n');
      console.log(
        '💡 To delete: await fundsCollection.deleteMany({ category: "Debt" });\n'
      );
    }

    let totalImported = 0;
    const fundsToImport = [];

    console.log('🔨 Generating debt funds...\n');

    // Generate funds for each subcategory
    for (const [subCategory, templates] of Object.entries(debtFundTemplates)) {
      console.log(`📁 ${subCategory}:`);

      // Determine how many funds to create per template
      let fundsPerTemplate = 3; // Default

      // Adjust based on subcategory importance
      if (
        ['Liquid Fund', 'Corporate Bond Fund', 'Banking and PSU Fund'].includes(
          subCategory
        )
      ) {
        fundsPerTemplate = 15; // More funds for popular categories
      } else if (
        [
          'Ultra Short Duration Fund',
          'Short Duration Fund',
          'Dynamic Bond',
        ].includes(subCategory)
      ) {
        fundsPerTemplate = 10;
      } else if (
        ['Overnight Fund', 'Floater Fund', 'Gilt Fund'].includes(subCategory)
      ) {
        fundsPerTemplate = 8;
      } else {
        fundsPerTemplate = 5;
      }

      templates.forEach((template, templateIndex) => {
        for (let i = 0; i < fundsPerTemplate; i++) {
          const fund = generateDebtFund(template, `${templateIndex}_${i}`);
          fundsToImport.push(fund);
        }
      });

      const categoryCount = templates.length * fundsPerTemplate;
      console.log(`   Generated ${categoryCount} funds`);
      totalImported += categoryCount;
    }

    console.log(`\n📊 Total funds to import: ${totalImported}`);
    console.log('\n💾 Inserting into database...');

    const result = await fundsCollection.insertMany(fundsToImport);
    console.log(`✅ Successfully inserted ${result.insertedCount} funds\n`);

    // Verification
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    const finalDebtCount = await fundsCollection.countDocuments({
      category: 'Debt',
    });
    console.log(`Total Debt Funds: ${finalDebtCount}\n`);

    // Count by subcategory
    for (const subCategory of Object.keys(debtFundTemplates)) {
      const count = await fundsCollection.countDocuments({
        category: 'Debt',
        subCategory,
      });
      console.log(`  ${subCategory}: ${count} funds`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Debt funds import completed successfully!');
    console.log(`📈 Added ${totalImported} new debt funds`);
    console.log(`💰 Total debt funds now: ${finalDebtCount}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Run the import
importDebtFunds();
