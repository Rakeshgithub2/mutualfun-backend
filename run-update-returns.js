/**
 * Run Fund Returns Update - Manual Execution
 * Usage:
 *   node run-update-returns.js           - Update all funds
 *   node run-update-returns.js 100       - Update first 100 funds
 *   node run-update-returns.js 500 --skip-existing - Update 500 funds, skip those with returns
 */

const mongoose = require('mongoose');
require('dotenv').config();

const fundReturnsService = require('./services/fetch-fund-returns.service');

async function main() {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   FUND RETURNS UPDATE SERVICE         ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Parse command line arguments
    const args = process.argv.slice(2);
    const limit =
      args[0] && !args[0].startsWith('--') ? parseInt(args[0]) : null;
    const skipExisting = args.includes('--skip-existing');

    console.log('⚙️  Configuration:');
    if (limit) {
      console.log(`   📊 Target: First ${limit} funds`);
    } else {
      console.log('   📊 Target: ALL active funds (~14,200)');
    }

    if (skipExisting) {
      console.log('   ⏭️  Mode: Skip funds with existing returns');
    } else {
      console.log('   🔄 Mode: Update all (overwrite existing)');
    }

    console.log('\n⏰ This will take time:');
    console.log('   - ~100 funds: ~2-3 minutes');
    console.log('   - ~1000 funds: ~20-30 minutes');
    console.log('   - ~14,200 funds: ~4-5 hours\n');

    // Confirm
    console.log('🚀 Starting in 3 seconds...\n');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update funds
    const stats = await fundReturnsService.updateAllFunds({
      limit,
      skipExisting,
    });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   UPDATE COMPLETE                     ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`✅ Successfully updated: ${stats.updated} funds`);
    console.log(`❌ Failed: ${stats.failed} funds`);
    console.log(`⏭️  Skipped: ${stats.skipped} funds\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
