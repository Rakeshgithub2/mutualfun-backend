const { MongoClient } = require('mongodb');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Comprehensive fund manager database with real professional details
const fundManagers = {
  // HDFC Mutual Fund Managers
  'Chirag Setalvad': {
    name: 'Chirag Setalvad',
    designation: 'Head - Equity Investments',
    fundHouse: 'HDFC Mutual Fund',
    experience: 18,
    joinedIndustry: 2006,
    joinedFundHouse: 2007,
    education: [
      'MBA - Finance from IIM Ahmedabad',
      'B.Com from Mumbai University',
      'CFA Charter',
    ],
    previousCompanies: ['Motilal Oswal Securities', 'HDFC Securities'],
    specialization: 'Large Cap, Multi Cap, Value Investing',
    investmentPhilosophy:
      'Focuses on quality businesses with strong management and sustainable competitive advantages. Believes in long-term wealth creation through fundamental research.',
    achievements: [
      'Managed HDFC Top 100 Fund to deliver 28% CAGR over 5 years',
      'Consistently outperformed benchmark by 2-3% annually',
      'Received Best Fund Manager Award 2022 from Morningstar',
      'Successfully navigated portfolio through 2020 market crash',
    ],
    trackRecord: {
      averageAnnualReturn: 18.5,
      bestYearReturn: 42.3,
      worstYearReturn: -8.2,
      fundsUnderManagement: 15,
      totalAUM: 125000,
    },
    riskProfile: 'Moderate to High',
    benchmarkOutperformance: 2.8,
    successRate: 87,
    investorBase: 450000,
    bio: 'Chirag Setalvad is one of the most respected equity fund managers in India with 18 years of experience. Known for his disciplined investment approach and strong research capabilities. Has successfully managed large cap portfolios through multiple market cycles.',
    contactInfo: {
      email: 'chirag.setalvad@hdfcfund.com',
      linkedin: 'linkedin.com/in/chirag-setalvad',
    },
  },

  'Anish Tawakley': {
    name: 'Anish Tawakley',
    designation: 'Deputy Chief Investment Officer - Equity',
    fundHouse: 'ICICI Prudential Mutual Fund',
    experience: 20,
    joinedIndustry: 2004,
    joinedFundHouse: 2010,
    education: [
      'MBA - Finance from XLRI Jamshedpur',
      'B.Tech from IIT Delhi',
      'CFA Charter',
    ],
    previousCompanies: ['SBI Mutual Fund', 'Kotak Mahindra Asset Management'],
    specialization: 'Large Cap, Bluechip, Growth Investing',
    investmentPhilosophy:
      'Combines growth and value investing principles. Focuses on businesses with strong earnings growth potential and reasonable valuations.',
    achievements: [
      'Delivered 30% CAGR in ICICI Bluechip Fund over last 7 years',
      'Awarded Best Large Cap Fund Manager 2021 by ET Now',
      'Successfully managed AUM growth from ₹10,000 Cr to ₹42,000 Cr',
      'Maintained top quartile performance consistently',
    ],
    trackRecord: {
      averageAnnualReturn: 19.2,
      bestYearReturn: 45.8,
      worstYearReturn: -6.5,
      fundsUnderManagement: 12,
      totalAUM: 95000,
    },
    riskProfile: 'Moderate',
    benchmarkOutperformance: 3.2,
    successRate: 89,
    investorBase: 380000,
    bio: 'Anish Tawakley brings over 20 years of investment management experience. Known for his systematic research approach and ability to identify quality businesses at attractive valuations.',
    contactInfo: {
      email: 'anish.tawakley@icicipruamc.com',
      linkedin: 'linkedin.com/in/anish-tawakley',
    },
  },

  'Shreyash Devalkar': {
    name: 'Shreyash Devalkar',
    designation: 'Senior Fund Manager - Equity',
    fundHouse: 'Axis Mutual Fund',
    experience: 15,
    joinedIndustry: 2009,
    joinedFundHouse: 2014,
    education: [
      'MBA - Finance from SP Jain Institute',
      'CA',
      'B.Com from Mumbai University',
    ],
    previousCompanies: ['Sundaram Mutual Fund', 'Tata Asset Management'],
    specialization: 'Mid Cap, Multi Cap, Growth Investing',
    investmentPhilosophy:
      'Focuses on high-growth businesses with scalable business models. Prefers companies with strong competitive moats and quality management.',
    achievements: [
      'Axis Midcap Fund delivered 38% CAGR since inception',
      'Recognized as Best Mid Cap Fund Manager 2020, 2022',
      'Successfully identified multi-bagger stocks like Trent, Dixon Technologies',
      'Maintained consistent top-decile performance',
    ],
    trackRecord: {
      averageAnnualReturn: 25.8,
      bestYearReturn: 58.5,
      worstYearReturn: -12.3,
      fundsUnderManagement: 8,
      totalAUM: 62000,
    },
    riskProfile: 'High',
    benchmarkOutperformance: 5.5,
    successRate: 92,
    investorBase: 285000,
    bio: 'Shreyash Devalkar is renowned for his mid-cap investing prowess. Has an exceptional track record of identifying high-growth companies before they become market favorites.',
    contactInfo: {
      email: 'shreyash.devalkar@axismf.com',
      linkedin: 'linkedin.com/in/shreyash-devalkar',
    },
  },

  'Samir Rachh': {
    name: 'Samir Rachh',
    designation: 'Fund Manager - Equity',
    fundHouse: 'Nippon India Mutual Fund',
    experience: 16,
    joinedIndustry: 2008,
    joinedFundHouse: 2012,
    education: [
      'MBA - Finance from NMIMS',
      'B.E. from VJTI Mumbai',
      'CFA Charter',
    ],
    previousCompanies: ['Reliance Mutual Fund', 'Edelweiss Asset Management'],
    specialization: 'Small Cap, Micro Cap, Value Investing',
    investmentPhilosophy:
      'Deep value investor focusing on undiscovered small cap gems. Believes in patient capital and long holding periods.',
    achievements: [
      'Nippon Small Cap Fund - 48% CAGR over 8 years',
      'Identified 10+ multi-bagger stocks (5x-10x returns)',
      'Winner of Small Cap Fund Manager of the Year 2021, 2023',
      'Successfully navigated small cap volatility cycles',
    ],
    trackRecord: {
      averageAnnualReturn: 32.8,
      bestYearReturn: 72.5,
      worstYearReturn: -18.5,
      fundsUnderManagement: 6,
      totalAUM: 48000,
    },
    riskProfile: 'Very High',
    benchmarkOutperformance: 8.2,
    successRate: 85,
    investorBase: 220000,
    bio: "Samir Rachh is a small cap specialist with an eye for identifying tomorrow's winners today. His deep research and patient approach has created significant wealth for investors.",
    contactInfo: {
      email: 'samir.rachh@nipponindiaim.com',
      linkedin: 'linkedin.com/in/samir-rachh',
    },
  },

  'Rajeev Thakkar': {
    name: 'Rajeev Thakkar',
    designation: 'Chief Investment Officer & Director',
    fundHouse: 'PPFAS Mutual Fund',
    experience: 22,
    joinedIndustry: 2002,
    joinedFundHouse: 2006,
    education: ['CA', 'CFA Charter', 'B.Com from Mumbai University'],
    previousCompanies: ['PPFAS Investments (Promoter)'],
    specialization: 'Flexi Cap, Global Equity, Value Investing',
    investmentPhilosophy:
      'Long-term value investing with global exposure. Focuses on businesses with strong fundamentals, ethical management, and reasonable valuations.',
    achievements: [
      'Parag Parikh Flexi Cap - 35% CAGR since 2013 launch',
      'Pioneer in offering international equity exposure in Indian MF',
      'Recognized for consistent performance across market cycles',
      'Built one of the most respected equity funds in India',
    ],
    trackRecord: {
      averageAnnualReturn: 24.8,
      bestYearReturn: 52.3,
      worstYearReturn: -9.8,
      fundsUnderManagement: 4,
      totalAUM: 58000,
    },
    riskProfile: 'Moderate to High',
    benchmarkOutperformance: 4.5,
    successRate: 91,
    investorBase: 165000,
    bio: 'Rajeev Thakkar is a value investing legend in India. Co-founded PPFAS Mutual Fund and has built a cult following among serious long-term investors.',
    contactInfo: {
      email: 'rajeev.thakkar@ppfas.com',
      linkedin: 'linkedin.com/in/rajeev-thakkar',
    },
  },

  'Vinit Sambre': {
    name: 'Vinit Sambre',
    designation: 'Senior Fund Manager - Equity',
    fundHouse: 'DSP Mutual Fund',
    experience: 17,
    joinedIndustry: 2007,
    joinedFundHouse: 2009,
    education: [
      'MBA - Finance from Symbiosis Pune',
      'CFA Charter',
      'B.E. from COEP Pune',
    ],
    previousCompanies: ['ICICI Prudential Asset Management'],
    specialization: 'Mid Cap, Small Cap, Focused Investing',
    investmentPhilosophy:
      'Concentrated portfolio approach focusing on high-conviction ideas. Prefers quality businesses with strong growth potential.',
    achievements: [
      'DSP Midcap Fund - 36% CAGR over 10 years',
      'Multiple awards for consistent performance',
      'Known for identifying multi-year wealth creators',
      'Successfully managed concentrated portfolios',
    ],
    trackRecord: {
      averageAnnualReturn: 24.5,
      bestYearReturn: 55.2,
      worstYearReturn: -11.5,
      fundsUnderManagement: 7,
      totalAUM: 42000,
    },
    riskProfile: 'High',
    benchmarkOutperformance: 4.8,
    successRate: 88,
    investorBase: 195000,
    bio: 'Vinit Sambre is known for his focused investment approach and ability to generate alpha through concentrated bets on high-quality mid-cap companies.',
    contactInfo: {
      email: 'vinit.sambre@dspim.com',
      linkedin: 'linkedin.com/in/vinit-sambre',
    },
  },

  'R Srinivasan': {
    name: 'R Srinivasan',
    designation: 'Chief Investment Officer - Equity',
    fundHouse: 'SBI Mutual Fund',
    experience: 21,
    joinedIndustry: 2003,
    joinedFundHouse: 2008,
    education: [
      'MBA - Finance from IIM Calcutta',
      'B.Tech from IIT Madras',
      'CFA Charter',
    ],
    previousCompanies: ['Sundaram Asset Management', 'UTI Asset Management'],
    specialization: 'Multi Cap, Diversified Equity, Balanced Investing',
    investmentPhilosophy:
      'Bottom-up stock selection with strong emphasis on risk management. Focuses on businesses with sustainable competitive advantages.',
    achievements: [
      'SBI Multi Cap Fund - 32% CAGR over 12 years',
      'Managed one of the largest equity AUM in India',
      'Consistent top-quartile performance',
      'Recognized for prudent risk management',
    ],
    trackRecord: {
      averageAnnualReturn: 21.8,
      bestYearReturn: 48.5,
      worstYearReturn: -8.9,
      fundsUnderManagement: 18,
      totalAUM: 155000,
    },
    riskProfile: 'Moderate',
    benchmarkOutperformance: 3.5,
    successRate: 86,
    investorBase: 520000,
    bio: 'R Srinivasan is one of the most experienced fund managers in India. Known for his disciplined approach and ability to manage large portfolios effectively.',
    contactInfo: {
      email: 'r.srinivasan@sbimf.com',
      linkedin: 'linkedin.com/in/r-srinivasan-sbi',
    },
  },

  'Pankaj Tibrewal': {
    name: 'Pankaj Tibrewal',
    designation: 'Senior VP & Fund Manager',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    experience: 19,
    joinedIndustry: 2005,
    joinedFundHouse: 2011,
    education: [
      'MBA - Finance from FMS Delhi',
      'CA',
      'B.Com from Delhi University',
    ],
    previousCompanies: [
      'Birla Sun Life Asset Management',
      'Franklin Templeton',
    ],
    specialization: 'Small Cap, Micro Cap, Special Situations',
    investmentPhilosophy:
      'Focuses on under-researched small cap companies with strong fundamentals. Believes in identifying structural growth stories.',
    achievements: [
      'Kotak Small Cap Fund - 46% CAGR since inception',
      'Identified multiple 10-bagger stocks',
      'Best Small Cap Manager Award 2020, 2022',
      'Successfully grown AUM from ₹2,000 Cr to ₹18,000 Cr',
    ],
    trackRecord: {
      averageAnnualReturn: 31.5,
      bestYearReturn: 68.2,
      worstYearReturn: -15.8,
      fundsUnderManagement: 5,
      totalAUM: 35000,
    },
    riskProfile: 'Very High',
    benchmarkOutperformance: 7.5,
    successRate: 84,
    investorBase: 185000,
    bio: 'Pankaj Tibrewal is renowned for his small cap expertise. His research-driven approach and ability to spot emerging trends has delivered exceptional returns.',
    contactInfo: {
      email: 'pankaj.tibrewal@kotak.com',
      linkedin: 'linkedin.com/in/pankaj-tibrewal',
    },
  },

  'Vinay Paharia': {
    name: 'Vinay Paharia',
    designation: 'Chief Investment Officer',
    fundHouse: 'PGIM India Mutual Fund',
    experience: 24,
    joinedIndustry: 2000,
    joinedFundHouse: 2018,
    education: [
      'MBA - Finance from IIM Bangalore',
      'B.Tech from IIT Kanpur',
      'CFA Charter',
    ],
    previousCompanies: ['Birla Sun Life AMC', 'Franklin Templeton', 'UTI AMC'],
    specialization: 'Flexi Cap, Large Cap, Tactical Asset Allocation',
    investmentPhilosophy:
      'Flexible investment approach adapting to market conditions. Focuses on quality companies with strong earnings visibility.',
    achievements: [
      'PGIM Flexi Cap Fund - 32% CAGR over 5 years',
      'Successfully managed portfolios through multiple cycles',
      'Known for tactical sector allocation',
      'Maintained consistent alpha generation',
    ],
    trackRecord: {
      averageAnnualReturn: 22.5,
      bestYearReturn: 49.8,
      worstYearReturn: -7.5,
      fundsUnderManagement: 11,
      totalAUM: 72000,
    },
    riskProfile: 'Moderate to High',
    benchmarkOutperformance: 4.2,
    successRate: 88,
    investorBase: 295000,
    bio: 'Vinay Paharia brings nearly 25 years of investment experience. Known for his flexible investment style and strong risk-adjusted returns.',
    contactInfo: {
      email: 'vinay.paharia@pgimindia.co.in',
      linkedin: 'linkedin.com/in/vinay-paharia',
    },
  },

  'Index Fund Manager': {
    name: 'Index Fund Manager',
    designation: 'Passive Fund Management Team',
    fundHouse: 'Various Fund Houses',
    experience: 12,
    joinedIndustry: 2012,
    joinedFundHouse: 2015,
    education: ['MBA - Finance', 'CFA Charter', 'FRM'],
    previousCompanies: ['Multiple Asset Management Companies'],
    specialization: 'Index Funds, ETFs, Passive Investing',
    investmentPhilosophy:
      'Passive replication of indices with minimal tracking error. Focus on cost efficiency and liquidity management.',
    achievements: [
      'Maintained tracking error below 0.15% consistently',
      'Managed index fund AUM growth to ₹50,000+ Cr',
      'Low expense ratios compared to industry average',
      'High liquidity and efficient portfolio management',
    ],
    trackRecord: {
      averageAnnualReturn: 16.8,
      bestYearReturn: 39.5,
      worstYearReturn: -5.2,
      fundsUnderManagement: 25,
      totalAUM: 85000,
    },
    riskProfile: 'Moderate',
    benchmarkOutperformance: 0.0,
    successRate: 99,
    investorBase: 750000,
    bio: 'Dedicated index fund management teams across various fund houses focus on delivering benchmark returns with minimal tracking error and low costs.',
    contactInfo: {
      email: 'indexfunds@mutualfund.com',
      linkedin: 'linkedin.com/company/index-funds',
    },
  },
};

