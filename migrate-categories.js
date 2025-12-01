const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateFundCategories() {
  console.log('🚀 Starting fund category migration...');

  try {
    // Get all funds
    const funds = await prisma.fund.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
      },
    });

    console.log(`📊 Found ${funds.length} funds to migrate`);

    let updated = 0;
    let skipped = 0;

    for (const fund of funds) {
      // Determine the correct category and subCategory
      let newCategory = fund.category;
      let subCategory = null;

      // If category is currently a subcategory value (LARGE_CAP, MID_CAP, etc.)
      // Move it to subCategory and set category to the main type
      if (
        [
          'LARGE_CAP',
          'MID_CAP',
          'SMALL_CAP',
          'MULTI_CAP',
          'FLEXI_CAP',
        ].includes(fund.category)
      ) {
        subCategory = fund.category;
        newCategory = 'EQUITY';
      } else if (
        ['GOLD_ETF', 'SILVER_ETF', 'COMMODITY'].includes(fund.category)
      ) {
        subCategory = fund.category;
        newCategory = 'COMMODITY';
      } else if (['DEBT', 'LIQUID', 'GILT'].includes(fund.category)) {
        subCategory = fund.category;
        newCategory = 'DEBT';
      } else if (
        ['BALANCED', 'CONSERVATIVE_HYBRID', 'AGGRESSIVE_HYBRID'].includes(
          fund.category
        )
      ) {
        subCategory = fund.category;
        newCategory = 'HYBRID';
      } else if (
        fund.category === 'EQUITY' ||
        fund.category === 'COMMODITY' ||
        fund.category === 'DEBT' ||
        fund.category === 'HYBRID'
      ) {
        // Already correct main category
        newCategory = fund.category;
        subCategory = null;
      } else {
        // Unknown category, skip
        console.log(
          `⚠️  Skipping ${fund.name} - unknown category: ${fund.category}`
        );
        skipped++;
        continue;
      }

      // Update the fund
      await prisma.fund.update({
        where: { id: fund.id },
        data: {
          category: newCategory,
          subCategory: subCategory,
        },
      });

      console.log(
        `✅ Updated: ${fund.name} | Category: ${newCategory} | SubCategory: ${subCategory}`
      );
      updated++;
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${funds.length}`);
    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateFundCategories().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
