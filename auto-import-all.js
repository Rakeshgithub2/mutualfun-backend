/**
 * Complete Automated Solution - Fetch Real Funds + Holdings
 * 1. Gets real fund data from MFAPI.in (free API with 40,000+ funds)
 * 2. Scrapes holdings from MoneyControl
 * 3. Imports everything to MongoDB
 */

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

// Popular fund scheme codes from MFAPI
const POPULAR_FUNDS = [
  '120503', // HDFC Top 100 Fund
  '118989', // ICICI Prudential Bluechip Fund
  '119551', // SBI Bluechip Fund
  '120716', // Axis Bluechip Fund
  '118825', // HDFC Balanced Advantage Fund
  '119173', // ICICI Prudential Equity & Debt Fund
  '119183', // SBI Equity Hybrid Fund
  '120466', // Axis Midcap Fund
  '118424', // HDFC Mid-Cap Opportunities Fund
  '119097', // ICICI Prudential Technology Fund
  '119550', // SBI Technology Opportunities Fund
  '120719', // Axis Small Cap Fund
  '120834', // Nippon India Small Cap Fund
  '119240', // ICICI Prudential Banking & Financial Services Fund
  '102885', // Parag Parikh Flexi Cap Fund
  '135791', // Quant Active Fund
  '112090', // UTI Flexi Cap Fund
  '145552', // HDFC Flexi Cap Fund
  '100027', // Aditya Birla Sun Life Frontline Equity Fund
  '125497', // Kotak Bluechip Fund
];

function classifySector(companyName) {
  const lower = companyName.toLowerCase();

  if (/(hdfc|icici|sbi|axis|kotak|bank)/i.test(lower)) return 'Banking';
  if (/(tcs|infosys|wipro|tech mahindra|hcl|mindtree)/i.test(lower))
    return 'IT & Software';
  if (/(sun pharma|cipla|dr reddy|lupin|biocon|divi)/i.test(lower))
    return 'Pharma & Healthcare';
  if (/(hindustan unilever|hul|itc|britannia|nestle|dabur|marico)/i.test(lower))
    return 'FMCG';
  if (/(reliance|ongc|bpcl|hpcl|ntpc|power grid|coal india)/i.test(lower))
    return 'Energy & Power';
  if (/(maruti|tata motors|mahindra|bajaj auto|hero)/i.test(lower))
    return 'Automobile';
  if (/(bajaj finance|bajaj finserv|hdfc life|sbi life)/i.test(lower))
    return 'Financial Services';
  if (/(airtel|jio|vodafone)/i.test(lower)) return 'Telecom';
  if (/(larsen|toubro|l&t|ultratech|ambuja|acc)/i.test(lower))
    return 'Infrastructure';
  if (/(tata steel|jsw|hindalco|vedanta)/i.test(lower))
    return 'Metals & Mining';

  return 'Others';
}

async function fetchFundDataFromMFAPI(schemeCode) {
  try {
    const url = `https://api.mfapi.in/mf/${schemeCode}`;
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data && response.data.meta) {
      return {
        schemeCode: response.data.meta.scheme_code,
        schemeName: response.data.meta.scheme_name,
        schemeType: response.data.meta.scheme_type || 'Equity',
        fundHouse: response.data.meta.fund_house,
        schemeCategory: response.data.meta.scheme_category || 'Equity',
      };
    }
    return null;
  } catch (error) {
    console.log(`   ⚠️  MFAPI error for ${schemeCode}: ${error.message}`);
    return null;
  }
}

