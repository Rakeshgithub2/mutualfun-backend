const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
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
    name: 'HCL Technologies Ltd',
    ticker: 'HCLTECH',
    sector: 'Information Technology',
    percentage: 3.8,
  },
  { name: 'ITC Ltd', ticker: 'ITC', sector: 'FMCG', percentage: 3.6 },
  {
    name: 'Larsen & Toubro Ltd',
    ticker: 'LT',
    sector: 'Capital Goods',
    percentage: 3.4,
  },
  {
    name: 'Axis Bank Ltd',
    ticker: 'AXISBANK',
    sector: 'Financial Services',
    percentage: 3.2,
  },
  {
    name: 'Wipro Ltd',
    ticker: 'WIPRO',
    sector: 'Information Technology',
    percentage: 3.0,
  },
  {
    name: 'Asian Paints Ltd',
    ticker: 'ASIANPAINT',
    sector: 'Consumer Durables',
    percentage: 2.8,
  },
  {
    name: 'Maruti Suzuki India Ltd',
    ticker: 'MARUTI',
    sector: 'Automobile',
    percentage: 2.6,
  },
  {
    name: 'Bajaj Finance Ltd',
    ticker: 'BAJFINANCE',
    sector: 'Financial Services',
    percentage: 2.4,
  },
  {
    name: 'Titan Company Ltd',
    ticker: 'TITAN',
    sector: 'Consumer Durables',
    percentage: 2.2,
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
    percentage: 5.2,
  },
  {
    name: 'Cash & Equivalents',
    ticker: 'CASH',
    sector: 'Cash',
    percentage: 2.3,
  },
];

// Holdings for commodity (Silver) funds
const silverHoldings = [
  {
    name: 'Physical Silver',
    ticker: 'SILVER',
    sector: 'Precious Metals',
    percentage: 94.8,
  },
  {
    name: 'Cash & Equivalents',
    ticker: 'CASH',
    sector: 'Cash',
    percentage: 5.2,
  },
];

// Sector allocation for commodity funds
const commoditySectors = [
  { sector: 'Precious Metals', percentage: 95.0 },
  { sector: 'Cash', percentage: 5.0 },
];

// Real fund managers
const fundManagers = [
  {
    name: 'Prashant Jain',
    bio: "One of India's most experienced fund managers with over 25 years in the industry. Known for value investing approach.",
    designation: 'Chief Investment Officer - Equity',
    experience: 28,
  },
  {
    name: 'Rajeev Thakkar',
    bio: 'PPFAS Mutual Fund CIO with expertise in long-term value investing and global equity markets.',
    designation: 'Chief Investment Officer',
    experience: 22,
  },
  {
    name: 'Vetri Subramaniam',
    bio: 'Head of Equity at UTI AMC with deep expertise in Indian equities and portfolio management.',
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

async function addHoldingsAndSectors() {
  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Get all funds
    const funds = await fundsCollection.find({ isActive: true }).toArray();
    console.log(`\n📊 Adding holdings and sectors to ${funds.length} funds...`);

    let updatedCount = 0;

    for (const fund of funds) {
      let holdings, sectorAllocation;

      // Determine holdings based on fund type
      if (fund.category === 'COMMODITY') {
        if (fund.subCategory === 'Gold') {
          holdings = goldHoldings;
          sectorAllocation = commoditySectors;
        } else if (fund.subCategory === 'Silver') {
          holdings = silverHoldings;
          sectorAllocation = commoditySectors;
        } else {
          holdings = goldHoldings; // Default to gold for other commodities
          sectorAllocation = commoditySectors;
        }
      } else {
        // Equity funds - select random holdings
        holdings = selectRandomHoldings(equityHoldings, 15);
        sectorAllocation = selectSectorAllocation(equitySectors);
      }

      // Select random fund manager
      const manager =
        fundManagers[Math.floor(Math.random() * fundManagers.length)];

      // Update fund with holdings, sectors, and manager
      await fundsCollection.updateOne(
        { _id: fund._id },
        {
          $set: {
            holdings: holdings,
            sectorAllocation: sectorAllocation,
            fundManager: {
              name: manager.name,
              designation: manager.designation,
              experience: manager.experience,
              bio: manager.bio,
            },
            benchmark:
              fund.category === 'COMMODITY'
                ? fund.subCategory === 'Gold'
                  ? 'Gold Price Index'
                  : 'Silver Price Index'
                : fund.category === 'LARGE_CAP'
                  ? 'Nifty 50 TRI'
                  : fund.category === 'MID_CAP'
                    ? 'Nifty Midcap 150 TRI'
                    : fund.category === 'SMALL_CAP'
                      ? 'Nifty Smallcap 250 TRI'
                      : 'Nifty 500 TRI',
            portfolioTurnover: parseFloat((Math.random() * 50 + 20).toFixed(1)), // 20-70%
            lastUpdated: new Date(),
          },
        }
      );

      updatedCount++;
    }

    console.log(`\n✅ Updated ${updatedCount} funds with complete data`);
    console.log('\n📋 Added:');
    console.log('   • Top 15 holdings for each fund');
    console.log('   • Sector allocation');
    console.log('   • Fund manager details');
    console.log('   • Benchmark information');
    console.log('   • Portfolio turnover');

    console.log('\n🎉 Complete! All funds now have comprehensive data!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

addHoldingsAndSectors();
