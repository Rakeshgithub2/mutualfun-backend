/**
 * Check Holdings Data
 * Quick diagnostic to see if holdings data exists
 */

const mongoose = require('mongoose');
require('dotenv').config();

const FundHoldings = require('./src/models/FundHoldings.model');
const Fund = require('./src/models/Fund.model');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

async function checkHoldings() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🔍 CHECKING HOLDINGS DATA');
    console.log('='.repeat(70));

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if holdings collection exists and has data
    const totalHoldings = await FundHoldings.countDocuments({});
    console.log(`📊 Total Holdings Records: ${totalHoldings}`);

    if (totalHoldings === 0) {
      console.log('\n❌ NO HOLDINGS DATA FOUND!\n');
      console.log('💡 Solutions:');
      console.log('   1. Quick test (sample data):');
      console.log('      node seed-sample-holdings.js\n');
      console.log('   2. Full production data (AMFI scraping):');
      console.log('      .\\setup-holdings.ps1');
      console.log('      .\\run-holdings-pipeline.ps1\n');
      process.exit(1);
    }

    // Check unique funds with holdings
    const fundsWithHoldings = await FundHoldings.distinct('schemeCode');
    console.log(`📋 Funds with Holdings: ${fundsWithHoldings.length}`);

    // Show sample funds
    console.log('\n📂 Sample Funds:');
    console.log('-'.repeat(70));

    const samples = await FundHoldings.aggregate([
      {
        $group: {
          _id: '$schemeCode',
          fundName: { $first: '$fundName' },
          count: { $sum: 1 },
          reportDate: { $first: '$reportDate' },
        },
      },
      { $limit: 5 },
    ]);

    samples.forEach((s, i) => {
      const scheme = s._id || 'N/A';
      const name = s.fundName.substring(0, 45);
      const date = s.reportDate
        ? s.reportDate.toISOString().split('T')[0]
        : 'N/A';
      console.log(`  ${i + 1}. [${scheme}] ${name}`);
      console.log(`     Holdings: ${s.count} | Report Date: ${date}`);
    });

    // Check sector classification
    console.log('\n📈 Sector Classification:');
    console.log('-'.repeat(70));

    const withSector = await FundHoldings.countDocuments({
      sector: { $exists: true, $ne: null },
    });
    const coverage = ((withSector / totalHoldings) * 100).toFixed(1);

    console.log(`  Classified: ${withSector}/${totalHoldings} (${coverage}%)`);

    if (withSector > 0) {
      const topSectors = await FundHoldings.aggregate([
        { $match: { sector: { $exists: true, $ne: null } } },
        { $group: { _id: '$sector', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);

      console.log('\n  Top Sectors:');
      topSectors.forEach((s) => {
        console.log(
          `    • ${s._id.padEnd(25)} ${s.count.toString().padStart(4)} securities`
        );
      });
    }

    // Test API endpoints
    console.log('\n🧪 Testing Sample API Call:');
    console.log('-'.repeat(70));

    if (samples.length > 0) {
      const testScheme = samples[0]._id;
      const testHoldings = await FundHoldings.find({ schemeCode: testScheme })
        .sort({ weight: -1 })
        .limit(3)
        .lean();

      if (testHoldings.length > 0) {
        console.log(`\n  GET /api/holdings/${testScheme}`);
        console.log(`  Top 3 Holdings:`);
        testHoldings.forEach((h, i) => {
          console.log(
            `    ${i + 1}. ${h.security.substring(0, 35).padEnd(35)} ${h.weight}% (${h.sector || 'N/A'})`
          );
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ HOLDINGS DATA IS AVAILABLE');
    console.log('='.repeat(70));
    console.log('\n💡 Your frontend should now work!');
    console.log('   Make sure backend is running on port 3002\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

checkHoldings();