async function scrapeHoldingsFromMoneyControl(fundName) {
  try {
    // Search for fund
    const searchQuery = fundName
      .replace(/\s+/g, '+')
      .replace(/Fund/gi, '')
      .trim();

    const searchUrl = `https://www.moneycontrol.com/mutual-funds/nav/search?query=${searchQuery}`;

    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(searchResponse.data);

    // Find fund link
    const fundLinks = $('a[href*="/mutual-funds/"]').toArray();
    if (fundLinks.length === 0) {
      return null;
    }

    let fundUrl = $(fundLinks[0]).attr('href');
    if (!fundUrl.startsWith('http')) {
      fundUrl = 'https://www.moneycontrol.com' + fundUrl;
    }

    // Get portfolio page
    const portfolioUrl =
      fundUrl.replace('#nav', '').replace('/snapshot', '') +
      '/portfolio-holdings';

    const portfolioResponse = await axios.get(portfolioUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $$ = cheerio.load(portfolioResponse.data);
    const holdings = [];

    // Try multiple table selectors
    const tables = $$('table').toArray();

    for (const table of tables) {
      $$(table)
        .find('tr')
        .each((i, row) => {
          if (i === 0) return; // Skip header

          const cols = $$(row).find('td');
          if (cols.length >= 2) {
            const security = $$(cols[0]).text().trim();
            const weightText = $$(cols[1]).text().trim();

            // Extract percentage
            const weightMatch = weightText.match(/(\d+\.?\d*)/);

            if (weightMatch && security && security.length > 3) {
              const weight = parseFloat(weightMatch[1]);

              // Skip if unrealistic weight
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
    }

    // Deduplicate
    const uniqueHoldings = [];
    const seen = new Set();

    for (const h of holdings) {
      if (!seen.has(h.security)) {
        seen.add(h.security);
        uniqueHoldings.push(h);
      }
    }

    return uniqueHoldings.length > 0 ? uniqueHoldings : null;
  } catch (error) {
    return null;
  }
}

async function generateSampleHoldings(fundType, fundName) {
  // Generate realistic sample holdings based on fund type (15-20 holdings minimum)
  const holdings = [];

  if (
    fundName.toLowerCase().includes('bluechip') ||
    fundName.toLowerCase().includes('large cap')
  ) {
    holdings.push(
      { security: 'HDFC Bank Ltd', weight: 9.42, sector: 'Banking' },
      { security: 'ICICI Bank Ltd', weight: 8.71, sector: 'Banking' },
      {
        security: 'Reliance Industries Ltd',
        weight: 8.23,
        sector: 'Energy & Power',
      },
      { security: 'Infosys Ltd', weight: 7.56, sector: 'IT & Software' },
      {
        security: 'Tata Consultancy Services Ltd',
        weight: 6.89,
        sector: 'IT & Software',
      },
      { security: 'State Bank of India', weight: 5.34, sector: 'Banking' },
      { security: 'Bharti Airtel Ltd', weight: 4.87, sector: 'Telecom' },
      { security: 'Hindustan Unilever Ltd', weight: 4.23, sector: 'FMCG' },
      { security: 'Kotak Mahindra Bank Ltd', weight: 3.98, sector: 'Banking' },
      { security: 'ITC Ltd', weight: 3.67, sector: 'FMCG' },
      {
        security: 'Larsen & Toubro Ltd',
        weight: 3.45,
        sector: 'Infrastructure',
      },
      { security: 'Axis Bank Ltd', weight: 3.12, sector: 'Banking' },
      {
        security: 'Bajaj Finance Ltd',
        weight: 2.89,
        sector: 'Financial Services',
      },
      { security: 'Asian Paints Ltd', weight: 2.67, sector: 'Others' },
      {
        security: 'Maruti Suzuki India Ltd',
        weight: 2.45,
        sector: 'Automobile',
      },
      {
        security: 'HCL Technologies Ltd',
        weight: 2.23,
        sector: 'IT & Software',
      },
      { security: 'Ultratech Cement Ltd', weight: 2.01, sector: 'Cement' },
      { security: 'Titan Company Ltd', weight: 1.89, sector: 'Others' },
      { security: 'Nestle India Ltd', weight: 1.67, sector: 'FMCG' },
      {
        security: 'Sun Pharmaceutical Industries Ltd',
        weight: 1.45,
        sector: 'Pharma & Healthcare',
      }
    );
  } else if (
    fundName.toLowerCase().includes('technology') ||
    fundName.toLowerCase().includes('tech')
  ) {
    holdings.push(
      {
        security: 'Tata Consultancy Services Ltd',
        weight: 18.23,
        sector: 'IT & Software',
      },
      { security: 'Infosys Ltd', weight: 16.45, sector: 'IT & Software' },
      { security: 'Wipro Ltd', weight: 12.34, sector: 'IT & Software' },
      {
        security: 'HCL Technologies Ltd',
        weight: 11.89,
        sector: 'IT & Software',
      },
      { security: 'Tech Mahindra Ltd', weight: 9.67, sector: 'IT & Software' },
      { security: 'LTI Mindtree Ltd', weight: 7.23, sector: 'IT & Software' },
      {
        security: 'Persistent Systems Ltd',
        weight: 5.89,
        sector: 'IT & Software',
      },
      { security: 'Mphasis Ltd', weight: 4.56, sector: 'IT & Software' },
      { security: 'Coforge Ltd', weight: 3.78, sector: 'IT & Software' },
      {
        security: 'L&T Technology Services Ltd',
        weight: 3.21,
        sector: 'IT & Software',
      },
      { security: 'Tata Elxsi Ltd', weight: 2.45, sector: 'IT & Software' },
      {
        security: 'Happiest Minds Technologies Ltd',
        weight: 1.89,
        sector: 'IT & Software',
      },
      { security: 'Cyient Ltd', weight: 1.67, sector: 'IT & Software' },
      {
        security: 'Zensar Technologies Ltd',
        weight: 0.74,
        sector: 'IT & Software',
      }
    );
  } else if (
    fundName.toLowerCase().includes('midcap') ||
    fundName.toLowerCase().includes('mid cap')
  ) {
    holdings.push(
      {
        security: 'Persistent Systems Ltd',
        weight: 6.78,
        sector: 'IT & Software',
      },
      {
        security: 'Tube Investments of India Ltd',
        weight: 5.89,
        sector: 'Automobile',
      },
      { security: 'Polycab India Ltd', weight: 5.34, sector: 'Infrastructure' },
      {
        security: 'Dixon Technologies India Ltd',
        weight: 4.98,
        sector: 'IT & Software',
      },
      { security: 'Trent Ltd', weight: 4.67, sector: 'Others' },
      {
        security: 'Cholamandalam Investment and Finance Company Ltd',
        weight: 4.23,
        sector: 'Financial Services',
      },
      {
        security: 'Info Edge India Ltd',
        weight: 3.89,
        sector: 'IT & Software',
      },
      { security: 'PI Industries Ltd', weight: 3.56, sector: 'Others' },
      {
        security: 'Max Healthcare Institute Ltd',
        weight: 3.34,
        sector: 'Pharma & Healthcare',
      },
      { security: 'Cummins India Ltd', weight: 3.12, sector: 'Automobile' },
      { security: 'Coforge Ltd', weight: 2.89, sector: 'IT & Software' },
      { security: 'Page Industries Ltd', weight: 2.67, sector: 'Others' },
      { security: 'Voltas Ltd', weight: 2.45, sector: 'Others' },
      { security: 'Mphasis Ltd', weight: 2.23, sector: 'IT & Software' },
      {
        security: 'Torrent Pharmaceuticals Ltd',
        weight: 2.01,
        sector: 'Pharma & Healthcare',
      },
      { security: 'Astral Ltd', weight: 1.89, sector: 'Infrastructure' },
      {
        security: 'Balkrishna Industries Ltd',
        weight: 1.67,
        sector: 'Automobile',
      },
      {
        security: 'Apollo Hospitals Enterprise Ltd',
        weight: 1.45,
        sector: 'Pharma & Healthcare',
      }
    );
  } else if (
    fundName.toLowerCase().includes('banking') ||
    fundName.toLowerCase().includes('financial')
  ) {
    holdings.push(
      { security: 'HDFC Bank Ltd', weight: 15.34, sector: 'Banking' },
      { security: 'ICICI Bank Ltd', weight: 14.67, sector: 'Banking' },
      { security: 'State Bank of India', weight: 12.89, sector: 'Banking' },
      { security: 'Kotak Mahindra Bank Ltd', weight: 10.23, sector: 'Banking' },
      { security: 'Axis Bank Ltd', weight: 9.56, sector: 'Banking' },
      {
        security: 'Bajaj Finance Ltd',
        weight: 8.78,
        sector: 'Financial Services',
      },
      {
        security: 'Bajaj Finserv Ltd',
        weight: 7.34,
        sector: 'Financial Services',
      },
      { security: 'IndusInd Bank Ltd', weight: 6.12, sector: 'Banking' },
      {
        security: 'HDFC Life Insurance Company Ltd',
        weight: 5.67,
        sector: 'Financial Services',
      },
      {
        security: 'SBI Life Insurance Company Ltd',
        weight: 4.89,
        sector: 'Financial Services',
      },
      {
        security: 'ICICI Prudential Life Insurance Company Ltd',
        weight: 4.23,
        sector: 'Financial Services',
      },
      {
        security: 'Cholamandalam Investment and Finance Company Ltd',
        weight: 3.67,
        sector: 'Financial Services',
      },
      {
        security: 'Shriram Finance Ltd',
        weight: 3.12,
        sector: 'Financial Services',
      },
      { security: 'Federal Bank Ltd', weight: 2.89, sector: 'Banking' },
      { security: 'Bandhan Bank Ltd', weight: 2.34, sector: 'Banking' }
    );
  } else if (
    fundName.toLowerCase().includes('small cap') ||
    fundName.toLowerCase().includes('smallcap')
  ) {
    holdings.push(
      {
        security: 'Mazagon Dock Shipbuilders Ltd',
        weight: 4.89,
        sector: 'Infrastructure',
      },
      { security: 'Vardhman Textiles Ltd', weight: 4.23, sector: 'Others' },
      {
        security: 'Craftsman Automation Ltd',
        weight: 3.98,
        sector: 'Automobile',
      },
      { security: 'Carborundum Universal Ltd', weight: 3.67, sector: 'Others' },
      {
        security: 'Restaurant Brands Asia Ltd',
        weight: 3.45,
        sector: 'Others',
      },
      {
        security: 'Garden Reach Shipbuilders & Engineers Ltd',
        weight: 3.23,
        sector: 'Infrastructure',
      },
      {
        security: 'Fine Organic Industries Ltd',
        weight: 3.01,
        sector: 'Others',
      },
      { security: 'JK Cement Ltd', weight: 2.89, sector: 'Cement' },
      {
        security: 'KPIT Technologies Ltd',
        weight: 2.67,
        sector: 'IT & Software',
      },
      { security: 'SKF India Ltd', weight: 2.45, sector: 'Automobile' },
      {
        security: 'Amber Enterprises India Ltd',
        weight: 2.23,
        sector: 'Others',
      },
      {
        security: 'Sona BLW Precision Forgings Ltd',
        weight: 2.01,
        sector: 'Automobile',
      },
      {
        security: 'CG Power and Industrial Solutions Ltd',
        weight: 1.89,
        sector: 'Infrastructure',
      },
      {
        security: 'Thyrocare Technologies Ltd',
        weight: 1.67,
        sector: 'Pharma & Healthcare',
      },
      { security: 'Lemon Tree Hotels Ltd', weight: 1.45, sector: 'Others' },
      { security: 'Route Mobile Ltd', weight: 1.23, sector: 'IT & Software' }
    );
  } else {
    // Generic Equity Fund
    holdings.push(
      { security: 'HDFC Bank Ltd', weight: 8.45, sector: 'Banking' },
      {
        security: 'Reliance Industries Ltd',
        weight: 7.89,
        sector: 'Energy & Power',
      },
      { security: 'ICICI Bank Ltd', weight: 7.23, sector: 'Banking' },
      { security: 'Infosys Ltd', weight: 6.78, sector: 'IT & Software' },
      {
        security: 'Tata Consultancy Services Ltd',
        weight: 5.94,
        sector: 'IT & Software',
      },
      { security: 'Bharti Airtel Ltd', weight: 4.56, sector: 'Telecom' },
      { security: 'State Bank of India', weight: 4.23, sector: 'Banking' },
      { security: 'Hindustan Unilever Ltd', weight: 3.89, sector: 'FMCG' },
      {
        security: 'Larsen & Toubro Ltd',
        weight: 3.67,
        sector: 'Infrastructure',
      },
      { security: 'Axis Bank Ltd', weight: 3.34, sector: 'Banking' },
      {
        security: 'Bajaj Finance Ltd',
        weight: 3.12,
        sector: 'Financial Services',
      },
      { security: 'ITC Ltd', weight: 2.89, sector: 'FMCG' },
      { security: 'Kotak Mahindra Bank Ltd', weight: 2.67, sector: 'Banking' },
      { security: 'Asian Paints Ltd', weight: 2.45, sector: 'Others' },
      {
        security: 'HCL Technologies Ltd',
        weight: 2.23,
        sector: 'IT & Software',
      },
      {
        security: 'Maruti Suzuki India Ltd',
        weight: 2.01,
        sector: 'Automobile',
      },
      { security: 'Ultratech Cement Ltd', weight: 1.89, sector: 'Cement' },
      { security: 'Wipro Ltd', weight: 1.67, sector: 'IT & Software' },
      { security: 'Titan Company Ltd', weight: 1.45, sector: 'Others' },
      {
        security: 'Sun Pharmaceutical Industries Ltd',
        weight: 1.23,
        sector: 'Pharma & Healthcare',
      }
    );
  }

  return holdings;
}

async function importToDatabase(fundData, holdings) {
  const db = mongoose.connection.db;

  // Update/Insert fund
  const fundsCollection = db.collection('funds');
  await fundsCollection.updateOne(
    { schemeCode: fundData.schemeCode },
    {
      $set: {
        schemeCode: fundData.schemeCode,
        schemeName: fundData.schemeName,
        schemeType: fundData.schemeType,
        fundHouse: fundData.fundHouse,
        schemeCategory: fundData.schemeCategory,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  // Import holdings
  if (holdings && holdings.length > 0) {
    const holdingsCollection = db.collection('fund_holdings');

    // Delete old holdings
    await holdingsCollection.deleteMany({ schemeCode: fundData.schemeCode });

    // Insert new holdings
    const docs = holdings.map((h) => ({
      schemeCode: fundData.schemeCode,
      fundName: fundData.schemeName,
      security: h.security,
      weight: h.weight,
      sector: h.sector,
      reportDate: new Date(),
      source: h.source || 'AUTO_SCRAPE',
      importedAt: new Date(),
    }));

    await holdingsCollection.insertMany(docs);
    return docs.length;
  }

  return 0;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 COMPLETE AUTOMATED FUND + HOLDINGS IMPORTER');
  console.log('='.repeat(70));
  console.log('This will:');
  console.log('  1️⃣  Fetch real fund data from MFAPI.in (40,000+ funds)');
  console.log('  2️⃣  Try to scrape holdings from MoneyControl');
  console.log('  3️⃣  Generate realistic sample holdings if scraping fails');
  console.log('  4️⃣  Import everything to MongoDB');
  console.log('='.repeat(70) + '\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  let totalProcessed = 0;
  let successCount = 0;
  let scrapedCount = 0;
  let sampleCount = 0;

  for (const schemeCode of POPULAR_FUNDS) {
    totalProcessed++;
    console.log(
      `\n[${totalProcessed}/${POPULAR_FUNDS.length}] Processing scheme ${schemeCode}...`
    );

    // Get fund data from MFAPI
    const fundData = await fetchFundDataFromMFAPI(schemeCode);

    if (!fundData) {
      console.log(`   ❌ Could not fetch fund data`);
      continue;
    }

    console.log(`   ✅ ${fundData.schemeName}`);
    console.log(`   📁 ${fundData.fundHouse}`);

    // Try to scrape holdings
    console.log(`   🔍 Attempting to scrape holdings...`);
    let holdings = await scrapeHoldingsFromMoneyControl(fundData.schemeName);

    if (holdings && holdings.length >= 5) {
      console.log(
        `   ✅ Scraped ${holdings.length} real holdings from MoneyControl!`
      );
      scrapedCount++;
    } else {
      console.log(`   ⚠️  Scraping failed, generating realistic sample...`);
      holdings = await generateSampleHoldings(
        fundData.schemeType,
        fundData.schemeName
      );
      holdings = holdings.map((h) => ({ ...h, source: 'SAMPLE' }));
      sampleCount++;
    }

    // Import to database
    const holdingsCount = await importToDatabase(fundData, holdings);

    if (holdingsCount > 0) {
      console.log(`   ✅ Imported ${holdingsCount} holdings to database`);

      // Show top 10
      console.log(`   📊 Top 10 Holdings:`);
      holdings.slice(0, 10).forEach((h, i) => {
        console.log(
          `      ${i + 1}. ${h.security.substring(0, 35).padEnd(35)} ${h.weight.toFixed(2)}%`
        );
      });

      successCount++;
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Stop after 15 funds for demo
    if (totalProcessed >= 15) {
      console.log('\n✅ Processed 15 funds. Stopping for now.');
      break;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 IMPORT COMPLETE');
  console.log('='.repeat(70));
  console.log(`   ✅ Successfully imported: ${successCount} funds`);
  console.log(`   🌐 Real scraped holdings: ${scrapedCount} funds`);
  console.log(`   📝 Sample holdings: ${sampleCount} funds`);
  console.log('\n🎯 Test your API:');
  console.log(`   curl http://localhost:3002/api/holdings/${POPULAR_FUNDS[0]}`);
  console.log(`   curl http://localhost:3002/api/holdings/stats`);
  console.log('\n📱 View in frontend:');
  console.log(`   http://localhost:5001/equity/${POPULAR_FUNDS[0]}`);

  await mongoose.disconnect();
  console.log('\n✅ Done!\n');
}

main().catch(console.error);
