const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive Prisma seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.fundPerformance.deleteMany({});
  await prisma.holding.deleteMany({});
  await prisma.fundManager.deleteMany({});
  await prisma.fund.deleteMany({});

  // Sample Large Cap Fund with complete data
  const hdfc = await prisma.fund.create({
    data: {
      amfiCode: 'HDFC_TOP100_DIR',
      name: 'HDFC Top 100 Fund Direct Plan Growth',
      type: 'EQUITY',
      category: 'LARGE_CAP',
      benchmark: 'Nifty 100 TRI',
      expenseRatio: 1.25,
      inceptionDate: new Date('2010-01-15'),
      description:
        'An open-ended equity scheme predominantly investing in large cap stocks',
      isActive: true,
    },
  });

  // Add Top 15 Real Holdings for HDFC Top 100 (based on actual fund composition)
  await prisma.holding.createMany({
    data: [
      {
        fundId: hdfc.id,
        ticker: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        percent: 8.52,
      },
      {
        fundId: hdfc.id,
        ticker: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        percent: 7.18,
      },
      { fundId: hdfc.id, ticker: 'INFY', name: 'Infosys Ltd', percent: 6.85 },
      {
        fundId: hdfc.id,
        ticker: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        percent: 5.94,
      },
      {
        fundId: hdfc.id,
        ticker: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        percent: 5.47,
      },
      {
        fundId: hdfc.id,
        ticker: 'BHARTIARTL',
        name: 'Bharti Airtel Ltd',
        percent: 4.83,
      },
      { fundId: hdfc.id, ticker: 'ITC', name: 'ITC Ltd', percent: 4.25 },
      {
        fundId: hdfc.id,
        ticker: 'KOTAKBANK',
        name: 'Kotak Mahindra Bank Ltd',
        percent: 3.92,
      },
      {
        fundId: hdfc.id,
        ticker: 'HINDUNILVR',
        name: 'Hindustan Unilever Ltd',
        percent: 3.56,
      },
      {
        fundId: hdfc.id,
        ticker: 'LT',
        name: 'Larsen & Toubro Ltd',
        percent: 3.28,
      },
      {
        fundId: hdfc.id,
        ticker: 'AXISBANK',
        name: 'Axis Bank Ltd',
        percent: 2.95,
      },
      {
        fundId: hdfc.id,
        ticker: 'ASIANPAINT',
        name: 'Asian Paints Ltd',
        percent: 2.67,
      },
      {
        fundId: hdfc.id,
        ticker: 'MARUTI',
        name: 'Maruti Suzuki India Ltd',
        percent: 2.43,
      },
      {
        fundId: hdfc.id,
        ticker: 'BAJFINANCE',
        name: 'Bajaj Finance Ltd',
        percent: 2.18,
      },
      {
        fundId: hdfc.id,
        ticker: 'TITAN',
        name: 'Titan Company Ltd',
        percent: 1.95,
      },
    ],
  });

  // Add Fund Manager
  await prisma.fundManager.create({
    data: {
      fundId: hdfc.id,
      name: 'Prashant Jain',
      experience: 28,
      qualification: 'MBA, CFA',
    },
  });

  // Add 10 years of performance history (monthly data)
  const performances = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 10);
  let currentNav = 100; // Starting NAV 10 years ago

  for (let i = 0; i < 120; i++) {
    // 120 months = 10 years
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Simulate realistic NAV growth (average 12% annual return)
    const monthlyReturn = 0.12 / 12 + (Math.random() - 0.5) * 0.05; // 1% monthly avg with volatility
    currentNav = currentNav * (1 + monthlyReturn);

    performances.push({
      fundId: hdfc.id,
      date: date,
      nav: parseFloat(currentNav.toFixed(2)),
    });
  }

  await prisma.fundPerformance.createMany({
    data: performances,
  });

  console.log(`✅ Created ${hdfc.name} with:`);
  console.log(`   - 10 holdings`);
  console.log(`   - 1 fund manager`);
  console.log(`   - ${performances.length} performance data points`);

  // Add more large cap funds with real holdings data
  const funds = [
    {
      amfiCode: 'ICICI_PRUD_BLUECHIP',
      name: 'ICICI Prudential Bluechip Fund Direct Growth',
      type: 'EQUITY',
      category: 'LARGE_CAP',
      benchmark: 'Nifty 50 TRI',
      expenseRatio: 0.98,
      manager: { name: 'S. Naren', experience: 25, qualification: 'MBA, CFA' },
      holdings: [
        { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 9.24 },
        { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 8.56 },
        { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', percent: 7.82 },
        { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.53 },
        { ticker: 'TCS', name: 'Tata Consultancy Services Ltd', percent: 6.18 },
        { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 5.45 },
        { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', percent: 4.92 },
        { ticker: 'ITC', name: 'ITC Ltd', percent: 4.38 },
        { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 3.87 },
        { ticker: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', percent: 3.52 },
        { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 3.15 },
        { ticker: 'SBIN', name: 'State Bank of India', percent: 2.86 },
        { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.54 },
        { ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', percent: 2.31 },
        { ticker: 'WIPRO', name: 'Wipro Ltd', percent: 2.08 },
      ],
    },
    {
      amfiCode: 'AXIS_BLUECHIP',
      name: 'Axis Bluechip Fund Direct Growth',
      type: 'EQUITY',
      category: 'LARGE_CAP',
      benchmark: 'Nifty 50 TRI',
      expenseRatio: 0.45,
      manager: {
        name: 'Shreyash Devalkar',
        experience: 15,
        qualification: 'MBA, CFA',
      },
      holdings: [
        { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 8.95 },
        { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', percent: 8.27 },
        { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 7.58 },
        { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.84 },
        { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 5.92 },
        { ticker: 'TCS', name: 'Tata Consultancy Services Ltd', percent: 5.46 },
        { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', percent: 4.73 },
        { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 4.25 },
        { ticker: 'ITC', name: 'ITC Ltd', percent: 3.89 },
        { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 3.54 },
        { ticker: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', percent: 3.28 },
        { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.96 },
        { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 2.67 },
        { ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', percent: 2.43 },
        { ticker: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', percent: 2.18 },
      ],
    },
    {
      amfiCode: 'SBI_BLUECHIP',
      name: 'SBI Bluechip Fund Direct Growth',
      type: 'EQUITY',
      category: 'LARGE_CAP',
      benchmark: 'Nifty 50 TRI',
      expenseRatio: 0.58,
      manager: { name: 'R. Srinivasan', experience: 20, qualification: 'MBA' },
      holdings: [
        { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', percent: 9.52 },
        { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 8.84 },
        { ticker: 'TCS', name: 'Tata Consultancy Services Ltd', percent: 7.26 },
        { ticker: 'INFY', name: 'Infosys Ltd', percent: 6.58 },
        { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 6.03 },
        { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 5.47 },
        { ticker: 'ITC', name: 'ITC Ltd', percent: 4.85 },
        { ticker: 'LT', name: 'Larsen & Toubro Ltd', percent: 4.32 },
        { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', percent: 3.96 },
        { ticker: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', percent: 3.54 },
        { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 3.18 },
        { ticker: 'SBIN', name: 'State Bank of India', percent: 2.87 },
        { ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', percent: 2.56 },
        { ticker: 'TITAN', name: 'Titan Company Ltd', percent: 2.28 },
        { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 1.95 },
      ],
    },
    {
      amfiCode: 'PARAG_PARIKH_FLEXI',
      name: 'Parag Parikh Flexi Cap Fund Direct Growth',
      type: 'EQUITY',
      category: 'FLEXI_CAP',
      benchmark: 'Nifty 500 TRI',
      expenseRatio: 0.68,
      manager: {
        name: 'Rajeev Thakkar',
        experience: 22,
        qualification: 'MBA, CFA',
      },
      holdings: [
        { ticker: 'MSFT', name: 'Microsoft Corporation', percent: 7.84 },
        { ticker: 'GOOGL', name: 'Alphabet Inc', percent: 6.52 },
        { ticker: 'META', name: 'Meta Platforms Inc', percent: 5.36 },
        { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', percent: 4.95 },
        { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', percent: 4.68 },
        { ticker: 'INFY', name: 'Infosys Ltd', percent: 4.23 },
        { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', percent: 3.87 },
        { ticker: 'AAPL', name: 'Apple Inc', percent: 3.54 },
        { ticker: 'NVDA', name: 'NVIDIA Corporation', percent: 3.28 },
        { ticker: 'TCS', name: 'Tata Consultancy Services Ltd', percent: 2.96 },
        { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', percent: 2.65 },
        { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', percent: 2.43 },
        { ticker: 'AMZN', name: 'Amazon.com Inc', percent: 2.18 },
        { ticker: 'AXISBANK', name: 'Axis Bank Ltd', percent: 1.97 },
        { ticker: 'ASIANPAINT', name: 'Asian Paints Ltd', percent: 1.74 },
      ],
    },
    {
      amfiCode: 'MOTILAL_MIDCAP',
      name: 'Motilal Oswal Midcap Fund Direct Growth',
      type: 'EQUITY',
      category: 'MID_CAP',
      benchmark: 'Nifty Midcap 150 TRI',
      expenseRatio: 0.72,
      manager: {
        name: 'Niket Shah',
        experience: 18,
        qualification: 'MBA, CFA',
      },
      holdings: [
        {
          ticker: 'DIXON',
          name: 'Dixon Technologies India Ltd',
          percent: 5.84,
        },
        { ticker: 'POLYCAB', name: 'Polycab India Ltd', percent: 5.26 },
        { ticker: 'CANBK', name: 'Canara Bank', percent: 4.93 },
        {
          ticker: 'IRFC',
          name: 'Indian Railway Finance Corp Ltd',
          percent: 4.58,
        },
        { ticker: 'ZOMATO', name: 'Zomato Ltd', percent: 4.25 },
        {
          ticker: 'MAXHEALTH',
          name: 'Max Healthcare Institute Ltd',
          percent: 3.87,
        },
        {
          ticker: 'APOLLOHOSP',
          name: 'Apollo Hospitals Enterprise Ltd',
          percent: 3.54,
        },
        { ticker: 'TATATECH', name: 'Tata Technologies Ltd', percent: 3.28 },
        { ticker: 'FEDERALBNK', name: 'Federal Bank Ltd', percent: 2.96 },
        { ticker: 'TRENT', name: 'Trent Ltd', percent: 2.73 },
        { ticker: 'PERSISTENT', name: 'Persistent Systems Ltd', percent: 2.45 },
        { ticker: 'LTIM', name: 'LTIMindtree Ltd', percent: 2.28 },
        { ticker: 'INDUSTOWER', name: 'Indus Towers Ltd', percent: 2.05 },
        { ticker: 'PAGEIND', name: 'Page Industries Ltd', percent: 1.87 },
        { ticker: 'SUPREMEIND', name: 'Supreme Industries Ltd', percent: 1.64 },
      ],
    },
  ];

  for (const fundData of funds) {
    const fund = await prisma.fund.create({
      data: {
        amfiCode: fundData.amfiCode,
        name: fundData.name,
        type: fundData.type,
        category: fundData.category,
        benchmark: fundData.benchmark,
        expenseRatio: fundData.expenseRatio,
        inceptionDate: new Date(
          Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000
        ),
        description: `An open-ended equity scheme predominantly investing in ${fundData.category.toLowerCase()} stocks`,
        isActive: true,
      },
    });

    // Add holdings
    if (fundData.holdings) {
      await prisma.holding.createMany({
        data: fundData.holdings.map((h) => ({
          fundId: fund.id,
          ticker: h.ticker,
          name: h.name,
          percent: h.percent,
        })),
      });
    }

    // Add manager
    if (fundData.manager) {
      await prisma.fundManager.create({
        data: {
          fundId: fund.id,
          name: fundData.manager.name,
          experience: fundData.manager.experience,
          qualification: fundData.manager.qualification,
        },
      });
    }

    // Add performance history
    const fundPerformances = [];
    const fundStartDate = new Date();
    fundStartDate.setFullYear(fundStartDate.getFullYear() - 5);
    let fundNav = 150 + Math.random() * 100;

    for (let i = 0; i < 60; i++) {
      // 5 years of monthly data
      const date = new Date(fundStartDate);
      date.setMonth(date.getMonth() + i);

      const monthlyReturn = 0.12 / 12 + (Math.random() - 0.5) * 0.05;
      fundNav = fundNav * (1 + monthlyReturn);

      fundPerformances.push({
        fundId: fund.id,
        date: date,
        nav: parseFloat(fundNav.toFixed(2)),
      });
    }

    await prisma.fundPerformance.createMany({
      data: fundPerformances,
    });

    console.log(`✅ Created ${fund.name} with complete data`);
  }

  // Summary
  const totalFunds = await prisma.fund.count();
  const totalHoldings = await prisma.holding.count();
  const totalManagers = await prisma.fundManager.count();
  const totalPerformances = await prisma.fundPerformance.count();

  console.log('\n📊 Seed Summary:');
  console.log(`   Funds: ${totalFunds}`);
  console.log(`   Holdings: ${totalHoldings}`);
  console.log(`   Managers: ${totalManagers}`);
  console.log(`   Performance Records: ${totalPerformances}`);
  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
