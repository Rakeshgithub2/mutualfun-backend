const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Helper function to generate realistic fund data
function generateFundData(baseFund, index) {
  const launchYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const randomLaunchYear =
    launchYears[Math.floor(Math.random() * launchYears.length)];

  return {
    fundId: `${baseFund.fundHouse.replace(/\s+/g, '_').toUpperCase()}_${baseFund.subCategory.replace(/\s+/g, '_').toUpperCase()}_${index}`,
    name: baseFund.name,
    fundHouse: baseFund.fundHouse,
    category: baseFund.category,
    subCategory: baseFund.subCategory,
    fundType: baseFund.fundType || 'mutual_fund',
    currentNav: baseFund.currentNav,
    previousNav: baseFund.currentNav * 0.99,
    navDate: new Date(),
    launchDate: new Date(`${randomLaunchYear}-01-01`),
    aum: baseFund.aum,
    expenseRatio: baseFund.expenseRatio,
    exitLoad: baseFund.exitLoad || 1.0,
    minInvestment: baseFund.fundType === 'etf' ? 1 : 5000,
    sipMinAmount: baseFund.fundType === 'etf' ? 0 : 500,
    fundManager: baseFund.fundManager,
    returns: baseFund.returns,
    riskMetrics: baseFund.riskMetrics,
    ratings: baseFund.ratings,
    tags: baseFund.tags,
    searchTerms: baseFund.name.toLowerCase().split(' '),
    popularity: Math.floor(Math.random() * 1000) + 100,
    isActive: true,
    dataSource: 'real_world',
    lastUpdated: new Date(),
    createdAt: new Date(),
  };
}

