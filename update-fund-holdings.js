const { MongoClient, ObjectId } = require('mongodb');

const uri =
  'mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds';
const client = new MongoClient(uri);

// Real Indian company holdings for equity funds
const equityHoldings = [
  {
    name: 'Reliance Industries Ltd',
    ticker: 'RELIANCE',
    sector: 'Energy',
    percentage: 8.5,
  },
  {
    name: 'HDFC Bank Ltd',
    ticker: 'HDFCBANK',
    sector: 'Financial Services',
    percentage: 7.2,
  },
  {
    name: 'Infosys Ltd',
    ticker: 'INFY',
    sector: 'Information Technology',
    percentage: 6.8,
  },
  {
    name: 'ICICI Bank Ltd',
    ticker: 'ICICIBANK',
    sector: 'Financial Services',
    percentage: 6.3,
  },
  {
    name: 'Tata Consultancy Services',
    ticker: 'TCS',
    sector: 'Information Technology',
    percentage: 5.9,
  },
  {
    name: 'Bharti Airtel Ltd',
    ticker: 'BHARTIARTL',
    sector: 'Telecommunication',
    percentage: 4.5,
  },
  {
    name: 'State Bank of India',
    ticker: 'SBIN',
    sector: 'Financial Services',
    percentage: 4.2,
  },
  {
    name: 'ITC Ltd',
    ticker: 'ITC',
    sector: 'FMCG',
    percentage: 3.8,
  },
  {
    name: 'Larsen & Toubro',
    ticker: 'LT',
    sector: 'Capital Goods',
    percentage: 3.5,
  },
  {
    name: 'Asian Paints Ltd',
    ticker: 'ASIANPAINT',
    sector: 'Consumer Durables',
    percentage: 3.2,
  },
  {
    name: 'HCL Technologies',
    ticker: 'HCLTECH',
    sector: 'Information Technology',
    percentage: 2.8,
  },
  {
    name: 'Maruti Suzuki',
    ticker: 'MARUTI',
    sector: 'Automobile',
    percentage: 2.5,
  },
  {
    name: 'Axis Bank Ltd',
    ticker: 'AXISBANK',
    sector: 'Financial Services',
    percentage: 2.3,
  },
  {
    name: 'Wipro Ltd',
    ticker: 'WIPRO',
    sector: 'Information Technology',
    percentage: 2.1,
  },
  {
    name: 'Hindustan Unilever Ltd',
    ticker: 'HINDUNILVR',
    sector: 'FMCG',
    percentage: 2.0,
  },
  {
    name: 'Kotak Mahindra Bank',
    ticker: 'KOTAKBANK',
    sector: 'Financial Services',
    percentage: 1.9,
  },
  {
    name: 'Mahindra & Mahindra',
    ticker: 'M&M',
    sector: 'Automobile',
    percentage: 1.8,
  },
  {
    name: 'Tech Mahindra Ltd',
    ticker: 'TECHM',
    sector: 'Information Technology',
    percentage: 1.7,
  },
  {
    name: 'Bajaj Finance Ltd',
    ticker: 'BAJFINANCE',
    sector: 'Financial Services',
    percentage: 1.6,
  },
  {
    name: 'Sun Pharma Industries',
    ticker: 'SUNPHARMA',
    sector: 'Healthcare',
    percentage: 1.5,
  },
];

// Sector allocation for equity funds
const equitySectors = [
  { sector: 'Financial Services', percentage: 28.5 },
  { sector: 'Information Technology', percentage: 22.3 },
  { sector: 'Energy', percentage: 12.8 },
  { sector: 'FMCG', percentage: 8.4 },
  { sector: 'Automobile', percentage: 7.2 },
  { sector: 'Consumer Durables', percentage: 6.5 },
  { sector: 'Capital Goods', percentage: 5.8 },
  { sector: 'Telecommunication', percentage: 4.7 },
  { sector: 'Healthcare', percentage: 3.8 },
];

// Holdings for commodity (Gold) funds
const goldHoldings = [
  {
    name: 'Physical Gold',
    ticker: 'GOLD',
    sector: 'Precious Metals',
    percentage: 92.5,
  },
  {
    name: 'Gold ETF Units',
    ticker: 'GOLDETF',
    sector: 'Precious Metals',
    percentage: 4.5,
  },
  {
    name: 'Cash & Cash Equivalents',
    ticker: 'CASH',
    sector: 'Cash',
    percentage: 3.0,
  },
];

const silverHoldings = [
  {
    name: 'Physical Silver',
    ticker: 'SILVER',
    sector: 'Precious Metals',
    percentage: 91.0,
  },
  {
    name: 'Silver ETF Units',
    ticker: 'SILVERETF',
    sector: 'Precious Metals',
    percentage: 5.5,
  },
  {
    name: 'Cash & Cash Equivalents',
    ticker: 'CASH',
    sector: 'Cash',
    percentage: 3.5,
  },
];

const commoditySectors = [
  { sector: 'Precious Metals', percentage: 97.0 },
  { sector: 'Cash', percentage: 3.0 },
];

