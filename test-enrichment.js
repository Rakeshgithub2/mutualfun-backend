/**
 * Test fund enrichment and API response
 */
const mongoose = require('mongoose');
const Fund = require('./src/models/Fund.model');
const FundEnrichmentService = require('./src/services/fund-enrichment.service');

async function testEnrichment() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mutualfunds');
    console.log('✅ Connected to MongoDB\n');

    // Get a sample fund
    const fund = await Fund.findOne({}).lean();

    if (!fund) {
      console.log('❌ No funds found in database');
      return;
    }

    console.log('📊 Original Fund Data:');
    console.log('  Name:', fund.schemeName || fund.name);
    console.log('  ID:', fund._id);
    console.log('  Category:', fund.category);
    console.log('  SubCategory:', fund.subCategory);
    console.log('  Holdings:', fund.holdings ? fund.holdings.length : 0);
    console.log(
      '  Sector Allocation:',
      fund.sectorAllocation ? fund.sectorAllocation.length : 0
    );

    // Enrich the fund data
    console.log('\n🔧 Enriching fund data...\n');
    const enrichedFund = FundEnrichmentService.enrichFundData(fund);

    console.log('📈 Enriched Fund Data:');
    console.log(
      '  Holdings:',
      enrichedFund.holdings ? enrichedFund.holdings.length : 0
    );
    console.log(
      '  Sector Allocation:',
      enrichedFund.sectorAllocation ? enrichedFund.sectorAllocation.length : 0
    );

    if (enrichedFund.holdings && enrichedFund.holdings.length > 0) {
      console.log('\n📋 Sample Holdings (first 3):');
      enrichedFund.holdings.slice(0, 3).forEach((h, i) => {
        console.log(`  ${i + 1}. Name: ${h.name || h.companyName || 'N/A'}`);
        console.log(`     Ticker: ${h.ticker || 'N/A'}`);
        console.log(`     Sector: ${h.sector || 'N/A'}`);
        console.log(
          `     Percentage: ${h.percentage || h.holdingPercent || 0}%`
        );
        console.log(`     Value: ₹${h.value || 0} Cr`);
        console.log('');
      });
    }

    if (
      enrichedFund.sectorAllocation &&
      enrichedFund.sectorAllocation.length > 0
    ) {
      console.log('🎯 Sample Sector Allocation (first 3):');
      enrichedFund.sectorAllocation.slice(0, 3).forEach((s, i) => {
        console.log(`  ${i + 1}. Sector: ${s.sector || s.sectorName || 'N/A'}`);
        console.log(`     Percentage: ${s.percentage || s.allocation || 0}%`);
        console.log(`     Value: ₹${s.value || 0} Cr`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testEnrichment();
