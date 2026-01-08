/**
 * Seed Sample Holdings Data
 * Quick test data for immediate frontend testing
 */

const mongoose = require('mongoose');
require('dotenv').config();

const FundHoldings = require('./src/models/FundHoldings.model');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

// Sample holdings data for popular funds
const sampleHoldings = [
  {
    schemeCode: '100027',
    fundName: 'Aditya Birla Sun Life Equity Fund',
    reportDate: new Date('2026-01-01'),
    holdings: [
      {
        security: 'HDFC Bank Ltd',
        weight: 9.42,
        marketValue: 124500000,
        sector: 'Banking',
      },
      {
        security: 'ICICI Bank Ltd',
        weight: 8.71,
        marketValue: 118900000,
        sector: 'Banking',
      },
      {
        security: 'Infosys Ltd',
        weight: 7.23,
        marketValue: 98700000,
        sector: 'IT & Software',
      },
      {
        security: 'Reliance Industries Ltd',
        weight: 6.89,
        marketValue: 94200000,
        sector: 'Energy & Power',
      },
      {
        security: 'TCS Ltd',
        weight: 5.67,
        marketValue: 77500000,
        sector: 'IT & Software',
      },
      {
        security: 'Bajaj Finance Ltd',
        weight: 4.92,
        marketValue: 67200000,
        sector: 'Financial Services',
      },
      {
        security: 'Kotak Mahindra Bank Ltd',
        weight: 4.45,
        marketValue: 60800000,
        sector: 'Banking',
      },
      {
        security: 'Axis Bank Ltd',
        weight: 3.78,
        marketValue: 51600000,
        sector: 'Banking',
      },
      {
        security: 'HUL Ltd',
        weight: 3.21,
        marketValue: 43800000,
        sector: 'FMCG',
      },
      {
        security: 'Maruti Suzuki Ltd',
        weight: 2.95,
        marketValue: 40300000,
        sector: 'Automobile',
      },
      {
        security: 'Asian Paints Ltd',
        weight: 2.67,
        marketValue: 36500000,
        sector: 'FMCG',
      },
      {
        security: 'Sun Pharma Industries',
        weight: 2.34,
        marketValue: 32000000,
        sector: 'Pharma & Healthcare',
      },
      {
        security: 'Wipro Ltd',
        weight: 2.12,
        marketValue: 29000000,
        sector: 'IT & Software',
      },
      {
        security: 'Larsen & Toubro Ltd',
        weight: 1.89,
        marketValue: 25800000,
        sector: 'Infrastructure',
      },
      {
        security: 'Bharti Airtel Ltd',
        weight: 1.67,
        marketValue: 22800000,
        sector: 'Telecom',
      },
    ],
  },
  {
    schemeCode: '118989',
    fundName: 'HDFC Equity Fund',
    reportDate: new Date('2026-01-01'),
    holdings: [
      {
        security: 'HDFC Bank Ltd',
        weight: 10.23,
        marketValue: 156700000,
        sector: 'Banking',
      },
      {
        security: 'ICICI Bank Ltd',
        weight: 9.12,
        marketValue: 139800000,
        sector: 'Banking',
      },
      {
        security: 'TCS Ltd',
        weight: 7.89,
        marketValue: 120900000,
        sector: 'IT & Software',
      },
      {
        security: 'Infosys Ltd',
        weight: 6.45,
        marketValue: 98900000,
        sector: 'IT & Software',
      },
      {
        security: 'Reliance Industries Ltd',
        weight: 5.78,
        marketValue: 88600000,
        sector: 'Energy & Power',
      },
      {
        security: 'Bajaj Finance Ltd',
        weight: 5.23,
        marketValue: 80200000,
        sector: 'Financial Services',
      },
      {
        security: 'State Bank of India',
        weight: 4.67,
        marketValue: 71600000,
        sector: 'Banking',
      },
      {
        security: 'Axis Bank Ltd',
        weight: 4.12,
        marketValue: 63200000,
        sector: 'Banking',
      },
      {
        security: 'ITC Ltd',
        weight: 3.45,
        marketValue: 52900000,
        sector: 'FMCG',
      },
      {
        security: 'Hindustan Unilever Ltd',
        weight: 3.12,
        marketValue: 47800000,
        sector: 'FMCG',
      },
      {
        security: 'Kotak Mahindra Bank Ltd',
        weight: 2.89,
        marketValue: 44300000,
        sector: 'Banking',
      },
      {
        security: 'Maruti Suzuki India',
        weight: 2.34,
        marketValue: 35900000,
        sector: 'Automobile',
      },
      {
        security: 'Larsen & Toubro',
        weight: 2.12,
        marketValue: 32500000,
        sector: 'Infrastructure',
      },
      {
        security: 'Ultratech Cement',
        weight: 1.89,
        marketValue: 29000000,
        sector: 'Cement',
      },
      {
        security: 'Titan Company Ltd',
        weight: 1.67,
        marketValue: 25600000,
        sector: 'Retail',
      },
    ],
  },
  {
    schemeCode: '120503',
    fundName: 'SBI Bluechip Fund',
    reportDate: new Date('2026-01-01'),
    holdings: [
      {
        security: 'State Bank of India',
        weight: 8.92,
        marketValue: 145600000,
        sector: 'Banking',
      },
      {
        security: 'HDFC Bank Ltd',
        weight: 8.45,
        marketValue: 138000000,
        sector: 'Banking',
      },
      {
        security: 'Reliance Industries Ltd',
        weight: 7.23,
        marketValue: 118100000,
        sector: 'Energy & Power',
      },
      {
        security: 'TCS Ltd',
        weight: 6.78,
        marketValue: 110700000,
        sector: 'IT & Software',
      },
      {
        security: 'ICICI Bank Ltd',
        weight: 6.12,
        marketValue: 100000000,
        sector: 'Banking',
      },
      {
        security: 'Infosys Ltd',
        weight: 5.45,
        marketValue: 89000000,
        sector: 'IT & Software',
      },
      {
        security: 'Bharti Airtel Ltd',
        weight: 4.89,
        marketValue: 79900000,
        sector: 'Telecom',
      },
      {
        security: 'Bajaj Finance Ltd',
        weight: 4.23,
        marketValue: 69100000,
        sector: 'Financial Services',
      },
      {
        security: 'ITC Ltd',
        weight: 3.67,
        marketValue: 59900000,
        sector: 'FMCG',
      },
      {
        security: 'Axis Bank Ltd',
        weight: 3.34,
        marketValue: 54600000,
        sector: 'Banking',
      },
      {
        security: 'Hindustan Unilever',
        weight: 2.89,
        marketValue: 47200000,
        sector: 'FMCG',
      },
      {
        security: 'Maruti Suzuki India',
        weight: 2.45,
        marketValue: 40000000,
        sector: 'Automobile',
      },
      {
        security: 'Power Grid Corporation',
        weight: 2.12,
        marketValue: 34600000,
        sector: 'Energy & Power',
      },
      {
        security: 'Coal India Ltd',
        weight: 1.78,
        marketValue: 29100000,
        sector: 'Metals & Mining',
      },
      {
        security: 'NTPC Ltd',
        weight: 1.45,
        marketValue: 23700000,
        sector: 'Energy & Power',
      },
    ],
  },
];

