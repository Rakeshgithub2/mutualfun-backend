/**
 * Comprehensive Fund Expansion Script
 * Fetches and imports 4000-8000+ funds from AMFI
 * Run: node expand-fund-database.js
 */

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Models
const Fund = require('./src/models/Fund.model');

const AMFI_NAV_URL = process.env.AMFI_NAV_URL || 'https://www.amfiindia.com/spages/NAVAll.txt';

/**
 * Detect fund category from name
 */
function detectCategory(name) {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('equity') || nameLower.includes('elss')) return 'Equity';
  if (nameLower.includes('debt') || nameLower.includes('bond') || nameLower.includes('income')) return 'Debt';
  if (nameLower.includes('hybrid') || nameLower.includes('balanced')) return 'Hybrid';
  if (nameLower.includes('gold') || nameLower.includes('silver') || nameLower.includes('commodity')) return 'Commodity';
  if (nameLower.includes('etf') || nameLower.includes('index')) return 'Index';
  if (nameLower.includes('liquid') || nameLower.includes('ultra short') || nameLower.includes('money market')) return 'Debt';
  if (nameLower.includes('fof') || nameLower.includes('fund of funds')) return 'Other';

  return 'Other';
}

/**
 * Detect fund subcategory from name
 */
function detectSubcategory(name) {
  const nameLower = name.toLowerCase();

  // Equity subcategories
  if (nameLower.includes('large cap') || nameLower.includes('bluechip') || nameLower.includes('blue chip')) return 'Large Cap';
  if (nameLower.includes('mid cap')) return 'Mid Cap';
  if (nameLower.includes('small cap')) return 'Small Cap';
  if (nameLower.includes('flexi cap') || nameLower.includes('multi cap') || nameLower.includes('multicap')) return 'Flexi Cap';
  if (nameLower.includes('elss') || nameLower.includes('tax saver') || nameLower.includes('tax saving')) return 'ELSS';
  if (nameLower.includes('focused') || nameLower.includes('focus')) return 'Focused';
  if (nameLower.includes('dividend yield')) return 'Dividend Yield';
  if (nameLower.includes('value')) return 'Value';
  if (nameLower.includes('contra')) return 'Contra';
  
  // Sectoral/Thematic
  if (nameLower.includes('sectoral') || nameLower.includes('sector') ||
      nameLower.includes('pharma') || nameLower.includes('healthcare') ||
      nameLower.includes('banking') || nameLower.includes('financial') ||
      nameLower.includes('technology') || nameLower.includes('it') ||
      nameLower.includes('infrastructure') || nameLower.includes('infra') ||
      nameLower.includes('energy') || nameLower.includes('power') ||
      nameLower.includes('fmcg') || nameLower.includes('consumer') ||
      nameLower.includes('auto') || nameLower.includes('manufacturing') ||
      nameLower.includes('metal') || nameLower.includes('realty') ||
      nameLower.includes('media') || nameLower.includes('services')) return 'Sectoral';

  // Debt subcategories
  if (nameLower.includes('liquid')) return 'Liquid';
  if (nameLower.includes('overnight')) return 'Overnight';
  if (nameLower.includes('ultra short')) return 'Ultra Short Duration';
  if (nameLower.includes('low duration')) return 'Low Duration';
  if (nameLower.includes('money market')) return 'Money Market';
  if (nameLower.includes('short duration') || nameLower.includes('short term')) return 'Short Duration';
  if (nameLower.includes('medium duration') || nameLower.includes('medium term')) return 'Medium Duration';
  if (nameLower.includes('medium to long')) return 'Medium to Long Duration';
  if (nameLower.includes('long duration') || nameLower.includes('long term')) return 'Long Duration';
  if (nameLower.includes('dynamic bond')) return 'Dynamic Bond';
  if (nameLower.includes('corporate bond')) return 'Corporate Bond';
  if (nameLower.includes('credit risk')) return 'Credit Risk';
  if (nameLower.includes('banking and psu') || nameLower.includes('banking & psu')) return 'Banking and PSU';
  if (nameLower.includes('gilt') || nameLower.includes('government')) return 'Gilt';
  if (nameLower.includes('floater')) return 'Floater';

  // Hybrid subcategories
  if (nameLower.includes('aggressive hybrid')) return 'Aggressive Hybrid';
  if (nameLower.includes('conservative hybrid')) return 'Conservative Hybrid';
  if (nameLower.includes('balanced hybrid') || nameLower.includes('balanced advantage')) return 'Balanced Hybrid';
  if (nameLower.includes('dynamic asset') || nameLower.includes('dynamic allocation')) return 'Dynamic Asset Allocation';
  if (nameLower.includes('multi asset')) return 'Multi Asset Allocation';
  if (nameLower.includes('arbitrage')) return 'Arbitrage';
  if (nameLower.includes('equity savings')) return 'Equity Savings';

  // Commodity
  if (nameLower.includes('gold')) return 'Gold';
  if (nameLower.includes('silver')) return 'Silver';

  // Index/ETF
  if (nameLower.includes('nifty 50') || nameLower.includes('nifty50')) return 'Nifty 50';
  if (nameLower.includes('nifty next 50')) return 'Nifty Next 50';
  if (nameLower.includes('nifty bank') || nameLower.includes('bank nifty')) return 'Nifty Bank';
  if (nameLower.includes('sensex')) return 'Sensex';

  return 'Other';
}