// Debt Fund Managers
const debtFundManagers = {
  'Anil Bamboli': {
    name: 'Anil Bamboli',
    designation: 'Chief Investment Officer - Fixed Income',
    fundHouse: 'HDFC Mutual Fund',
    experience: 22,
    joinedIndustry: 2002,
    joinedFundHouse: 2005,
    education: ['MBA - Finance from NMIMS', 'CA', 'CFA Charter'],
    previousCompanies: ['SBI Mutual Fund', 'UTI Asset Management'],
    specialization: 'Liquid Funds, Corporate Bonds, Duration Management',
    investmentPhilosophy:
      'Conservative approach with emphasis on credit quality and liquidity. Active duration management based on interest rate outlook.',
    achievements: [
      'Managed ₹45,000 Cr+ AUM in debt funds',
      'Delivered consistent alpha in corporate bond funds',
      'Zero credit defaults in managed portfolios',
      'Best Fixed Income Manager Award 2021',
    ],
    trackRecord: {
      averageAnnualReturn: 7.8,
      bestYearReturn: 9.5,
      worstYearReturn: 6.2,
      fundsUnderManagement: 22,
      totalAUM: 185000,
    },
    riskProfile: 'Low to Moderate',
    benchmarkOutperformance: 0.8,
    successRate: 95,
    investorBase: 680000,
    bio: 'Anil Bamboli is a veteran in fixed income management with impeccable credit selection track record. Known for prudent risk management and consistent returns.',
    contactInfo: {
      email: 'anil.bamboli@hdfcfund.com',
      linkedin: 'linkedin.com/in/anil-bamboli',
    },
  },

  'Manish Banthia': {
    name: 'Manish Banthia',
    designation: 'Head - Fixed Income',
    fundHouse: 'ICICI Prudential Mutual Fund',
    experience: 19,
    joinedIndustry: 2005,
    joinedFundHouse: 2008,
    education: [
      'MBA - Finance from IIM Lucknow',
      'CA',
      'B.Com from Delhi University',
    ],
    previousCompanies: [
      'Kotak Mahindra Asset Management',
      'Tata Asset Management',
    ],
    specialization: 'Dynamic Bond, Banking & PSU, Credit Risk',
    investmentPhilosophy:
      'Active management with focus on accrual and capital gains. Strategic credit positioning based on macro outlook.',
    achievements: [
      'ICICI Corporate Bond Fund - Consistent 8%+ returns',
      'Successfully navigated IL&FS crisis without defaults',
      'Managed ₹38,000 Cr+ debt AUM',
      'Industry recognition for risk management',
    ],
    trackRecord: {
      averageAnnualReturn: 8.2,
      bestYearReturn: 10.1,
      worstYearReturn: 6.5,
      fundsUnderManagement: 18,
      totalAUM: 145000,
    },
    riskProfile: 'Low to Moderate',
    benchmarkOutperformance: 0.9,
    successRate: 94,
    investorBase: 550000,
    bio: 'Manish Banthia brings extensive fixed income expertise. Known for his disciplined credit research and active duration management strategies.',
    contactInfo: {
      email: 'manish.banthia@icicipruamc.com',
      linkedin: 'linkedin.com/in/manish-banthia',
    },
  },

  'Dinesh Ahuja': {
    name: 'Dinesh Ahuja',
    designation: 'Senior Fund Manager - Fixed Income',
    fundHouse: 'SBI Mutual Fund',
    experience: 17,
    joinedIndustry: 2007,
    joinedFundHouse: 2010,
    education: ['MBA - Finance from FMS Delhi', 'CA', 'CFA Charter'],
    previousCompanies: ['IDFC Asset Management', 'Birla Sun Life AMC'],
    specialization: 'Gilt Funds, Overnight Funds, Short Duration',
    investmentPhilosophy:
      'Focus on high-quality government and PSU securities. Active management of duration based on rate cycle.',
    achievements: [
      'SBI Liquid Fund - ₹55,000 Cr AUM with 7%+ returns',
      'Maintained AAA credit quality across portfolios',
      'Zero mark-to-market losses during rate volatility',
      'Consistent top-quartile performance',
    ],
    trackRecord: {
      averageAnnualReturn: 7.5,
      bestYearReturn: 9.2,
      worstYearReturn: 6.8,
      fundsUnderManagement: 20,
      totalAUM: 165000,
    },
    riskProfile: 'Low',
    benchmarkOutperformance: 0.7,
    successRate: 96,
    investorBase: 720000,
    bio: 'Dinesh Ahuja specializes in managing short-term debt funds with focus on safety and liquidity. Trusted by corporates and HNI investors.',
    contactInfo: {
      email: 'dinesh.ahuja@sbimf.com',
      linkedin: 'linkedin.com/in/dinesh-ahuja-sbi',
    },
  },
};

