const mongoose = require('mongoose');

async function checkHoldingsSource() {
  await mongoose.connect('mongodb://localhost:27017/mutual-funds');
  const db = mongoose.connection.db;

  const totalHoldings = await db.collection('fund_holdings').countDocuments();
  const sources = await db.collection('fund_holdings').distinct('source');

  console.log('='.repeat(70));
  console.log('📊 HOLDINGS DATA SOURCE ANALYSIS');
  console.log('='.repeat(70));
  console.log(`Total holdings records: ${totalHoldings}`);
  console.log(`\nData sources found: ${sources.join(', ')}`);

  // Count by source
  console.log('\nBreakdown by source:');
  for (const source of sources) {
    const count = await db
      .collection('fund_holdings')
      .countDocuments({ source });
    console.log(`  ${source}: ${count} records`);
  }

  // Show sample holdings
  console.log('\n' + '='.repeat(70));
  console.log('SAMPLE HOLDINGS (First 10):');
  console.log('='.repeat(70));

  const samples = await db
    .collection('fund_holdings')
    .find({})
    .limit(10)
    .toArray();
  samples.forEach((h, i) => {
    console.log(`${i + 1}. Fund: ${h.fundName}`);
    console.log(`   Security: ${h.security} (${h.weight}%)`);
    console.log(`   Source: ${h.source}`);
    console.log('');
  });

  // Check for SAMPLE or mock data
  const sampleCount = await db.collection('fund_holdings').countDocuments({
    source: { $in: ['SAMPLE', 'MOCK', 'AUTO_SCRAPE'] },
  });

  console.log('='.repeat(70));
  console.log('⚠️  WARNING CHECK');
  console.log('='.repeat(70));

  if (sampleCount > 0) {
    console.log(`❌ FOUND ${sampleCount} SAMPLE/MOCK RECORDS`);
    console.log('   This data is NOT real-world data!');
    console.log('   For production use, you need:');
    console.log('   1. Real factsheet data from AMC websites');
    console.log('   2. Paid API providers (Valuemo, RapidAPI)');
    console.log('   3. Manual data entry from fund factsheets');
  } else {
    console.log('✅ All data appears to be from real sources');
  }

  await mongoose.disconnect();
}

checkHoldingsSource().catch(console.error);
