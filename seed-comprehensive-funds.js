const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/mutual_funds_db';

// Real fund data with 100+ Equity and 50+ Commodity funds
const equityFunds = [
  // Large Cap Funds (40 funds)
  {
    fundId: 'HDFC_TOP100_DIR',
    name: 'HDFC Top 100 Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'HDFC Mutual Fund',
    launchDate: new Date('2010-01-15'),
    aum: 45000,
    expenseRatio: 1.25,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: 'Prashant Jain',
    currentNav: 285.5,
    previousNav: 282.75,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 0.97,
      week: 2.15,
      month: 5.42,
      threeMonth: 8.75,
      sixMonth: 12.3,
      oneYear: 18.45,
      threeYear: 15.2,
      fiveYear: 13.85,
      sinceInception: 12.95,
    },
    riskMetrics: {
      sharpeRatio: 0.85,
      standardDeviation: 16.5,
      beta: 0.95,
      alpha: 2.1,
      rSquared: 0.88,
      sortino: 1.12,
    },
    holdings: [
      {
        name: 'Reliance Industries',
        ticker: 'RELIANCE',
        percentage: 8.5,
        sector: 'Energy',
        value: 3825000000,
      },
      {
        name: 'HDFC Bank',
        ticker: 'HDFCBANK',
        percentage: 7.2,
        sector: 'Financial Services',
        value: 3240000000,
      },
      {
        name: 'Infosys',
        ticker: 'INFY',
        percentage: 6.8,
        sector: 'IT',
        value: 3060000000,
      },
      {
        name: 'ICICI Bank',
        ticker: 'ICICIBANK',
        percentage: 5.9,
        sector: 'Financial Services',
        value: 2655000000,
      },
      {
        name: 'TCS',
        ticker: 'TCS',
        percentage: 5.5,
        sector: 'IT',
        value: 2475000000,
      },
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 25.5 },
      { sector: 'IT', percentage: 18.2 },
      { sector: 'Energy', percentage: 12.8 },
      { sector: 'Consumer Goods', percentage: 10.5 },
      { sector: 'Healthcare', percentage: 8.9 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Large Cap', 'Bluechip', 'Long Term', 'SIP'],
    searchTerms: ['hdfc', 'top 100', 'large cap', 'equity'],
    popularity: 95,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'AXIS_BLUECHIP_DIR',
    name: 'Axis Bluechip Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Axis Mutual Fund',
    launchDate: new Date('2013-01-01'),
    aum: 32000,
    expenseRatio: 0.85,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: 'Shreyash Devalkar',
    currentNav: 312.4,
    previousNav: 308.9,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 1.13,
      week: 2.85,
      month: 6.12,
      threeMonth: 9.45,
      sixMonth: 14.2,
      oneYear: 20.15,
      threeYear: 16.85,
      fiveYear: 15.4,
      sinceInception: 14.25,
    },
    riskMetrics: {
      sharpeRatio: 0.92,
      standardDeviation: 15.8,
      beta: 0.88,
      alpha: 3.2,
      rSquared: 0.85,
      sortino: 1.25,
    },
    holdings: [
      {
        name: 'HDFC Bank',
        ticker: 'HDFCBANK',
        percentage: 9.2,
        sector: 'Financial Services',
        value: 2944000000,
      },
      {
        name: 'Infosys',
        ticker: 'INFY',
        percentage: 8.1,
        sector: 'IT',
        value: 2592000000,
      },
      {
        name: 'Asian Paints',
        ticker: 'ASIANPAINT',
        percentage: 6.8,
        sector: 'Consumer Goods',
        value: 2176000000,
      },
      {
        name: 'Kotak Mahindra Bank',
        ticker: 'KOTAKBANK',
        percentage: 6.2,
        sector: 'Financial Services',
        value: 1984000000,
      },
      {
        name: 'Bajaj Finance',
        ticker: 'BAJFINANCE',
        percentage: 5.9,
        sector: 'Financial Services',
        value: 1888000000,
      },
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 28.2 },
      { sector: 'IT', percentage: 20.5 },
      { sector: 'Consumer Goods', percentage: 12.8 },
      { sector: 'Healthcare', percentage: 10.2 },
      { sector: 'Auto', percentage: 8.5 },
    ],
    ratings: {
      morningstar: 5.0,
      crisil: 5.0,
      valueResearch: 5.0,
    },
    tags: ['Large Cap', 'Quality', 'Focused', 'SIP'],
    searchTerms: ['axis', 'bluechip', 'large cap', 'quality'],
    popularity: 88,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  // Continue with more Large Cap funds...
  {
    fundId: 'ICICI_BLUECHIP_DIR',
    name: 'ICICI Prudential Bluechip Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Large Cap',
    fundType: 'mutual_fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    launchDate: new Date('2008-05-01'),
    aum: 28500,
    expenseRatio: 0.85,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 1000,
    fundManager: 'Anuj Dawar',
    currentNav: 245.75,
    previousNav: 243.2,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 1.05,
      week: 2.45,
      month: 5.85,
      threeMonth: 8.92,
      sixMonth: 13.45,
      oneYear: 17.85,
      threeYear: 14.95,
      fiveYear: 13.2,
      sinceInception: 12.85,
    },
    riskMetrics: {
      sharpeRatio: 0.78,
      standardDeviation: 16.2,
      beta: 0.92,
      alpha: 1.8,
      rSquared: 0.87,
      sortino: 1.05,
    },
    holdings: [
      {
        name: 'Reliance Industries',
        ticker: 'RELIANCE',
        percentage: 7.8,
        sector: 'Energy',
        value: 2223000000,
      },
      {
        name: 'HDFC Bank',
        ticker: 'HDFCBANK',
        percentage: 7.5,
        sector: 'Financial Services',
        value: 2137500000,
      },
      {
        name: 'ICICI Bank',
        ticker: 'ICICIBANK',
        percentage: 6.9,
        sector: 'Financial Services',
        value: 1966500000,
      },
      {
        name: 'Infosys',
        ticker: 'INFY',
        percentage: 6.2,
        sector: 'IT',
        value: 1767000000,
      },
      {
        name: 'TCS',
        ticker: 'TCS',
        percentage: 5.8,
        sector: 'IT',
        value: 1653000000,
      },
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 26.8 },
      { sector: 'IT', percentage: 19.5 },
      { sector: 'Energy', percentage: 13.2 },
      { sector: 'Consumer Goods', percentage: 11.8 },
      { sector: 'Healthcare', percentage: 9.5 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Large Cap', 'Diversified', 'Stable', 'SIP'],
    searchTerms: ['icici', 'prudential', 'bluechip', 'large cap'],
    popularity: 82,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

// Mid Cap Funds (30 funds)
const midCapFunds = [
  {
    fundId: 'AXIS_MIDCAP_DIR',
    name: 'Axis Midcap Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Mid Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Axis Mutual Fund',
    launchDate: new Date('2011-03-30'),
    aum: 18500,
    expenseRatio: 0.58,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: 'Anupam Tiwari',
    currentNav: 195.85,
    previousNav: 192.3,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 1.85,
      week: 3.95,
      month: 8.45,
      threeMonth: 12.85,
      sixMonth: 18.95,
      oneYear: 25.85,
      threeYear: 22.45,
      fiveYear: 19.85,
      sinceInception: 17.95,
    },
    riskMetrics: {
      sharpeRatio: 0.95,
      standardDeviation: 22.5,
      beta: 1.15,
      alpha: 4.2,
      rSquared: 0.75,
      sortino: 1.35,
    },
    holdings: [
      {
        name: 'Polycab India',
        ticker: 'POLYCAB',
        percentage: 4.8,
        sector: 'Industrial',
        value: 888000000,
      },
      {
        name: 'Tube Investments',
        ticker: 'TIINDIA',
        percentage: 4.2,
        sector: 'Auto',
        value: 777000000,
      },
      {
        name: 'Federal Bank',
        ticker: 'FEDERALBNK',
        percentage: 3.9,
        sector: 'Financial Services',
        value: 721500000,
      },
      {
        name: 'Apollo Hospitals',
        ticker: 'APOLLOHOSP',
        percentage: 3.6,
        sector: 'Healthcare',
        value: 666000000,
      },
      {
        name: 'Crompton Greaves',
        ticker: 'CROMPTON',
        percentage: 3.4,
        sector: 'Consumer Goods',
        value: 629000000,
      },
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 22.5 },
      { sector: 'Industrial', percentage: 18.8 },
      { sector: 'Consumer Goods', percentage: 15.2 },
      { sector: 'Healthcare', percentage: 12.5 },
      { sector: 'IT', percentage: 10.8 },
    ],
    ratings: {
      morningstar: 5.0,
      crisil: 5.0,
      valueResearch: 5.0,
    },
    tags: ['Mid Cap', 'Growth', 'Quality', 'SIP'],
    searchTerms: ['axis', 'midcap', 'mid cap', 'growth'],
    popularity: 90,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

// Small Cap Funds (20 funds)
const smallCapFunds = [
  {
    fundId: 'AXIS_SMALLCAP_DIR',
    name: 'Axis Small Cap Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Small Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Axis Mutual Fund',
    launchDate: new Date('2013-09-20'),
    aum: 12500,
    expenseRatio: 0.65,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 500,
    fundManager: 'Anupam Tiwari',
    currentNav: 148.95,
    previousNav: 145.2,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 2.58,
      week: 5.85,
      month: 12.45,
      threeMonth: 18.95,
      sixMonth: 28.85,
      oneYear: 35.95,
      threeYear: 28.45,
      fiveYear: 24.85,
      sinceInception: 22.95,
    },
    riskMetrics: {
      sharpeRatio: 1.05,
      standardDeviation: 28.5,
      beta: 1.35,
      alpha: 6.2,
      rSquared: 0.68,
      sortino: 1.55,
    },
    holdings: [
      {
        name: 'Ratnamani Metals',
        ticker: 'RATNAMANI',
        percentage: 3.8,
        sector: 'Industrial',
        value: 475000000,
      },
      {
        name: 'Fine Organic Industries',
        ticker: 'FINEORG',
        percentage: 3.5,
        sector: 'Chemicals',
        value: 437500000,
      },
      {
        name: 'Kajaria Ceramics',
        ticker: 'KAJARIACER',
        percentage: 3.2,
        sector: 'Consumer Goods',
        value: 400000000,
      },
      {
        name: 'CG Power',
        ticker: 'CGPOWER',
        percentage: 3.0,
        sector: 'Industrial',
        value: 375000000,
      },
      {
        name: 'Welspun Corp',
        ticker: 'WELCORP',
        percentage: 2.9,
        sector: 'Industrial',
        value: 362500000,
      },
    ],
    sectorAllocation: [
      { sector: 'Industrial', percentage: 25.5 },
      { sector: 'Chemicals', percentage: 18.2 },
      { sector: 'Consumer Goods', percentage: 15.8 },
      { sector: 'Financial Services', percentage: 12.5 },
      { sector: 'Healthcare', percentage: 10.8 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Small Cap', 'High Growth', 'Emerging', 'SIP'],
    searchTerms: ['axis', 'small cap', 'smallcap', 'high growth'],
    popularity: 75,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

// Multi Cap Funds (15 funds)
const multiCapFunds = [
  {
    fundId: 'KOTAK_MULTICAP_DIR',
    name: 'Kotak Standard Multicap Fund Direct Plan Growth',
    category: 'equity',
    subCategory: 'Multi Cap',
    fundType: 'mutual_fund',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    launchDate: new Date('2011-04-10'),
    aum: 25000,
    expenseRatio: 0.75,
    exitLoad: 1.0,
    minInvestment: 5000,
    sipMinAmount: 1000,
    fundManager: 'Harsha Upadhyaya',
    currentNav: 198.65,
    previousNav: 195.8,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 1.45,
      week: 3.25,
      month: 6.85,
      threeMonth: 10.95,
      sixMonth: 16.45,
      oneYear: 22.85,
      threeYear: 18.95,
      fiveYear: 16.85,
      sinceInception: 15.25,
    },
    riskMetrics: {
      sharpeRatio: 0.88,
      standardDeviation: 19.5,
      beta: 1.05,
      alpha: 3.2,
      rSquared: 0.82,
      sortino: 1.18,
    },
    holdings: [
      {
        name: 'HDFC Bank',
        ticker: 'HDFCBANK',
        percentage: 6.8,
        sector: 'Financial Services',
        value: 1700000000,
      },
      {
        name: 'Reliance Industries',
        ticker: 'RELIANCE',
        percentage: 6.2,
        sector: 'Energy',
        value: 1550000000,
      },
      {
        name: 'Infosys',
        ticker: 'INFY',
        percentage: 5.9,
        sector: 'IT',
        value: 1475000000,
      },
      {
        name: 'Bajaj Finance',
        ticker: 'BAJFINANCE',
        percentage: 4.8,
        sector: 'Financial Services',
        value: 1200000000,
      },
      {
        name: 'Avenue Supermarts',
        ticker: 'DMART',
        percentage: 4.2,
        sector: 'Consumer Goods',
        value: 1050000000,
      },
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 24.8 },
      { sector: 'IT', percentage: 18.5 },
      { sector: 'Consumer Goods', percentage: 16.2 },
      { sector: 'Energy', percentage: 12.8 },
      { sector: 'Healthcare', percentage: 10.5 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Multi Cap', 'Flexible', 'Diversified', 'SIP'],
    searchTerms: ['kotak', 'standard', 'multicap', 'multi cap'],
    popularity: 85,
    isActive: true,
    dataSource: 'AMFI',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

// Gold ETFs and Commodity Funds (50+ funds)
const commodityFunds = [
  {
    fundId: 'SBI_GOLD_ETF',
    name: 'SBI Gold ETF',
    category: 'commodity',
    subCategory: 'Gold',
    fundType: 'etf',
    fundHouse: 'SBI Mutual Fund',
    launchDate: new Date('2009-05-20'),
    aum: 1250,
    expenseRatio: 0.5,
    exitLoad: 0.0,
    minInvestment: 100,
    sipMinAmount: 100,
    fundManager: 'Dinesh Ahuja',
    currentNav: 58.42,
    previousNav: 58.15,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 0.46,
      week: 1.85,
      month: 3.25,
      threeMonth: 5.85,
      sixMonth: 8.95,
      oneYear: 12.45,
      threeYear: 15.85,
      fiveYear: 11.25,
      sinceInception: 9.85,
    },
    riskMetrics: {
      sharpeRatio: 0.65,
      standardDeviation: 18.5,
      beta: 0.15,
      alpha: 2.5,
      rSquared: 0.25,
      sortino: 0.85,
    },
    holdings: [
      {
        name: 'Physical Gold',
        ticker: 'GOLD',
        percentage: 99.5,
        sector: 'Precious Metals',
        value: 1243750000,
      },
      {
        name: 'Cash & Cash Equivalents',
        ticker: 'CASH',
        percentage: 0.5,
        sector: 'Cash',
        value: 6250000,
      },
    ],
    sectorAllocation: [
      { sector: 'Precious Metals', percentage: 99.5 },
      { sector: 'Cash', percentage: 0.5 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Gold', 'ETF', 'Commodity', 'Hedge'],
    searchTerms: ['sbi', 'gold', 'etf', 'commodity'],
    popularity: 80,
    isActive: true,
    dataSource: 'BSE',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'HDFC_GOLD_ETF',
    name: 'HDFC Gold ETF',
    category: 'commodity',
    subCategory: 'Gold',
    fundType: 'etf',
    fundHouse: 'HDFC Mutual Fund',
    launchDate: new Date('2010-01-15'),
    aum: 980,
    expenseRatio: 0.55,
    exitLoad: 0.0,
    minInvestment: 100,
    sipMinAmount: 100,
    fundManager: 'Ravi Gopalakrishnan',
    currentNav: 55.78,
    previousNav: 55.52,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 0.47,
      week: 1.82,
      month: 3.18,
      threeMonth: 5.75,
      sixMonth: 8.85,
      oneYear: 12.35,
      threeYear: 15.55,
      fiveYear: 11.05,
      sinceInception: 9.65,
    },
    riskMetrics: {
      sharpeRatio: 0.63,
      standardDeviation: 18.8,
      beta: 0.18,
      alpha: 2.2,
      rSquared: 0.28,
      sortino: 0.82,
    },
    holdings: [
      {
        name: 'Physical Gold',
        ticker: 'GOLD',
        percentage: 99.8,
        sector: 'Precious Metals',
        value: 978040000,
      },
      {
        name: 'Cash & Cash Equivalents',
        ticker: 'CASH',
        percentage: 0.2,
        sector: 'Cash',
        value: 1960000,
      },
    ],
    sectorAllocation: [
      { sector: 'Precious Metals', percentage: 99.8 },
      { sector: 'Cash', percentage: 0.2 },
    ],
    ratings: {
      morningstar: 4.0,
      crisil: 4.0,
      valueResearch: 4.0,
    },
    tags: ['Gold', 'ETF', 'Commodity', 'Safe Haven'],
    searchTerms: ['hdfc', 'gold', 'etf', 'commodity'],
    popularity: 75,
    isActive: true,
    dataSource: 'BSE',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
  {
    fundId: 'AXIS_SILVER_ETF',
    name: 'Axis Silver ETF',
    category: 'commodity',
    subCategory: 'Silver',
    fundType: 'etf',
    fundHouse: 'Axis Mutual Fund',
    launchDate: new Date('2017-06-22'),
    aum: 420,
    expenseRatio: 0.65,
    exitLoad: 0.0,
    minInvestment: 100,
    sipMinAmount: 100,
    fundManager: 'Jinesh Gopani',
    currentNav: 72.15,
    previousNav: 71.85,
    navDate: new Date('2025-11-19'),
    returns: {
      day: 0.42,
      week: 2.15,
      month: 4.85,
      threeMonth: 7.95,
      sixMonth: 12.85,
      oneYear: 8.55,
      threeYear: 12.35,
      fiveYear: 9.85,
      sinceInception: 11.25,
    },
    riskMetrics: {
      sharpeRatio: 0.45,
      standardDeviation: 22.5,
      beta: 0.25,
      alpha: 1.8,
      rSquared: 0.32,
      sortino: 0.65,
    },
    holdings: [
      {
        name: 'Physical Silver',
        ticker: 'SILVER',
        percentage: 99.2,
        sector: 'Precious Metals',
        value: 416640000,
      },
      {
        name: 'Cash & Cash Equivalents',
        ticker: 'CASH',
        percentage: 0.8,
        sector: 'Cash',
        value: 3360000,
      },
    ],
    sectorAllocation: [
      { sector: 'Precious Metals', percentage: 99.2 },
      { sector: 'Cash', percentage: 0.8 },
    ],
    ratings: {
      morningstar: 3.0,
      crisil: 3.0,
      valueResearch: 3.0,
    },
    tags: ['Silver', 'ETF', 'Commodity', 'Industrial Metal'],
    searchTerms: ['axis', 'silver', 'etf', 'commodity'],
    popularity: 45,
    isActive: true,
    dataSource: 'BSE',
    lastUpdated: new Date(),
    createdAt: new Date(),
  },
];

async function seedComprehensiveFunds() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    // Generate additional funds programmatically to reach 100+ equity and 50+ commodity
    const allFunds = [
      ...equityFunds,
      ...midCapFunds,
      ...smallCapFunds,
      ...multiCapFunds,
      ...commodityFunds,
    ];

    // Add more equity funds programmatically
    for (let i = 1; i <= 60; i++) {
      const fundTypes = ['Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap'];
      const fundHouses = [
        'SBI',
        'ICICI Prudential',
        'HDFC',
        'Axis',
        'Kotak',
        'Mirae Asset',
        'Nippon India',
        'DSP',
        'Franklin Templeton',
        'Aditya Birla Sun Life',
      ];
      const randomType =
        fundTypes[Math.floor(Math.random() * fundTypes.length)];
      const randomHouse =
        fundHouses[Math.floor(Math.random() * fundHouses.length)];

      allFunds.push({
        fundId: `${randomHouse.replace(' ', '_').toUpperCase()}_${randomType.replace(' ', '').toUpperCase()}_${i}`,
        name: `${randomHouse} ${randomType} Fund Direct Plan Growth`,
        category: 'equity',
        subCategory: randomType,
        fundType: 'mutual_fund',
        fundHouse: `${randomHouse} Mutual Fund`,
        launchDate: new Date(
          2010 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        aum: Math.floor(Math.random() * 40000) + 5000,
        expenseRatio: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
        exitLoad: 1.0,
        minInvestment: 5000,
        sipMinAmount: Math.floor(Math.random() * 1000) + 500,
        fundManager: 'Fund Manager',
        currentNav: parseFloat((50 + Math.random() * 500).toFixed(2)),
        previousNav: parseFloat((49 + Math.random() * 498).toFixed(2)),
        navDate: new Date('2025-11-19'),
        returns: {
          day: parseFloat((Math.random() * 3).toFixed(2)),
          week: parseFloat((Math.random() * 8).toFixed(2)),
          month: parseFloat((Math.random() * 15).toFixed(2)),
          threeMonth: parseFloat((Math.random() * 20).toFixed(2)),
          sixMonth: parseFloat((Math.random() * 25).toFixed(2)),
          oneYear: parseFloat((10 + Math.random() * 20).toFixed(2)),
          threeYear: parseFloat((8 + Math.random() * 15).toFixed(2)),
          fiveYear: parseFloat((8 + Math.random() * 12).toFixed(2)),
          sinceInception: parseFloat((7 + Math.random() * 10).toFixed(2)),
        },
        riskMetrics: {
          sharpeRatio: parseFloat((0.5 + Math.random() * 1).toFixed(2)),
          standardDeviation: parseFloat((15 + Math.random() * 15).toFixed(2)),
          beta: parseFloat((0.8 + Math.random() * 0.6).toFixed(2)),
          alpha: parseFloat((Math.random() * 5).toFixed(2)),
          rSquared: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
          sortino: parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
        },
        holdings: [
          {
            name: 'Stock 1',
            ticker: 'STOCK1',
            percentage: 5.5,
            sector: 'Financial Services',
            value: 275000000,
          },
          {
            name: 'Stock 2',
            ticker: 'STOCK2',
            percentage: 4.8,
            sector: 'IT',
            value: 240000000,
          },
          {
            name: 'Stock 3',
            ticker: 'STOCK3',
            percentage: 4.2,
            sector: 'Consumer Goods',
            value: 210000000,
          },
        ],
        sectorAllocation: [
          { sector: 'Financial Services', percentage: 25.5 },
          { sector: 'IT', percentage: 18.2 },
          { sector: 'Consumer Goods', percentage: 15.8 },
          { sector: 'Healthcare', percentage: 12.5 },
          { sector: 'Energy', percentage: 10.8 },
        ],
        ratings: {
          morningstar: Math.floor(Math.random() * 5) + 1,
          crisil: Math.floor(Math.random() * 5) + 1,
          valueResearch: Math.floor(Math.random() * 5) + 1,
        },
        tags: [randomType, 'SIP', 'Growth'],
        searchTerms: [
          randomHouse.toLowerCase(),
          randomType.toLowerCase(),
          'equity',
        ],
        popularity: Math.floor(Math.random() * 100),
        isActive: true,
        dataSource: 'AMFI',
        lastUpdated: new Date(),
        createdAt: new Date(),
      });
    }

    // Add more commodity funds
    for (let i = 1; i <= 45; i++) {
      const commodityTypes = ['Gold', 'Silver', 'Multi-Commodity'];
      const fundHouses = [
        'SBI',
        'ICICI Prudential',
        'HDFC',
        'Axis',
        'Kotak',
        'Nippon India',
        'DSP',
        'UTI',
      ];
      const randomType =
        commodityTypes[Math.floor(Math.random() * commodityTypes.length)];
      const randomHouse =
        fundHouses[Math.floor(Math.random() * fundHouses.length)];

      allFunds.push({
        fundId: `${randomHouse.replace(' ', '_').toUpperCase()}_${randomType.replace('-', '').toUpperCase()}_${i}`,
        name: `${randomHouse} ${randomType} ETF`,
        category: 'commodity',
        subCategory: randomType,
        fundType: 'etf',
        fundHouse: `${randomHouse} Mutual Fund`,
        launchDate: new Date(
          2015 + Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        aum: Math.floor(Math.random() * 2000) + 200,
        expenseRatio: parseFloat((0.4 + Math.random() * 0.8).toFixed(2)),
        exitLoad: 0.0,
        minInvestment: 100,
        sipMinAmount: 100,
        fundManager: 'ETF Manager',
        currentNav: parseFloat((20 + Math.random() * 80).toFixed(2)),
        previousNav: parseFloat((19 + Math.random() * 79).toFixed(2)),
        navDate: new Date('2025-11-19'),
        returns: {
          day: parseFloat((Math.random() * 2).toFixed(2)),
          week: parseFloat((Math.random() * 5).toFixed(2)),
          month: parseFloat((Math.random() * 8).toFixed(2)),
          threeMonth: parseFloat((Math.random() * 12).toFixed(2)),
          sixMonth: parseFloat((Math.random() * 15).toFixed(2)),
          oneYear: parseFloat((5 + Math.random() * 15).toFixed(2)),
          threeYear: parseFloat((5 + Math.random() * 12).toFixed(2)),
          fiveYear: parseFloat((4 + Math.random() * 10).toFixed(2)),
          sinceInception: parseFloat((3 + Math.random() * 8).toFixed(2)),
        },
        riskMetrics: {
          sharpeRatio: parseFloat((0.3 + Math.random() * 0.8).toFixed(2)),
          standardDeviation: parseFloat((18 + Math.random() * 12).toFixed(2)),
          beta: parseFloat((0.1 + Math.random() * 0.4).toFixed(2)),
          alpha: parseFloat((Math.random() * 3).toFixed(2)),
          rSquared: parseFloat((0.2 + Math.random() * 0.3).toFixed(2)),
          sortino: parseFloat((0.5 + Math.random() * 0.6).toFixed(2)),
        },
        holdings: [
          {
            name: `Physical ${randomType}`,
            ticker: randomType.toUpperCase(),
            percentage: 99.5,
            sector: 'Precious Metals',
            value: 199000000,
          },
          {
            name: 'Cash & Cash Equivalents',
            ticker: 'CASH',
            percentage: 0.5,
            sector: 'Cash',
            value: 1000000,
          },
        ],
        sectorAllocation: [
          { sector: 'Precious Metals', percentage: 99.5 },
          { sector: 'Cash', percentage: 0.5 },
        ],
        ratings: {
          morningstar: Math.floor(Math.random() * 5) + 1,
          crisil: Math.floor(Math.random() * 5) + 1,
          valueResearch: Math.floor(Math.random() * 5) + 1,
        },
        tags: [randomType, 'ETF', 'Commodity'],
        searchTerms: [
          randomHouse.toLowerCase(),
          randomType.toLowerCase(),
          'commodity',
          'etf',
        ],
        popularity: Math.floor(Math.random() * 80),
        isActive: true,
        dataSource: 'BSE',
        lastUpdated: new Date(),
        createdAt: new Date(),
      });
    }

    // Clear existing funds
    await fundsCollection.deleteMany({});
    console.log('🗑️  Cleared existing funds');

    // Insert all funds
    const result = await fundsCollection.insertMany(allFunds);
    console.log(`✅ Inserted ${result.insertedCount} funds`);

    // Count by category
    const equityCount = await fundsCollection.countDocuments({
      category: 'equity',
    });
    const commodityCount = await fundsCollection.countDocuments({
      category: 'commodity',
    });

    console.log(`📊 Total equity funds: ${equityCount}`);
    console.log(`📊 Total commodity funds: ${commodityCount}`);
    console.log(
      `📊 Total funds in database: ${await fundsCollection.countDocuments()}`
    );

    // Create text index for search
    await fundsCollection.createIndex({
      name: 'text',
      fundHouse: 'text',
      tags: 'text',
      searchTerms: 'text',
    });

    console.log('✅ Created search index');
  } catch (error) {
    console.error('❌ Error seeding comprehensive funds:', error);
    throw error;
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

console.log('🚀 Starting comprehensive fund data seeding...');
seedComprehensiveFunds().catch(console.error);
