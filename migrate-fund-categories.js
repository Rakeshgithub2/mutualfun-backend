const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateFundCategories() {
  console.log('🚀 Starting MongoDB fund category migration...');
  console.log(
    '📝 Moving subcategory values from category to subCategory field\n'
  );

  try {
    // Get all funds from MongoDB
    const funds = await prisma.fund.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
      },
    });

    console.log(`📊 Found ${funds.length} funds in MongoDB to migrate\n`);

    let updated = 0;
    let skipped = 0;

    for (const fund of funds) {
      let newCategory = fund.category;
      let subCategory = null;

      // Map subcategory values to proper category + subCategory structure
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
        ['GOLD_ETF', 'SILVER_ETF', 'COMMODITY', 'Gold', 'Silver'].includes(
          fund.category
        )
      ) {
        subCategory = fund.category;
        newCategory = 'COMMODITY';
      } else if (
        ['DEBT', 'LIQUID', 'GILT', 'SHORT_TERM', 'LONG_TERM'].includes(
          fund.category
        )
      ) {
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
        ['EQUITY', 'COMMODITY', 'DEBT', 'HYBRID'].includes(fund.category)
      ) {
        // Already a main category
        newCategory = fund.category;
        subCategory = null;
      } else if (fund.type) {
        // Use type as fallback for category
        newCategory = fund.type;
        subCategory = fund.category;
      } else {
        console.log(
          `⚠️  Skipping: ${fund.name} - cannot determine category from: ${fund.category}`
        );
        skipped++;
        continue;
      }

      // Update the fund in MongoDB via Prisma
      await prisma.fund.update({
        where: { id: fund.id },
        data: {
          category: newCategory,
          subCategory: subCategory,
        },
      });

      console.log(`✅ ${fund.name}`);
      console.log(`   Category: ${fund.category} → ${newCategory}`);
      console.log(`   SubCategory: ${subCategory}\n`);
      updated++;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 MongoDB Migration Summary:');
    console.log(`   ✅ Updated: ${updated} funds`);
    console.log(`   ⏭️  Skipped: ${skipped} funds`);
    console.log(`   📊 Total: ${funds.length} funds`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
