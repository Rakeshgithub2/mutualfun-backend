/**
 * Test script to verify fund metrics calculation
 * Run: npx tsx test-fund-metrics.ts
 */

import { prisma } from './src/db';
import { enrichFundData } from './src/utils/fundMetrics';

async function testFundMetrics() {
  try {
    console.log('🧪 Testing Fund Metrics Calculation...\n');

    // Get a random fund with performance data
    const fund = await prisma.fund.findFirst({
      where: {
        isActive: true,
      },
      include: {
        performances: {
          where: {
            date: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!fund) {
      console.log('❌ No funds found in database');
      return;
    }

    console.log('📊 Testing fund:', fund.name);
    console.log('📈 Performance data points:', fund.performances.length);

    if (fund.performances.length < 30) {
      console.log('⚠️  Not enough performance data (need at least 30 days)');
      return;
    }

    // Calculate metrics
    const enrichedFund = enrichFundData(fund, fund.performances);

    console.log('\n✅ Calculated Metrics:\n');
    console.log('📊 Returns:');
    console.log('  - 1 Month:', enrichedFund.returns.oneMonth.toFixed(2) + '%');
    console.log(
      '  - 6 Months:',
      enrichedFund.returns.sixMonth.toFixed(2) + '%'
    );
    console.log('  - YTD:', enrichedFund.returns.ytd.toFixed(2) + '%');
    console.log('  - 1 Year:', enrichedFund.returns.oneYear.toFixed(2) + '%');
    console.log(
      '  - 3 Years:',
      enrichedFund.returns.threeYear.toFixed(2) + '%'
    );
    console.log('  - 5 Years:', enrichedFund.returns.fiveYear.toFixed(2) + '%');

    console.log('\n📉 Risk Metrics:');
    console.log('  - Sharpe Ratio:', enrichedFund.riskMetrics.sharpeRatio);
    console.log('  - Beta:', enrichedFund.riskMetrics.beta);
    console.log('  - Alpha:', enrichedFund.riskMetrics.alpha + '%');
    console.log('  - Volatility:', enrichedFund.riskMetrics.volatility + '%');

    console.log('\n⭐ Overall:');
    console.log('  - Risk Level:', enrichedFund.riskLevel);
    console.log('  - Rating:', enrichedFund.rating + ' / 5.0');

    console.log('\n✅ Test completed successfully!');
    console.log('\n💡 Tip: Test the API endpoint:');
    console.log(`   GET http://localhost:3002/api/funds/${fund.id}`);
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run test
testFundMetrics();
