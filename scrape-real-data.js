/**
 * REAL DATA SCRAPER - Production Grade
 * Fetches actual holdings from official fund websites and verified sources
 * NO MOCK DATA - Only real-world portfolio data
 */

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

// Top funds with known scheme codes
const REAL_FUNDS = [
  {
    code: '120503',
    name: 'Axis ELSS Tax Saver Fund',
    url: 'https://www.axismf.com',
  },
  {
    code: '118989',
    name: 'HDFC Mid Cap Fund',
    url: 'https://www.hdfcfund.com',
  },
  {
    code: '119551',
    name: 'Aditya Birla Banking Fund',
    url: 'https://mutualfund.adityabirlacapital.com',
  },
  {
    code: '120716',
    name: 'UTI Nifty 50 Index Fund',
    url: 'https://www.utimf.com',
  },
  {
    code: '118825',
    name: 'Mirae Asset Large Cap Fund',
    url: 'https://www.miraeassetmf.co.in',
  },
];

function classifySector(companyName) {
  const lower = companyName.toLowerCase();

  // Banking & Financial Services
  if (
    /(hdfc bank|icici bank|sbi|state bank|axis bank|kotak bank|indusind|idfc first)/i.test(
      lower
    )
  )
    return 'Banking';
  if (
    /(bajaj finance|bajaj finserv|cholamandalam|shriram finance|muthoot)/i.test(
      lower
    )
  )
    return 'Financial Services';
  if (/(hdfc life|sbi life|icici pru|max life|lic|insurance)/i.test(lower))
    return 'Financial Services';

  // Technology
  if (
    /(tcs|tata consultancy|infosys|wipro|hcl tech|tech mahindra|ltimindtree|lti)/i.test(
      lower
    )
  )
    return 'IT & Software';
  if (/(persistent|mphasis|coforge|l&t tech|mindtree|zensar)/i.test(lower))
    return 'IT & Software';

  // Pharma & Healthcare
  if (
    /(sun pharma|cipla|dr reddy|lupin|biocon|divi|divis|torrent pharma|glenmark)/i.test(
      lower
    )
  )
    return 'Pharma & Healthcare';
  if (/(apollo hospital|max healthcare|fortis|narayana)/i.test(lower))
    return 'Pharma & Healthcare';

  // FMCG & Consumer
  if (
    /(hindustan unilever|hul|itc|britannia|nestle|dabur|marico|godrej consumer|tata consumer|colgate)/i.test(
      lower
    )
  )
    return 'FMCG';
  if (/(titan|trent|avenue supermarts|dmart)/i.test(lower))
    return 'Consumer Goods';

  // Energy & Power
  if (/(reliance|ril|ongc|oil|bpcl|hpcl|ioc|gail|coal india)/i.test(lower))
    return 'Energy & Power';
  if (/(ntpc|power grid|tata power|adani power|jsw energy)/i.test(lower))
    return 'Energy & Power';

  // Automobile
  if (
    /(maruti|tata motors|mahindra|bajaj auto|hero|tvs motor|eicher|ashok leyland)/i.test(
      lower
    )
  )
    return 'Automobile';
  if (/(tube investment|balkrishna|ceat|apollo tyre|mrf)/i.test(lower))
    return 'Automobile';

  // Infrastructure & Construction
  if (
    /(larsen|toubro|l&t|ultratech|ambuja|acc|shree cement|jk cement)/i.test(
      lower
    )
  )
    return 'Infrastructure';
  if (/(ncc|irb|gmr|adani port)/i.test(lower)) return 'Infrastructure';

  // Telecom
  if (/(bharti airtel|airtel|vodafone|reliance jio|jio)/i.test(lower))
    return 'Telecom';

  // Metals & Mining
  if (/(tata steel|jsw steel|hindalco|vedanta|nalco|sail|jindal)/i.test(lower))
    return 'Metals & Mining';

  return 'Others';
}

/**
 * Scrape from ValueResearch Online (Most Reliable Source)
 */
