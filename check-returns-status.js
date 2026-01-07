/**
 * Check Fund Data Status
 * Shows statistics about returns data in database
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Fund = require('./src/models/Fund.model');

async function checkStatus() {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║      FUND DATA STATUS CHECK           ║');
    console.log('╚════════════════════════════════════════╝\n');

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Total funds
    const totalFunds = await Fund.countDocuments({ status: 'Active' });
    console.log(`📊 Total Active Funds: ${totalFunds.toLocaleString()}`);

    // Funds with returns data
    const fundsWithReturns = await Fund.countDocuments({
      status: 'Active',
      'returns.1Y': { $exists: true, $ne: null, $ne: 0 },
    });

    const percentage = ((fundsWithReturns / totalFunds) * 100).toFixed(1);

    console.log(
      `\n✅ Funds with Returns Data: ${fundsWithReturns.toLocaleString()} (${percentage}%)`
    );
    console.log(
      `❌ Funds without Returns: ${(totalFunds - fundsWithReturns).toLocaleString()}`
    );

    // Progress bar
    const barLength = 40;
    const filled = Math.round((fundsWithReturns / totalFunds) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    console.log(`\n[${bar}] ${percentage}%`);

    // Breakdown by category
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('BREAKDOWN BY CATEGORY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const categories = await Fund.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          withReturns: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$returns.1Y', null] },
                    { $ne: ['$returns.1Y', 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    categories.forEach((cat) => {
      const pct = ((cat.withReturns / cat.total) * 100).toFixed(1);
      console.log(
        `  ${cat._id.padEnd(15)}: ${cat.withReturns.toString().padStart(5)}/${cat.total.toString().padStart(5)} (${pct}%)`
      );
    });

    // Sample fund with returns
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SAMPLE FUND WITH RETURNS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const sampleFund = await Fund.findOne({
      'returns.1Y': { $exists: true, $ne: null, $ne: 0 },
    })
      .select('name schemeName currentNav returns metadata.lastUpdated')
      .lean();

    if (sampleFund) {
      console.log(`\nName: ${sampleFund.name || sampleFund.schemeName}`);
      console.log(
        `NAV: ₹${sampleFund.currentNav?.value || sampleFund.currentNav || 'N/A'}`
      );
      console.log(`\nReturns:`);
      console.log(`  1 Year:  ${sampleFund.returns['1Y'] || 'N/A'}%`);
      console.log(`  3 Years: ${sampleFund.returns['3Y'] || 'N/A'}%`);
      console.log(`  5 Years: ${sampleFund.returns['5Y'] || 'N/A'}%`);
      if (sampleFund.metadata?.lastUpdated) {
        console.log(
          `\nLast Updated: ${new Date(sampleFund.metadata.lastUpdated).toLocaleString()}`
        );
      }
    }

    // Recommendations
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('RECOMMENDATIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (fundsWithReturns === 0) {
      console.log('\n⚠️  NO RETURNS DATA FOUND!');
      console.log('\n📝 Action Required:');
      console.log('   1. Run: node run-update-returns.js 10 (test)');
      console.log('   2. If successful: node run-update-returns.js 100');
      console.log('   3. For full update: node run-update-returns.js');
    } else if (percentage < 10) {
      console.log('\n⚠️  VERY LIMITED DATA!');
      console.log('\n📝 Recommended:');
      console.log('   Run: node run-update-returns.js 1000');
      console.log('   (Takes ~20-30 minutes)');
    } else if (percentage < 50) {
      console.log('\n📝 Partial data available');
      console.log('\n📝 To get more:');
      console.log('   Run: node run-update-returns.js 2000');
      console.log('   (Takes ~1-1.5 hours)');
    } else {
      console.log('\n✅ Good data coverage!');
      console.log('\n📝 For complete dataset:');
      console.log('   Run: node run-update-returns.js');
      console.log('   (Takes ~4-5 hours for all funds)');
    }

    console.log('\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

checkStatus();