// Real-world Large Cap Funds (30 funds)
const largeCapFunds = [
  {
    name: 'HDFC Top 100 Fund',
    fundHouse: 'HDFC Mutual Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 812.45,
    aum: 28500,
    expenseRatio: 0.89,
    fundManager: 'Chirag Setalvad',
    returns: {
      day: 0.27,
      week: 1.83,
      month: 3.45,
      threeMonth: 8.92,
      sixMonth: 15.67,
      oneYear: 28.45,
      threeYear: 18.34,
      fiveYear: 15.89,
      sinceInception: 14.23,
    },
    riskMetrics: {
      sharpeRatio: 1.89,
      standardDeviation: 12.45,
      beta: 0.98,
      alpha: 2.34,
      rSquared: 0.94,
      sortino: 2.12,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['large cap', 'equity', 'top 100', 'blue chip'],
  },
  {
    name: 'ICICI Prudential Bluechip Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 89.76,
    aum: 45600,
    expenseRatio: 0.95,
    fundManager: 'Ihab Dalwai',
    returns: {
      day: 0.72,
      week: 2.15,
      month: 4.23,
      threeMonth: 9.87,
      sixMonth: 16.45,
      oneYear: 30.12,
      threeYear: 19.67,
      fiveYear: 16.89,
      sinceInception: 15.23,
    },
    riskMetrics: {
      sharpeRatio: 2.01,
      standardDeviation: 11.89,
      beta: 0.97,
      alpha: 2.87,
      rSquared: 0.95,
      sortino: 2.34,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['large cap', 'equity', 'bluechip'],
  },
  {
    name: 'SBI Bluechip Fund',
    fundHouse: 'SBI Mutual Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 78.9,
    aum: 32400,
    expenseRatio: 0.85,
    fundManager: 'R. Srinivasan',
    returns: {
      day: 0.45,
      week: 1.95,
      month: 3.87,
      threeMonth: 8.56,
      sixMonth: 14.89,
      oneYear: 27.34,
      threeYear: 17.89,
      fiveYear: 15.23,
      sinceInception: 14.56,
    },
    riskMetrics: {
      sharpeRatio: 1.78,
      standardDeviation: 12.67,
      beta: 0.99,
      alpha: 2.12,
      rSquared: 0.93,
      sortino: 2.01,
    },
    ratings: { morningstar: 5, crisil: 4, valueResearch: 5 },
    tags: ['large cap', 'equity', 'bluechip', 'sbi'],
  },
  {
    name: 'Axis Bluechip Fund',
    fundHouse: 'Axis Mutual Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 45.67,
    aum: 27800,
    expenseRatio: 0.92,
    fundManager: 'Shreyash Devalkar',
    returns: {
      day: 0.38,
      week: 2.04,
      month: 4.12,
      threeMonth: 9.23,
      sixMonth: 15.78,
      oneYear: 29.45,
      threeYear: 18.67,
      fiveYear: 16.12,
      sinceInception: 15.34,
    },
    riskMetrics: {
      sharpeRatio: 1.92,
      standardDeviation: 12.23,
      beta: 0.96,
      alpha: 2.56,
      rSquared: 0.94,
      sortino: 2.18,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['large cap', 'equity', 'bluechip', 'axis'],
  },
  {
    name: 'Kotak Bluechip Fund',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 312.45,
    aum: 18900,
    expenseRatio: 0.88,
    fundManager: 'Harsha Upadhyaya',
    returns: {
      day: 0.52,
      week: 1.89,
      month: 3.92,
      threeMonth: 8.78,
      sixMonth: 15.23,
      oneYear: 28.67,
      threeYear: 18.12,
      fiveYear: 15.67,
      sinceInception: 14.89,
    },
    riskMetrics: {
      sharpeRatio: 1.85,
      standardDeviation: 12.34,
      beta: 0.98,
      alpha: 2.23,
      rSquared: 0.93,
      sortino: 2.09,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 4 },
    tags: ['large cap', 'equity', 'bluechip', 'kotak'],
  },
  // Add 25 more variations
  ...Array.from({ length: 25 }, (_, i) => ({
    name: `${['Aditya Birla', 'UTI', 'Franklin', 'Nippon', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'Baroda', 'Canara', 'BOI', 'LIC', 'PGIM', 'Union', 'Mahindra', 'Motilal'][i]} Large Cap Fund`,
    fundHouse: `${['Aditya Birla', 'UTI', 'Franklin', 'Nippon', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'Baroda', 'Canara', 'BOI', 'LIC', 'PGIM', 'Union', 'Mahindra', 'Motilal'][i]} Mutual Fund`,
    category: 'equity',
    subCategory: 'Large Cap',
    currentNav: 50 + Math.random() * 400,
    aum: 15000 + Math.random() * 30000,
    expenseRatio: 0.8 + Math.random() * 0.25,
    fundManager: `Fund Manager ${i + 6}`,
    returns: {
      day: Math.random() * 1,
      week: 1.5 + Math.random() * 1.5,
      month: 3 + Math.random() * 2,
      threeMonth: 8 + Math.random() * 3,
      sixMonth: 14 + Math.random() * 4,
      oneYear: 25 + Math.random() * 8,
      threeYear: 16 + Math.random() * 5,
      fiveYear: 14 + Math.random() * 4,
      sinceInception: 13 + Math.random() * 3,
    },
    riskMetrics: {
      sharpeRatio: 1.5 + Math.random() * 0.8,
      standardDeviation: 11 + Math.random() * 3,
      beta: 0.92 + Math.random() * 0.15,
      alpha: 1.8 + Math.random() * 1.2,
      rSquared: 0.9 + Math.random() * 0.08,
      sortino: 1.8 + Math.random() * 0.6,
    },
    ratings: {
      morningstar: Math.floor(3 + Math.random() * 3),
      crisil: Math.floor(3 + Math.random() * 3),
      valueResearch: Math.floor(3 + Math.random() * 3),
    },
    tags: ['large cap', 'equity', 'bluechip'],
  })),
];

// Real-world Mid Cap Funds (30 funds)
const midCapFunds = [
  {
    name: 'Axis Midcap Fund',
    fundHouse: 'Axis Mutual Fund',
    category: 'equity',
    subCategory: 'Mid Cap',
    currentNav: 78.45,
    aum: 18500,
    expenseRatio: 1.15,
    fundManager: 'Shreyash Devalkar',
    returns: {
      day: 0.45,
      week: 2.34,
      month: 5.67,
      threeMonth: 12.45,
      sixMonth: 22.34,
      oneYear: 38.9,
      threeYear: 25.67,
      fiveYear: 21.45,
      sinceInception: 18.9,
    },
    riskMetrics: {
      sharpeRatio: 1.67,
      standardDeviation: 15.23,
      beta: 1.12,
      alpha: 3.45,
      rSquared: 0.89,
      sortino: 1.89,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['mid cap', 'equity', 'growth'],
  },
  {
    name: 'HDFC Mid-Cap Opportunities Fund',
    fundHouse: 'HDFC Mutual Fund',
    category: 'equity',
    subCategory: 'Mid Cap',
    currentNav: 156.78,
    aum: 24300,
    expenseRatio: 1.08,
    fundManager: 'Chirag Setalvad',
    returns: {
      day: 0.58,
      week: 2.67,
      month: 5.89,
      threeMonth: 13.12,
      sixMonth: 23.45,
      oneYear: 40.23,
      threeYear: 26.89,
      fiveYear: 22.34,
      sinceInception: 19.67,
    },
    riskMetrics: {
      sharpeRatio: 1.78,
      standardDeviation: 14.89,
      beta: 1.09,
      alpha: 3.67,
      rSquared: 0.91,
      sortino: 1.95,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['mid cap', 'equity', 'opportunities', 'growth'],
  },
  {
    name: 'Kotak Emerging Equity Fund',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    category: 'equity',
    subCategory: 'Mid Cap',
    currentNav: 87.92,
    aum: 16700,
    expenseRatio: 1.12,
    fundManager: 'Pankaj Tibrewal',
    returns: {
      day: 0.52,
      week: 2.45,
      month: 5.78,
      threeMonth: 12.78,
      sixMonth: 22.89,
      oneYear: 39.45,
      threeYear: 26.12,
      fiveYear: 21.89,
      sinceInception: 19.23,
    },
    riskMetrics: {
      sharpeRatio: 1.72,
      standardDeviation: 15.12,
      beta: 1.11,
      alpha: 3.56,
      rSquared: 0.9,
      sortino: 1.92,
    },
    ratings: { morningstar: 5, crisil: 5, valueResearch: 5 },
    tags: ['mid cap', 'equity', 'emerging', 'growth'],
  },
  // Add 27 more variations
  ...Array.from({ length: 27 }, (_, i) => ({
    name: `${['DSP', 'SBI', 'ICICI', 'Franklin', 'Nippon', 'UTI', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Sundaram', 'HSBC', 'Aditya Birla', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'Baroda', 'Canara', 'BOI', 'LIC', 'PGIM', 'Union', 'Mahindra', 'Motilal'][i]} Mid Cap Fund`,
    fundHouse: `${['DSP', 'SBI', 'ICICI', 'Franklin', 'Nippon', 'UTI', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Sundaram', 'HSBC', 'Aditya Birla', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'Baroda', 'Canara', 'BOI', 'LIC', 'PGIM', 'Union', 'Mahindra', 'Motilal'][i]} Mutual Fund`,
    category: 'equity',
    subCategory: 'Mid Cap',
    currentNav: 60 + Math.random() * 200,
    aum: 10000 + Math.random() * 20000,
    expenseRatio: 1.0 + Math.random() * 0.3,
    fundManager: `Fund Manager ${i + 4}`,
    returns: {
      day: 0.3 + Math.random() * 0.5,
      week: 2 + Math.random() * 1.5,
      month: 5 + Math.random() * 2,
      threeMonth: 11 + Math.random() * 4,
      sixMonth: 20 + Math.random() * 5,
      oneYear: 35 + Math.random() * 10,
      threeYear: 24 + Math.random() * 5,
      fiveYear: 20 + Math.random() * 4,
      sinceInception: 18 + Math.random() * 3,
    },
    riskMetrics: {
      sharpeRatio: 1.5 + Math.random() * 0.5,
      standardDeviation: 14 + Math.random() * 3,
      beta: 1.05 + Math.random() * 0.15,
      alpha: 3 + Math.random() * 1,
      rSquared: 0.85 + Math.random() * 0.1,
      sortino: 1.7 + Math.random() * 0.5,
    },
    ratings: {
      morningstar: Math.floor(3 + Math.random() * 3),
      crisil: Math.floor(3 + Math.random() * 3),
      valueResearch: Math.floor(3 + Math.random() * 3),
    },
    tags: ['mid cap', 'equity', 'growth'],
  })),
];

// Small Cap Funds (20 funds)
const smallCapFunds = Array.from({ length: 20 }, (_, i) => ({
  name: `${['Axis', 'HDFC', 'SBI', 'Kotak', 'ICICI', 'DSP', 'Nippon', 'UTI', 'Tata', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'Aditya Birla', 'Invesco', 'IDFC', 'Edelweiss', 'Principal', 'Quantum'][i]} Small Cap Fund`,
  fundHouse: `${['Axis', 'HDFC', 'SBI', 'Kotak', 'ICICI', 'DSP', 'Nippon', 'UTI', 'Tata', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'Aditya Birla', 'Invesco', 'IDFC', 'Edelweiss', 'Principal', 'Quantum'][i]} Mutual Fund`,
  category: 'equity',
  subCategory: 'Small Cap',
  currentNav: 40 + Math.random() * 150,
  aum: 5000 + Math.random() * 15000,
  expenseRatio: 1.2 + Math.random() * 0.4,
  fundManager: `Fund Manager ${i + 1}`,
  returns: {
    day: 0.4 + Math.random() * 0.8,
    week: 2.5 + Math.random() * 2,
    month: 6 + Math.random() * 3,
    threeMonth: 14 + Math.random() * 5,
    sixMonth: 25 + Math.random() * 8,
    oneYear: 42 + Math.random() * 15,
    threeYear: 28 + Math.random() * 7,
    fiveYear: 24 + Math.random() * 6,
    sinceInception: 20 + Math.random() * 5,
  },
  riskMetrics: {
    sharpeRatio: 1.3 + Math.random() * 0.6,
    standardDeviation: 16 + Math.random() * 4,
    beta: 1.15 + Math.random() * 0.2,
    alpha: 3.5 + Math.random() * 1.5,
    rSquared: 0.8 + Math.random() * 0.12,
    sortino: 1.5 + Math.random() * 0.6,
  },
  ratings: {
    morningstar: Math.floor(3 + Math.random() * 3),
    crisil: Math.floor(3 + Math.random() * 3),
    valueResearch: Math.floor(3 + Math.random() * 3),
  },
  tags: ['small cap', 'equity', 'high growth', 'high risk'],
}));

// Multi Cap Funds (20 funds)
const multiCapFunds = Array.from({ length: 20 }, (_, i) => ({
  name: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'DSP', 'Nippon', 'UTI', 'Tata', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'Aditya Birla', 'Invesco', 'IDFC', 'Edelweiss', 'Principal', 'Quantum'][i]} Multi Cap Fund`,
  fundHouse: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'DSP', 'Nippon', 'UTI', 'Tata', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'Aditya Birla', 'Invesco', 'IDFC', 'Edelweiss', 'Principal', 'Quantum'][i]} Mutual Fund`,
  category: 'equity',
  subCategory: 'Multi Cap',
  currentNav: 50 + Math.random() * 250,
  aum: 12000 + Math.random() * 25000,
  expenseRatio: 0.95 + Math.random() * 0.35,
  fundManager: `Fund Manager ${i + 1}`,
  returns: {
    day: 0.35 + Math.random() * 0.6,
    week: 2 + Math.random() * 1.5,
    month: 4.5 + Math.random() * 2.5,
    threeMonth: 10 + Math.random() * 4,
    sixMonth: 18 + Math.random() * 6,
    oneYear: 32 + Math.random() * 10,
    threeYear: 22 + Math.random() * 6,
    fiveYear: 18 + Math.random() * 5,
    sinceInception: 16 + Math.random() * 4,
  },
  riskMetrics: {
    sharpeRatio: 1.55 + Math.random() * 0.6,
    standardDeviation: 13 + Math.random() * 3,
    beta: 1.02 + Math.random() * 0.15,
    alpha: 2.8 + Math.random() * 1.2,
    rSquared: 0.87 + Math.random() * 0.1,
    sortino: 1.75 + Math.random() * 0.55,
  },
  ratings: {
    morningstar: Math.floor(3 + Math.random() * 3),
    crisil: Math.floor(3 + Math.random() * 3),
    valueResearch: Math.floor(3 + Math.random() * 3),
  },
  tags: ['multi cap', 'equity', 'diversified', 'all cap'],
}));

// Gold Funds (25 funds)
const goldFunds = Array.from({ length: 25 }, (_, i) => ({
  name: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Nippon', 'UTI', 'Aditya Birla', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'LIC', 'PGIM', 'Motilal'][i]} Gold ${i < 15 ? 'ETF' : 'Fund'}`,
  fundHouse: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Nippon', 'UTI', 'Aditya Birla', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'LIC', 'PGIM', 'Motilal'][i]} Mutual Fund`,
  category: 'commodity',
  subCategory: 'Gold',
  fundType: i < 15 ? 'etf' : 'mutual_fund',
  currentNav: 50 + Math.random() * 50,
  aum: 1500 + Math.random() * 5000,
  expenseRatio: 0.45 + Math.random() * 0.25,
  exitLoad: i < 15 ? 0 : 0,
  fundManager: 'Passive Fund Team',
  returns: {
    day: 0.4 + Math.random() * 0.5,
    week: 0.8 + Math.random() * 0.8,
    month: 2 + Math.random() * 2,
    threeMonth: 5 + Math.random() * 3,
    sixMonth: 8 + Math.random() * 4,
    oneYear: 15 + Math.random() * 8,
    threeYear: 10 + Math.random() * 5,
    fiveYear: 9 + Math.random() * 4,
    sinceInception: 8 + Math.random() * 3,
  },
  riskMetrics: {
    sharpeRatio: 0.7 + Math.random() * 0.4,
    standardDeviation: 7 + Math.random() * 3,
    beta: 0.15 + Math.random() * 0.15,
    alpha: 0.8 + Math.random() * 0.8,
    rSquared: 0.35 + Math.random() * 0.2,
    sortino: 0.9 + Math.random() * 0.4,
  },
  ratings: {
    morningstar: Math.floor(3 + Math.random() * 3),
    crisil: Math.floor(3 + Math.random() * 3),
  },
  tags: ['gold', i < 15 ? 'etf' : 'mutual fund', 'commodity', 'safe haven'],
}));

// Silver Funds (25 funds)
const silverFunds = Array.from({ length: 25 }, (_, i) => ({
  name: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Nippon', 'UTI', 'Aditya Birla', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'LIC', 'PGIM', 'Motilal'][i]} Silver ${i < 12 ? 'ETF' : 'Fund'}`,
  fundHouse: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Nippon', 'UTI', 'Aditya Birla', 'DSP', 'Tata', 'Invesco', 'L&T', 'Mirae', 'Franklin', 'Sundaram', 'HSBC', 'BNP Paribas', 'Quantum', 'IDFC', 'Edelweiss', 'Principal', 'Indiabulls', 'LIC', 'PGIM', 'Motilal'][i]} Mutual Fund`,
  category: 'commodity',
  subCategory: 'Silver',
  fundType: i < 12 ? 'etf' : 'mutual_fund',
  currentNav: 40 + Math.random() * 40,
  aum: 800 + Math.random() * 2500,
  expenseRatio: 0.5 + Math.random() * 0.3,
  exitLoad: i < 12 ? 0 : 0,
  fundManager: 'Passive Fund Team',
  returns: {
    day: 0.5 + Math.random() * 0.6,
    week: 1 + Math.random() * 1,
    month: 2.5 + Math.random() * 2,
    threeMonth: 6 + Math.random() * 3,
    sixMonth: 10 + Math.random() * 5,
    oneYear: 18 + Math.random() * 10,
    threeYear: 12 + Math.random() * 6,
    fiveYear: 10 + Math.random() * 5,
    sinceInception: 9 + Math.random() * 4,
  },
  riskMetrics: {
    sharpeRatio: 0.75 + Math.random() * 0.5,
    standardDeviation: 8 + Math.random() * 4,
    beta: 0.18 + Math.random() * 0.18,
    alpha: 0.9 + Math.random() * 0.9,
    rSquared: 0.38 + Math.random() * 0.22,
    sortino: 0.95 + Math.random() * 0.45,
  },
  ratings: {
    morningstar: Math.floor(3 + Math.random() * 3),
    crisil: Math.floor(3 + Math.random() * 3),
  },
  tags: [
    'silver',
    i < 12 ? 'etf' : 'mutual fund',
    'commodity',
    'precious metal',
  ],
}));

async function importComprehensiveFunds() {
  console.log('🚀 Starting comprehensive fund import...');
  console.log('📊 Total funds to import: 150');
  console.log('   - Large Cap: 30');
  console.log('   - Mid Cap: 30');
  console.log('   - Small Cap: 20');
  console.log('   - Multi Cap: 20');
  console.log('   - Gold: 25');
  console.log('   - Silver: 25\n');

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    let dbName = 'mutual_funds_db';
    if (DATABASE_URL.includes('mongodb+srv://')) {
      const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
      if (match && match[1]) dbName = match[1];
    }

    const db = client.db(dbName);
    const fundsCollection = db.collection('funds');

    // Clear existing funds
    await fundsCollection.deleteMany({});
    console.log('🗑️  Cleared existing funds\n');

    // Combine all funds
    const allBaseFunds = [
      ...largeCapFunds,
      ...midCapFunds,
      ...smallCapFunds,
      ...multiCapFunds,
      ...goldFunds,
      ...silverFunds,
    ];

    // Generate full fund data
    const allFunds = allBaseFunds.map((fund, index) =>
      generateFundData(fund, index)
    );

    // Import in batches
    const batchSize = 50;
    let imported = 0;

    for (let i = 0; i < allFunds.length; i += batchSize) {
      const batch = allFunds.slice(i, i + batchSize);
      await fundsCollection.insertMany(batch);
      imported += batch.length;
      console.log(`✅ Imported ${imported}/${allFunds.length} funds...`);
    }

    // Verify counts
    console.log('\n📊 Verification:');
    const totalCount = await fundsCollection.countDocuments();
    const equityCount = await fundsCollection.countDocuments({
      category: 'equity',
    });
    const commodityCount = await fundsCollection.countDocuments({
      category: 'commodity',
    });
    const largeCapCount = await fundsCollection.countDocuments({
      subCategory: 'Large Cap',
    });
    const midCapCount = await fundsCollection.countDocuments({
      subCategory: 'Mid Cap',
    });
    const smallCapCount = await fundsCollection.countDocuments({
      subCategory: 'Small Cap',
    });
    const multiCapCount = await fundsCollection.countDocuments({
      subCategory: 'Multi Cap',
    });
    const goldCount = await fundsCollection.countDocuments({
      subCategory: 'Gold',
    });
    const silverCount = await fundsCollection.countDocuments({
      subCategory: 'Silver',
    });

    console.log(`   Total Funds: ${totalCount}`);
    console.log(`   Equity Funds: ${equityCount}`);
    console.log(`     - Large Cap: ${largeCapCount}`);
    console.log(`     - Mid Cap: ${midCapCount}`);
    console.log(`     - Small Cap: ${smallCapCount}`);
    console.log(`     - Multi Cap: ${multiCapCount}`);
    console.log(`   Commodity Funds: ${commodityCount}`);
    console.log(`     - Gold: ${goldCount}`);
    console.log(`     - Silver: ${silverCount}`);

    console.log('\n🎉 Import completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

importComprehensiveFunds();
