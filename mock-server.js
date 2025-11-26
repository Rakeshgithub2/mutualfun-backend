const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Mock data with complete fund details
const mockFunds = [
  {
    id: '690cabb54e53f9072e623df1',
    amfiCode: 'HDFC001',
    name: 'HDFC Top 100 Fund',
    type: 'EQUITY',
    category: 'LARGE_CAP',
    benchmark: 'Nifty 100',
    expenseRatio: 1.25,
    inceptionDate: '2010-01-01T00:00:00.000Z',
    description: 'Large cap equity fund investing in top 100 companies',
    performances: [{ nav: 450.5, date: '2024-11-01T00:00:00.000Z' }],
    nav: 450.5,
    fundHouse: 'HDFC Mutual Fund',
    rating: 4.5,
    aum: 15000,
    returns1Y: 18.5,
    returns3Y: 15.2,
    returns5Y: 14.8,
    holdings: [
      { name: 'Reliance Industries', percentage: 8.5 },
      { name: 'HDFC Bank', percentage: 7.2 },
      { name: 'Infosys', percentage: 6.8 },
      { name: 'TCS', percentage: 6.5 },
      { name: 'ICICI Bank', percentage: 5.9 },
    ],
    manager: {
      name: 'Rajesh Kumar',
      bio: '15+ years of experience in equity markets. MBA from IIM Ahmedabad.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df2',
    amfiCode: 'ICICI001',
    name: 'ICICI Prudential Value Discovery Fund',
    type: 'EQUITY',
    category: 'MID_CAP',
    benchmark: 'Nifty Midcap 100',
    expenseRatio: 1.85,
    inceptionDate: '2012-06-15T00:00:00.000Z',
    description: 'Mid cap value focused equity fund',
    performances: [{ nav: 280.75, date: '2024-11-01T00:00:00.000Z' }],
    nav: 280.75,
    fundHouse: 'ICICI Prudential Mutual Fund',
    rating: 4,
    aum: 8500,
    returns1Y: 22.3,
    returns3Y: 18.9,
    returns5Y: 16.5,
    holdings: [
      { name: 'Bharti Airtel', percentage: 7.8 },
      { name: 'Asian Paints', percentage: 6.9 },
      { name: 'Bajaj Finance', percentage: 6.5 },
      { name: 'SBI', percentage: 5.8 },
      { name: 'Maruti Suzuki', percentage: 5.2 },
    ],
    manager: {
      name: 'Priya Sharma',
      bio: '12 years in mid-cap investing. CFA charterholder.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df3',
    amfiCode: 'SBI001',
    name: 'SBI Small Cap Fund',
    type: 'EQUITY',
    category: 'SMALL_CAP',
    benchmark: 'Nifty Smallcap 100',
    expenseRatio: 2.15,
    inceptionDate: '2015-03-20T00:00:00.000Z',
    description: 'Small cap equity fund with high growth potential',
    performances: [{ nav: 125.3, date: '2024-11-01T00:00:00.000Z' }],
    nav: 125.3,
    fundHouse: 'SBI Mutual Fund',
    rating: 4.5,
    aum: 6200,
    returns1Y: 28.7,
    returns3Y: 24.5,
    returns5Y: 21.2,
    holdings: [
      { name: 'Dixon Technologies', percentage: 4.2 },
      { name: 'Polycab India', percentage: 3.8 },
      { name: 'Apar Industries', percentage: 3.5 },
      { name: 'Cera Sanitaryware', percentage: 3.2 },
      { name: 'Crompton Greaves', percentage: 3.0 },
    ],
    manager: {
      name: 'Amit Verma',
      bio: '10 years specializing in small-cap research and analysis.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df4',
    amfiCode: 'AXIS001',
    name: 'Axis Bluechip Fund',
    type: 'EQUITY',
    category: 'LARGE_CAP',
    benchmark: 'Nifty 50',
    expenseRatio: 1.05,
    inceptionDate: '2011-09-10T00:00:00.000Z',
    description:
      'Bluechip equity fund focusing on established large cap companies',
    performances: [{ nav: 525.8, date: '2024-11-01T00:00:00.000Z' }],
    nav: 525.8,
    fundHouse: 'Axis Mutual Fund',
    rating: 5,
    aum: 32000,
    returns1Y: 16.8,
    returns3Y: 14.5,
    returns5Y: 13.9,
    holdings: [
      { name: 'HDFC Bank', percentage: 9.2 },
      { name: 'ICICI Bank', percentage: 8.5 },
      { name: 'Reliance', percentage: 7.8 },
      { name: 'Infosys', percentage: 7.2 },
      { name: 'TCS', percentage: 6.9 },
    ],
    manager: {
      name: 'Shreyash Devalkar',
      bio: '18 years of experience. Previously at JP Morgan Asset Management.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df5',
    amfiCode: 'MIRAE001',
    name: 'Mirae Asset Emerging Bluechip Fund',
    type: 'EQUITY',
    category: 'MID_CAP',
    benchmark: 'Nifty Midcap 100',
    expenseRatio: 1.65,
    inceptionDate: '2013-12-05T00:00:00.000Z',
    description: 'Emerging bluechip fund investing in mid cap opportunities',
    performances: [{ nav: 310.45, date: '2024-11-01T00:00:00.000Z' }],
    nav: 310.45,
    fundHouse: 'Mirae Asset Mutual Fund',
    rating: 4.5,
    aum: 24500,
    returns1Y: 25.4,
    returns3Y: 21.8,
    returns5Y: 19.3,
    holdings: [
      { name: 'Bajaj Finance', percentage: 6.5 },
      { name: 'Havells India', percentage: 5.8 },
      { name: 'Titan Company', percentage: 5.5 },
      { name: 'Pidilite Industries', percentage: 5.2 },
      { name: 'Dabur India', percentage: 4.9 },
    ],
    manager: {
      name: 'Neelesh Surana',
      bio: '14 years in equity research. Specializes in growth investing.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df6',
    amfiCode: 'GOLD001',
    name: 'SBI Gold ETF',
    type: 'COMMODITY',
    category: 'ETF',
    benchmark: 'Gold Price',
    expenseRatio: 0.5,
    inceptionDate: '2014-06-10T00:00:00.000Z',
    description: 'Gold Exchange Traded Fund tracking physical gold prices',
    performances: [{ nav: 52.3, date: '2024-11-01T00:00:00.000Z' }],
    nav: 52.3,
    fundHouse: 'SBI Mutual Fund',
    rating: 4,
    aum: 4500,
    returns1Y: 12.5,
    returns3Y: 9.8,
    returns5Y: 11.2,
    holdings: [{ name: 'Physical Gold', percentage: 100 }],
    manager: {
      name: 'Commodity Desk',
      bio: 'Managed by SBI commodity experts team.',
      photo: null,
    },
  },
  {
    id: '690cabb54e53f9072e623df7',
    amfiCode: 'SILVER001',
    name: 'ICICI Prudential Silver ETF',
    type: 'COMMODITY',
    category: 'ETF',
    benchmark: 'Silver Price',
    expenseRatio: 0.55,
    inceptionDate: '2016-02-20T00:00:00.000Z',
    description: 'Silver Exchange Traded Fund for precious metal exposure',
    performances: [{ nav: 68.9, date: '2024-11-01T00:00:00.000Z' }],
    nav: 68.9,
    fundHouse: 'ICICI Prudential Mutual Fund',
    rating: 3.5,
    aum: 1800,
    returns1Y: 18.3,
    returns3Y: 14.5,
    returns5Y: 13.8,
    holdings: [{ name: 'Physical Silver', percentage: 100 }],
    manager: {
      name: 'Commodity Desk',
      bio: 'Managed by ICICI commodity specialists.',
      photo: null,
    },
  },
];

// Mock funds endpoint
app.get('/api/funds', (req, res) => {
  try {
    console.log('📥 GET /api/funds - Request received');

    const limit = parseInt(req.query.limit) || 10;
    const funds = mockFunds.slice(0, limit);

    console.log(`✅ Returning ${funds.length} mock funds`);

    res.json({
      success: true,
      data: funds,
      total: funds.length,
      message: 'Funds retrieved successfully (mock data)',
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mode: 'mock' });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`✅ Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Test: http://localhost:${PORT}/api/funds?limit=5`);
  console.log(`⚠️  Using MOCK DATA - no database connection`);
});