/**
 * Parse AMFI NAV data
 */
async function parseAMFIData() {
  console.log('📥 Fetching AMFI NAV data...');
  
  const response = await axios.get(AMFI_NAV_URL, {
    timeout: 30000, // 30 seconds
  });

  const lines = response.data.split('\n');
  const funds = [];
  let currentAMC = '';

  console.log(`📄 Processing ${lines.length} lines...`);

  for (const line of lines) {
    // Skip header
    if (line.startsWith('Scheme Code')) continue;
    
    // Skip empty lines
    if (!line.trim()) continue;

    // Check if it's a data line (contains semicolons)
    if (!line.includes(';')) {
      // This might be an AMC name
      if (line.trim()) {
        currentAMC = line.trim();
      }
      continue;
    }

    const parts = line.split(';');
    
    // Valid fund data should have at least 6 parts
    if (parts.length < 6) {
      continue;
    }

    const [schemeCode, isin, schemeName, nav, , navDate] = parts;

    // Skip if essential data is missing
    if (!schemeCode || !schemeName || !nav) {
      continue;
    }

    const category = detectCategory(schemeName);
    const subcategory = detectSubcategory(schemeName);

    funds.push({
      schemeCode: schemeCode.trim(),
      isin: isin?.trim() || null,
      name: schemeName.trim(),
      schemeName: schemeName.trim(),
      currentNav: parseFloat(nav),
      navDate: navDate?.trim() || new Date().toISOString().split('T')[0],
      category,
      subcategory,
      amc: {
        name: currentAMC || 'Unknown',
        code: currentAMC ? currentAMC.replace(/\s+/g, '_').toUpperCase() : 'UNKNOWN',
      },
      status: 'Active',
      returns: {},
      riskLevel: category === 'Equity' ? 'High' : category === 'Debt' ? 'Low' : 'Medium',
      minInvestment: category === 'Liquid' ? 1000 : 5000,
      exitLoad: '0% (if redeemed within 1 year)',
      expenseRatio: 0,
      fundSize: 0,
      launchDate: null,
      source: 'AMFI',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Parsed ${funds.length} funds from AMFI`);
  return funds;
}

/**
 * Save funds to database
 */
async function saveFundsToDatabase(funds) {
  console.log(`💾 Saving ${funds.length} funds to database...`);

  let savedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const fundData of funds) {
    try {
      // Check if fund already exists
      const existing = await Fund.findOne({
        $or: [
          { schemeCode: fundData.schemeCode },
          { isin: fundData.isin },
        ],
      });

      if (existing) {
        // Update NAV if changed
        if (existing.currentNav !== fundData.currentNav) {
          existing.currentNav = fundData.currentNav;
          existing.navDate = fundData.navDate;
          existing.updatedAt = new Date();
          await existing.save();
          console.log(`🔄 Updated: ${fundData.name}`);
          savedCount++;
        } else {
          skippedCount++;
        }
      } else {
        // Create new fund
        const fund = new Fund(fundData);
        await fund.save();
        console.log(`✅ Added: ${fundData.name}`);
        savedCount++;
      }
    } catch (error) {
      console.error(`❌ Error with ${fundData.name}:`, error.message);
      errorCount++;
    }
  }

  return { savedCount, skippedCount, errorCount };
}

/**
 * Generate statistics
 */
async function generateStatistics() {
  console.log('\n📊 Generating statistics...\n');

  const total = await Fund.countDocuments();
  console.log(`Total Funds: ${total}`);

  const categories = await Fund.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log('\n📈 Category Breakdown:');
  for (const cat of categories) {
    console.log(`  ${cat._id}: ${cat.count} funds`);
    
    // Get subcategory breakdown
    const subcats = await Fund.aggregate([
      { $match: { category: cat._id } },
      { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    for (const sub of subcats) {
      console.log(`    ├─ ${sub._id}: ${sub.count}`);
    }
  }

  const topAMCs = await Fund.aggregate([
    { $group: { _id: '$amc.name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  console.log('\n🏢 Top 10 AMCs:');
  for (const amc of topAMCs) {
    console.log(`  ${amc._id}: ${amc.count} funds`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting comprehensive fund database expansion...\n');

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Parse AMFI data
    const funds = await parseAMFIData();

    if (funds.length === 0) {
      console.log('⚠️ No funds to save');
      process.exit(1);
    }

    // Save to database
    const stats = await saveFundsToDatabase(funds);

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE EXPANSION COMPLETE');
    console.log('='.repeat(50));
    console.log(`✅ Saved/Updated: ${stats.savedCount} funds`);
    console.log(`⏭️  Skipped (unchanged): ${stats.skippedCount} funds`);
    console.log(`❌ Errors: ${stats.errorCount} funds`);
    console.log('='.repeat(50) + '\n');

    // Generate statistics
    await generateStatistics();

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run
main();