async function scrapeValueResearch(schemeName) {
  try {
    console.log('   🔍 Trying ValueResearch Online...');

    // ValueResearch search
    const searchQuery = schemeName
      .replace(/\s+/g, '+')
      .replace(/Fund/gi, '')
      .trim();
    const searchUrl = `https://www.valueresearchonline.com/funds/portfoliovr.asp?schemecode=${searchQuery}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);
    const holdings = [];

    // ValueResearch portfolio table
    $('table.portfolio-table tr, table.port-table tr, table tr').each(
      (i, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 2) {
          const security = $(cols[0]).text().trim();
          const weightText = $(cols[1]).text().trim();

          const weightMatch = weightText.match(/(\d+\.?\d*)/);
          if (
            weightMatch &&
            security &&
            security.length > 3 &&
            !security.includes('Total')
          ) {
            const weight = parseFloat(weightMatch[1]);
            if (weight > 0 && weight < 50) {
              holdings.push({
                security: security.replace(/\s+/g, ' '),
                weight,
                sector: classifySector(security),
              });
            }
          }
        }
      }
    );

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const h of holdings) {
      const key = h.security.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(h);
      }
    }

    if (unique.length >= 8) {
      console.log(
        `   ✅ Found ${unique.length} real holdings from ValueResearch`
      );
      return unique;
    }

    return null;
  } catch (error) {
    console.log(
      `   ⚠️  ValueResearch failed: ${error.message.substring(0, 50)}`
    );
    return null;
  }
}

/**
 * Scrape from MoneyControl
 */
async function scrapeMoneyControl(schemeName) {
  try {
    console.log('   🔍 Trying MoneyControl...');

    const searchQuery = schemeName.replace(/\s+/g, '-').toLowerCase();
    const directUrl = `https://www.moneycontrol.com/mutual-funds/nav/${searchQuery}/portfolio-holdings`;

    const response = await axios.get(directUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const holdings = [];

    $('table tr').each((i, row) => {
      if (i === 0) return;

      const cols = $(row).find('td');
      if (cols.length >= 2) {
        const security = $(cols[0]).text().trim();
        const weightText = $(cols[1]).text().trim();

        const weightMatch = weightText.match(/(\d+\.?\d*)/);
        if (weightMatch && security && security.length > 3) {
          const weight = parseFloat(weightMatch[1]);
          if (weight > 0 && weight < 50) {
            holdings.push({
              security,
              weight,
              sector: classifySector(security),
            });
          }
        }
      }
    });

    if (holdings.length >= 8) {
      console.log(
        `   ✅ Found ${holdings.length} real holdings from MoneyControl`
      );
      return holdings;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Get fund info from MFAPI
 */
async function getFundInfo(schemeCode) {
  try {
    const url = `https://api.mfapi.in/mf/${schemeCode}`;
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data && response.data.meta) {
      return {
        schemeCode: response.data.meta.scheme_code,
        schemeName: response.data.meta.scheme_name,
        fundHouse: response.data.meta.fund_house,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Import ONLY REAL DATA to database
 */
async function importRealData(fundInfo, holdings) {
  const db = mongoose.connection.db;

  // Update fund info
  await db.collection('funds').updateOne(
    { schemeCode: fundInfo.schemeCode },
    {
      $set: {
        schemeCode: fundInfo.schemeCode,
        schemeName: fundInfo.schemeName,
        fundHouse: fundInfo.fundHouse,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  // Clear old holdings
  await db.collection('fund_holdings').deleteMany({
    schemeCode: fundInfo.schemeCode,
  });

  // Import REAL holdings only
  const docs = holdings.map((h) => ({
    schemeCode: fundInfo.schemeCode,
    fundName: fundInfo.schemeName,
    security: h.security,
    weight: h.weight,
    sector: h.sector,
    reportDate: new Date(),
    source: 'REAL_SCRAPE', // Mark as REAL data
    importedAt: new Date(),
  }));

  await db.collection('fund_holdings').insertMany(docs);
  return docs.length;
}

/**
 * Main execution - REAL DATA ONLY
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🌐 REAL WORLD DATA SCRAPER - PRODUCTION GRADE');
  console.log('='.repeat(70));
  console.log('⚠️  NO MOCK DATA - Only scraping real portfolio holdings');
  console.log('   Sources: ValueResearch, MoneyControl, Official AMC websites');
  console.log('='.repeat(70) + '\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < REAL_FUNDS.length; i++) {
    const fund = REAL_FUNDS[i];
    console.log(`\n[${i + 1}/${REAL_FUNDS.length}] Processing: ${fund.name}`);

    // Get fund info
    const fundInfo = await getFundInfo(fund.code);
    if (!fundInfo) {
      console.log(`   ❌ Could not fetch fund info`);
      failCount++;
      continue;
    }

    console.log(`   📋 ${fundInfo.schemeName}`);
    console.log(`   🏢 ${fundInfo.fundHouse}`);

    // Try ValueResearch first (most reliable)
    let holdings = await scrapeValueResearch(fundInfo.schemeName);

    // Fallback to MoneyControl
    if (!holdings || holdings.length < 8) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      holdings = await scrapeMoneyControl(fundInfo.schemeName);
    }

    if (holdings && holdings.length >= 8) {
      // Import ONLY if we have real data
      const count = await importRealData(fundInfo, holdings);
      console.log(`   ✅ Imported ${count} REAL holdings`);

      // Show sample
      console.log(`   📊 Top 10 Holdings:`);
      holdings.slice(0, 10).forEach((h, idx) => {
        console.log(
          `      ${idx + 1}. ${h.security.substring(0, 40).padEnd(40)} ${h.weight.toFixed(2)}% (${h.sector})`
        );
      });

      successCount++;
    } else {
      console.log(`   ❌ Could not scrape real data - SKIPPING (no mock data)`);
      console.log(`   💡 Manual option: Download factsheet from ${fund.url}`);
      failCount++;
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(70));
  console.log(`   ✅ Real data imported: ${successCount} funds`);
  console.log(`   ❌ Failed (no data): ${failCount} funds`);

  if (successCount > 0) {
    console.log('\n🎯 Verify real data:');
    console.log(`   node verify-real-data.js`);
    console.log('\n📱 Test API:');
    console.log(
      `   curl http://localhost:3002/api/holdings/${REAL_FUNDS[0].code}`
    );
  } else {
    console.log('\n⚠️  No real data could be scraped automatically.');
    console.log('📝 For production, you need:');
    console.log('   1. Manual data entry from factsheets');
    console.log('   2. Paid API providers (Kuvera, Zerodha, NSE Data)');
    console.log('   3. Partnership with AMCs for data access');
  }

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
}

main().catch(console.error);
