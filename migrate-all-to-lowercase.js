const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');
require('dotenv').config();

// Mapping for subcategory normalization
const subcategoryMapping = {
  'Large Cap': 'largecap',
  'Mid Cap': 'midcap',
  'Small Cap': 'smallcap',
  'Multi Cap': 'multicap',
  'Flexi Cap': 'flexicap',
  'Sectoral/Thematic': 'sectoral',
  ELSS: 'elss',
  'Index Fund': 'indexfund',
  'Equity - Other': 'equityother',
  'Aggressive Hybrid': 'aggressivehybrid',
  'Balanced Hybrid': 'balancedhybrid',
  'Conservative Hybrid': 'conservativehybrid',
  Arbitrage: 'arbitrage',
  'Hybrid - Other': 'hybridother',
  'Corporate Bond': 'corporatebond',
  'Debt - Other': 'debtother',
  Gilt: 'gilt',
  Liquid: 'liquid',
  'Ultra Short Duration': 'ultrashortduration',
  'Short Duration': 'shortduration',
  'Medium Duration': 'mediumduration',
  'Long Duration': 'longduration',
  'Dynamic Bond': 'dynamicbond',
  Other: 'other',
};

// Also normalize category to lowercase
const categoryMapping = {
  Equity: 'equity',
  Debt: 'debt',
  Hybrid: 'hybrid',
  Commodity: 'commodity',
  'Solution Oriented': 'solutionoriented',
  Other: 'other',
  equity: 'equity',
  debt: 'debt',
  hybrid: 'hybrid',
  commodity: 'commodity',
  other: 'other',
};

async function migrateAllFunds() {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    console.log('🔗 Connecting to:', dbUrl.replace(/:[^:@]+@/, ':***@'));

    await mongoose.connect(dbUrl);
    console.log('✅ Connected to database:', mongoose.connection.name);

    const totalFunds = await Fund.countDocuments({});
    console.log(`\n📊 Total funds to process: ${totalFunds}`);

    let updated = 0;
    let skipped = 0;
    const results = {};

    // Process in batches
    const batchSize = 1000;
    for (let i = 0; i < totalFunds; i += batchSize) {
      console.log(
        `\n⏳ Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalFunds / batchSize)}...`
      );

      const funds = await Fund.find({}).skip(i).limit(batchSize).lean();

      for (const fund of funds) {
        const oldSubCategory = fund.subCategory;
        const oldCategory = fund.category;
        const newSubCategory =
          subcategoryMapping[oldSubCategory] ||
          oldSubCategory?.toLowerCase().replace(/\s+/g, '');
        const newCategory =
          categoryMapping[oldCategory] || oldCategory?.toLowerCase();

        if (oldSubCategory !== newSubCategory || oldCategory !== newCategory) {
          await Fund.updateOne(
            { _id: fund._id },
            {
              $set: {
                subCategory: newSubCategory,
                category: newCategory,
              },
            }
          );
          updated++;

          // Track changes
          const key = `${oldCategory}/${oldSubCategory} → ${newCategory}/${newSubCategory}`;
          results[key] = (results[key] || 0) + 1;
        } else {
          skipped++;
        }
      }
    }

    console.log('\n✅ Migration complete!');
    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Updated: ${updated} funds`);
    console.log(`  ⏭️  Skipped: ${skipped} funds (already correct)`);

    console.log('\n📋 Changes made:');
    Object.entries(results)
      .sort((a, b) => b[1] - a[1])
      .forEach(([key, count]) => {
        console.log(`  ${key}: ${count} funds`);
      });

    // Verify results
    console.log('\n📊 Current subcategories after migration:');
    const newSubs = await Fund.distinct('subCategory');
    newSubs.sort().forEach((s) => console.log(`  - ${s}`));

    console.log('\n📊 Current categories after migration:');
    const newCats = await Fund.distinct('category');
    newCats.sort().forEach((c) => console.log(`  - ${c}`));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

migrateAllFunds();