// Fund managers data
const fundManagers = [
  {
    name: 'Prashant Jain',
    bio: 'One of the most respected fund managers in India with over 25 years of experience.',
    designation: 'Chief Investment Officer',
    experience: 25,
  },
  {
    name: 'Sankaran Naren',
    bio: 'Known for value investing approach and managing multiple award-winning funds.',
    designation: 'Executive Director & CIO',
    experience: 22,
  },
  {
    name: 'Neelesh Surana',
    bio: 'Specialized in large cap equity funds with consistent track record.',
    designation: 'Senior Fund Manager',
    experience: 18,
  },
  {
    name: 'Ravi Gopalakrishnan',
    bio: 'Expert in mid and small cap investing with strong analytical skills.',
    designation: 'Head of Equity',
    experience: 20,
  },
  {
    name: 'Jinesh Gopani',
    bio: "Axis Mutual Fund's equity fund manager known for disciplined investment approach.",
    designation: 'Senior Fund Manager - Equity',
    experience: 18,
  },
  {
    name: 'Sohini Andani',
    bio: "SBI Funds Management's equity fund manager with strong track record in large cap investing.",
    designation: 'Fund Manager - Equity',
    experience: 15,
  },
];

function selectRandomHoldings(baseHoldings, count = 15) {
  const shuffled = [...baseHoldings].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Normalize percentages to sum to ~95% (leaving 5% for cash/others)
  const total = selected.reduce((sum, h) => sum + h.percentage, 0);
  const normalizedHoldings = selected.map((h) => ({
    ...h,
    percentage: parseFloat(((h.percentage / total) * 95).toFixed(2)),
    value: Math.floor(Math.random() * 50000000) + 10000000, // Random value in rupees
    quantity: Math.floor(Math.random() * 1000000) + 10000, // Random quantity
  }));

  return normalizedHoldings;
}

function selectSectorAllocation(baseSectors) {
  const total = baseSectors.reduce((sum, s) => sum + s.percentage, 0);
  return baseSectors.map((s) => ({
    ...s,
    percentage: parseFloat(((s.percentage / total) * 100).toFixed(2)),
  }));
}

async function updateFundHoldings() {
  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Get all funds that don't have holdings
    const funds = await fundsCollection
      .find({
        isActive: true,
        $or: [{ holdings: { $exists: false } }, { holdings: { $size: 0 } }],
      })
      .toArray();

    console.log(
      `\n📊 Found ${funds.length} funds without holdings data. Updating...`
    );

    let updatedCount = 0;

    for (const fund of funds) {
      let holdings, sectorAllocation;

      // Determine holdings based on fund category
      if (fund.category === 'commodity') {
        if (fund.subCategory?.toLowerCase().includes('gold')) {
          holdings = goldHoldings;
          sectorAllocation = commoditySectors;
        } else if (fund.subCategory?.toLowerCase().includes('silver')) {
          holdings = silverHoldings;
          sectorAllocation = commoditySectors;
        } else {
          holdings = goldHoldings; // Default to gold for other commodities
          sectorAllocation = commoditySectors;
        }
      } else if (fund.category === 'debt') {
        // Debt funds - create bond holdings
        holdings = [
          {
            name: 'Government Securities',
            ticker: 'GSEC',
            sector: 'Government Bonds',
            percentage: 45.0,
            value: Math.floor(Math.random() * 50000000) + 10000000,
            quantity: 1,
          },
          {
            name: 'Corporate Bonds - AAA',
            ticker: 'CORPBOND',
            sector: 'Corporate Bonds',
            percentage: 35.0,
            value: Math.floor(Math.random() * 40000000) + 8000000,
            quantity: 1,
          },
          {
            name: 'Treasury Bills',
            ticker: 'TBILL',
            sector: 'Money Market',
            percentage: 15.0,
            value: Math.floor(Math.random() * 20000000) + 5000000,
            quantity: 1,
          },
          {
            name: 'Cash & Cash Equivalents',
            ticker: 'CASH',
            sector: 'Cash',
            percentage: 5.0,
            value: Math.floor(Math.random() * 10000000) + 2000000,
            quantity: 1,
          },
        ];
        sectorAllocation = [
          { sector: 'Government Bonds', percentage: 45.0 },
          { sector: 'Corporate Bonds', percentage: 35.0 },
          { sector: 'Money Market', percentage: 15.0 },
          { sector: 'Cash', percentage: 5.0 },
        ];
      } else {
        // Equity funds - select random holdings
        holdings = selectRandomHoldings(equityHoldings, 15);
        sectorAllocation = selectSectorAllocation(equitySectors);
      }

      // Select random fund manager
      const manager =
        fundManagers[Math.floor(Math.random() * fundManagers.length)];

      // Update fund with holdings, sectors, and manager details
      await fundsCollection.updateOne(
        { _id: new ObjectId(fund._id) },
        {
          $set: {
            holdings: holdings,
            sectorAllocation: sectorAllocation,
            fundManager: manager.name,
            fundManagerDetails: {
              name: manager.name,
              designation: manager.designation,
              experience: manager.experience,
              bio: manager.bio,
            },
            lastUpdated: new Date(),
          },
        }
      );

      updatedCount++;
      if (updatedCount % 10 === 0) {
        console.log(`   ✓ Updated ${updatedCount} funds...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} funds!`);
    console.log('\n📋 Added to each fund:');
    console.log('   • Top 10-15 holdings with details');
    console.log('   • Sector allocation data');
    console.log('   • Fund manager information');
    console.log('\n🎉 All funds now have complete data for the frontend!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

updateFundHoldings();
