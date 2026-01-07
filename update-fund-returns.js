/**
 * Update Fund Returns Data
 * Fetches NAV and returns from MFAPI and updates database
 */

const mongoose = require('mongoose');
require('dotenv').config();

const fundReturnsService = require('./services/fetch-fund-returns.service');

async function main() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // Parse command line arguments
    const args = process.argv.slice(2);
    const limit = args[0] ? parseInt(args[0]) : null;
    const skipExisting = args.includes('--skip-existing');

    if (limit) {
      console.log(`🎯 Processing first ${limit} funds`);
    } else {
      console.log('🎯 Processing ALL active funds');
    }

    if (skipExisting) {
      console.log('⏭️  Skipping funds with existing returns data\n');
    }

    // Update funds
    await fundReturnsService.updateAllFunds({
      limit,
      skipExisting,
    });

    console.log('✅ All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