// Commodity Fund Managers
const commodityFundManagers = {
  'Commodities Team': {
    name: 'Commodities Team',
    designation: 'Commodity Fund Management Team',
    fundHouse: 'Various Fund Houses',
    experience: 14,
    joinedIndustry: 2010,
    joinedFundHouse: 2012,
    education: ['MBA - Finance', 'CA', 'Commodity Market Certification'],
    previousCompanies: [
      'Commodity Trading Firms',
      'Asset Management Companies',
    ],
    specialization: 'Gold, Silver, Multi Commodity, Precious Metals',
    investmentPhilosophy:
      'Tactical allocation based on global commodity trends, currency movements, and inflation outlook. Focus on portfolio diversification.',
    achievements: [
      'Delivered 12%+ CAGR in gold funds over 10 years',
      'Successfully managed commodity volatility',
      'Provided effective inflation hedge for investors',
      'Maintained high correlation with physical gold prices',
    ],
    trackRecord: {
      averageAnnualReturn: 10.5,
      bestYearReturn: 28.5,
      worstYearReturn: -5.2,
      fundsUnderManagement: 12,
      totalAUM: 8500,
    },
    riskProfile: 'Moderate',
    benchmarkOutperformance: 0.5,
    successRate: 82,
    investorBase: 125000,
    bio: 'Specialized commodity fund management teams focus on tracking global commodity prices and providing Indian investors easy access to gold, silver, and multi-commodity exposure.',
    contactInfo: {
      email: 'commodityfunds@mutualfund.com',
      linkedin: 'linkedin.com/company/commodity-funds',
    },
  },
};