async function seedHoldings() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing sample data
    console.log('🗑️  Clearing existing holdings...');
    await FundHoldings.deleteMany({});
    console.log('✅ Cleared\n');

    let totalInserted = 0;

    console.log('📥 Inserting sample holdings...\n');
    console.log('='.repeat(70));

    for (const fundData of sampleHoldings) {
      const { schemeCode, fundName, reportDate, holdings } = fundData;

      const holdingsDocs = holdings.map((h) => ({
        schemeCode,
        fundName,
        security: h.security,
        weight: h.weight,
        marketValue: h.marketValue,
        sector: h.sector,
        reportDate,
        source: 'SAMPLE',
        importedAt: new Date(),
      }));

      await FundHoldings.insertMany(holdingsDocs);

      console.log(`✅ ${fundName}`);
      console.log(`   Scheme Code: ${schemeCode}`);
      console.log(`   Holdings: ${holdings.length}`);
      console.log(
        `   Top Stock: ${holdings[0].security} (${holdings[0].weight}%)`
      );
      console.log('-'.repeat(70));

      totalInserted += holdings.length;
    }

    console.log('\n' + '='.repeat(70));
    console.log(
      `✅ Successfully seeded ${totalInserted} holdings for ${sampleHoldings.length} funds`
    );
    console.log('='.repeat(70));

    // Show statistics
    console.log('\n📊 Statistics:');
    const stats = await FundHoldings.aggregate([
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
          avgWeight: { $avg: '$weight' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('\nSector Distribution:');
    stats.forEach((s) => {
      console.log(
        `  ${s._id.padEnd(25)} ${s.count.toString().padStart(3)} holdings (avg ${s.avgWeight.toFixed(2)}%)`
      );
    });

    console.log('\n🎯 Test the API:');
    console.log(`   curl http://localhost:3002/api/holdings/100027`);
    console.log(
      `   curl http://localhost:3002/api/holdings/100027/top?limit=10`
    );
    console.log(`   curl http://localhost:3002/api/holdings/100027/sectors`);
    console.log(`   curl http://localhost:3002/api/holdings/stats`);

    console.log('\n✅ Frontend should now display holdings data!\n');
  } catch (error) {
    console.error('❌ Error seeding holdings:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run seeding
seedHoldings();
