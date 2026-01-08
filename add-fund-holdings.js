/**
 * Add Fund Holdings Manually
 * For adding real holdings data from fund factsheets
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const FundHoldings = require('./src/models/FundHoldings.model');
const Fund = require('./src/models/Fund.model');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function addFundHoldings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('='.repeat(70));
    console.log('📝 ADD REAL FUND HOLDINGS');
    console.log('='.repeat(70));
    console.log('\n💡 Get holdings from fund factsheet PDFs:');
    console.log('   • HDFC: https://www.hdfcfund.com/');
    console.log('   • ICICI: https://www.icicipruamc.com/');
    console.log('   • SBI: https://www.sbimf.com/');
    console.log(
      '   • Aditya Birla: https://mutualfund.adityabirlacapital.com/\n'
    );

    const schemeCode = await question('Enter Scheme Code: ');

    // Check if fund exists
    const fund = await Fund.findOne({ schemeCode });
    if (!fund) {
      console.log(
        `❌ Fund with scheme code ${schemeCode} not found in database`
      );
      rl.close();
      process.exit(1);
    }

    console.log(`\n✅ Found: ${fund.schemeName || fund.name}`);
    console.log(`    Category: ${fund.category}`);

    const fundName = fund.schemeName || fund.name;

    console.log(
      '\n📊 Enter Holdings (one per line, format: Company|Weight|Sector)'
    );
    console.log('Example: HDFC Bank Ltd|9.42|Banking');
    console.log('Press Enter twice when done\n');

    const holdings = [];
    let lineNum = 1;

    while (true) {
      const line = await question(`${lineNum}. `);

      if (!line.trim()) break;

      const parts = line.split('|');
      if (parts.length >= 2) {
        holdings.push({
          security: parts[0].trim(),
          weight: parseFloat(parts[1].trim()),
          sector: parts[2] ? parts[2].trim() : 'Others',
          marketValue: null,
        });
        lineNum++;
      } else {
        console.log('   ⚠️  Invalid format. Use: Company|Weight|Sector');
      }
    }

    if (holdings.length === 0) {
      console.log('\n⚠️  No holdings entered');
      rl.close();
      process.exit(0);
    }

    // Delete existing holdings for this fund
    await FundHoldings.deleteMany({ schemeCode });

    // Insert new holdings
    const reportDate = new Date();
    const holdingsDocs = holdings.map((h) => ({
      schemeCode,
      fundName,
      security: h.security,
      weight: h.weight,
      marketValue: h.marketValue,
      sector: h.sector,
      reportDate,
      source: 'MANUAL',
      importedAt: new Date(),
    }));

    await FundHoldings.insertMany(holdingsDocs);

    console.log('\n' + '='.repeat(70));
    console.log(
      `✅ Successfully added ${holdings.length} holdings for ${fundName}`
    );
    console.log('='.repeat(70));

    console.log('\n📊 Holdings Summary:');
    holdings.forEach((h, i) => {
      console.log(
        `   ${i + 1}. ${h.security.padEnd(40)} ${h.weight}% (${h.sector})`
      );
    });

    console.log(
      `\n🎯 Test: curl http://localhost:3002/api/holdings/${schemeCode}`
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

addFundHoldings();