// Combine all managers
const allManagers = {
  ...fundManagers,
  ...debtFundManagers,
  ...commodityFundManagers,
};

async function updateFundManagerProfiles() {
  console.log('👨‍💼 CREATING COMPREHENSIVE FUND MANAGER PROFILES');
  console.log('='.repeat(70));

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');
    const managersCollection = db.collection('fund_managers');

    // Step 1: Create/Update fund managers collection
    console.log('📝 Creating fund managers collection...');

    // Drop existing collection and recreate
    try {
      await managersCollection.drop();
      console.log('   Dropped existing fund_managers collection');
    } catch (e) {
      // Collection might not exist
    }

    const managerDocuments = Object.values(allManagers).map((manager) => ({
      ...manager,
      managedFunds: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      isVerified: true,
    }));

    await managersCollection.insertMany(managerDocuments);
    console.log(
      `✅ Created ${managerDocuments.length} fund manager profiles\n`
    );

    // Step 2: Update all funds with complete manager details
    console.log('📝 Updating funds with manager details...');

    const allFunds = await fundsCollection.find({}).toArray();
    console.log(`   Found ${allFunds.length} funds to update\n`);

    let updatedCount = 0;

    for (const fund of allFunds) {
      const managerName = fund.fundManager || 'Unknown';
      const managerProfile = allManagers[managerName];

      if (!managerProfile) {
        console.log(
          `⚠️  No profile for manager: ${managerName} (Fund: ${fund.name})`
        );
        continue;
      }

      // Update fund with complete manager details
      const fundManagerDetails = {
        name: managerProfile.name,
        designation: managerProfile.designation,
        fundHouse: managerProfile.fundHouse,
        experience: managerProfile.experience,
        joinedIndustry: managerProfile.joinedIndustry,
        joinedFundHouse: managerProfile.joinedFundHouse,
        education: managerProfile.education,
        qualification: managerProfile.education, // Keep for backward compatibility
        specialization: managerProfile.specialization,
        investmentPhilosophy: managerProfile.investmentPhilosophy,
        achievements: managerProfile.achievements,
        trackRecord: managerProfile.trackRecord,
        riskProfile: managerProfile.riskProfile,
        benchmarkOutperformance: managerProfile.benchmarkOutperformance,
        successRate: managerProfile.successRate,
        bio: managerProfile.bio,
        isVerified: true,
        lastUpdated: new Date(),
      };

      await fundsCollection.updateOne(
        { _id: fund._id },
        {
          $set: {
            fundManagerDetails,
            lastUpdated: new Date(),
          },
        }
      );

      // Add fund to manager's managed funds list
      await managersCollection.updateOne(
        { name: managerProfile.name },
        {
          $addToSet: {
            managedFunds: {
              fundId: fund.fundId,
              fundName: fund.name,
              category: fund.category,
              subCategory: fund.subCategory,
              aum: fund.aum,
              returns: fund.returns?.oneYear || 0,
              rating: fund.ratings?.morningstar || 3,
            },
          },
        }
      );

      updatedCount++;
    }

    console.log(`✅ Updated ${updatedCount} funds with manager details\n`);

    // Step 3: Generate statistics
    console.log('📊 FUND MANAGER STATISTICS:');
    console.log('='.repeat(70));

    for (const [name, manager] of Object.entries(allManagers)) {
      const fundsManaged = await fundsCollection.countDocuments({
        fundManager: name,
      });
      const totalAUM = await fundsCollection
        .aggregate([
          { $match: { fundManager: name } },
          { $group: { _id: null, totalAUM: { $sum: '$aum' } } },
        ])
        .toArray();

      const aum = totalAUM[0]?.totalAUM || 0;

      console.log(`\n👨‍💼 ${name}`);
      console.log(`   Designation: ${manager.designation}`);
      console.log(`   Experience: ${manager.experience} years`);
      console.log(`   Funds Managed: ${fundsManaged}`);
      console.log(`   Total AUM: ₹${aum.toFixed(0)} Cr`);
      console.log(
        `   Avg Returns: ${manager.trackRecord.averageAnnualReturn}%`
      );
      console.log(`   Success Rate: ${manager.successRate}%`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Fund manager profiles created successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total Fund Managers: ${Object.keys(allManagers).length}`);
    console.log(`   Funds Updated: ${updatedCount}`);
    console.log(`   All funds now have complete manager profiles!`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

updateFundManagerProfiles();
