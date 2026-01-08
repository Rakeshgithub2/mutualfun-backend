/**
 * AI-Powered Fund Data Extractor
 * Converts raw factsheet data into structured MongoDB format
 */

const mongoose = require('mongoose');
const readline = require('readline');
const fs = require('fs');
require('dotenv').config();

const FundHoldings = require('./src/models/FundHoldings.model');
const Fund = require('./src/models/Fund.model');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

const AI_EXTRACTION_PROMPT = `You are an expert financial data extraction AI. Extract mutual fund data from the input and return ONLY valid JSON.

REQUIRED OUTPUT STRUCTURE:
{
  "scheme_code": "string or null",
  "scheme_name": "string",
  "amc": "string",
  "fund_type": "equity|debt|hybrid|commodity|other",
  "category": "string",
  "report_date": "YYYY-MM-DD",
  "nav": {
    "latest": number,
    "returns": {
      "1_day": number,
      "1_month": number,
      "6_month": number,
      "1_year": number,
      "3_year": number,
      "5_year": number
    }
  },
  "holdings": [
    {
      "security": "string",
      "sector": "string",
      "weight": number,
      "market_value": number,
      "isin": "string or null"
    }
  ]
}

RULES:
- Extract ALL holdings (top 10-20 stocks)
- Normalize percentages: "8.21%" → 8.21
- Remove footnotes, totals, blank rows
- Classify sectors: Banking, IT & Software, FMCG, Pharma, etc.
- Use null for missing fields
- Return ONLY the JSON object, no explanations`;

async function parseWithAI(rawData, useOpenAI = false) {
  console.log('\n🤖 Processing data with AI...\n');

  if (useOpenAI) {
    // OpenAI GPT-4 parsing
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set in .env file');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: AI_EXTRACTION_PROMPT },
          { role: 'user', content: rawData },
        ],
        temperature: 0.1,
      }),
    });

    const result = await response.json();
    const content = result.choices[0].message.content;

    // Extract JSON from markdown code blocks if present
    const jsonMatch =
      content.match(/```json\n([\s\S]*?)\n```/) ||
      content.match(/```\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;

    return JSON.parse(jsonStr);
  } else {
    // Manual structured parsing (no AI API required)
    return parseManually(rawData);
  }
}

function parseManually(rawData) {
  console.log('📋 Manual parsing mode (paste structured data)...\n');

  const result = {
    scheme_code: null,
    scheme_name: 'Unknown Fund',
    amc: 'Unknown AMC',
    fund_type: 'equity',
    category: null,
    report_date: new Date().toISOString().split('T')[0],
    nav: {
      latest: null,
      returns: {
        '1_day': null,
        '1_month': null,
        '6_month': null,
        '1_year': null,
        '3_year': null,
        '5_year': null,
      },
    },
    holdings: [],
  };

  // Try to extract holdings from common formats
  const lines = rawData.split('\n').filter((line) => line.trim());

  for (const line of lines) {
    // Format 1: "Company Name | 8.21% | Banking"
    // Format 2: "Company Name, 8.21%, Banking"
    // Format 3: "Company Name\t8.21%\tBanking"

    const parts = line.split(/[\t|,]/).map((p) => p.trim());

    if (parts.length >= 2) {
      const security = parts[0];
      const weightStr = parts[1];
      const sector = parts[2] || 'Others';

      // Skip headers
      if (
        security.toLowerCase().includes('company') ||
        security.toLowerCase().includes('name') ||
        security.toLowerCase().includes('security')
      ) {
        continue;
      }

      // Extract percentage
      const weightMatch = weightStr.match(/(\d+\.?\d*)/);
      if (weightMatch) {
        result.holdings.push({
          security: security.replace(/^\d+\.?\s*/, '').trim(), // Remove line numbers
          sector: sector,
          weight: parseFloat(weightMatch[1]),
          market_value: null,
          isin: null,
        });
      }
    }
  }

  return result;
}

async function importToDatabase(fundData) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const {
      scheme_code,
      scheme_name,
      amc,
      fund_type,
      category,
      report_date,
      nav,
      holdings,
    } = fundData;

    // Update or create fund
    let fund = scheme_code
      ? await Fund.findOne({ schemeCode: scheme_code })
      : null;

    if (!fund && scheme_code) {
      fund = new Fund({
        schemeCode: scheme_code,
        schemeName: scheme_name,
        amc: { name: amc },
        category: fund_type,
        subCategory: category,
        nav: {
          value: nav.latest,
          date: new Date(report_date),
        },
        returns: {
          '1D': nav.returns['1_day'],
          '1M': nav.returns['1_month'],
          '6M': nav.returns['6_month'],
          '1Y': nav.returns['1_year'],
          '3Y': nav.returns['3_year'],
          '5Y': nav.returns['5_year'],
        },
      });
      await fund.save();
      console.log(`✅ Created fund: ${scheme_name}`);
    } else if (fund) {
      console.log(`✅ Found existing fund: ${fund.schemeName}`);
    }

    // Import holdings
    if (holdings && holdings.length > 0) {
      // Delete existing holdings
      if (scheme_code) {
        await FundHoldings.deleteMany({ schemeCode: scheme_code });
      }

      const holdingsDocs = holdings.map((h) => ({
        schemeCode: scheme_code || 'MANUAL',
        fundName: scheme_name,
        security: h.security,
        weight: h.weight,
        marketValue: h.market_value,
        sector: h.sector,
        isin: h.isin,
        reportDate: new Date(report_date),
        source: 'MANUAL',
        importedAt: new Date(),
      }));

      await FundHoldings.insertMany(holdingsDocs);
      console.log(`✅ Imported ${holdings.length} holdings`);

      console.log('\n📊 Holdings Summary:');
      holdings.slice(0, 10).forEach((h, i) => {
        console.log(
          `   ${i + 1}. ${h.security.padEnd(40)} ${h.weight}% (${h.sector})`
        );
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Import Complete!');
    console.log('='.repeat(70));

    if (scheme_code) {
      console.log(
        `\n🎯 Test: curl http://localhost:3002/api/holdings/${scheme_code}`
      );
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 AI-POWERED FUND DATA EXTRACTOR');
  console.log('='.repeat(70));

  console.log('\n📋 Instructions:');
  console.log('   1. Copy data from fund factsheet (PDF/Excel/Website)');
  console.log('   2. Paste below (press Ctrl+D or Ctrl+Z when done)');
  console.log('   3. AI will structure and import to MongoDB');

  console.log('\n💡 Supported Formats:');
  console.log('   • Company Name | 8.21% | Banking');
  console.log('   • Company Name, 8.21%, Banking');
  console.log('   • Copy-paste from Excel (tab-separated)');

  console.log('\n📝 Paste your data (Ctrl+D to finish):\n');
  console.log('-'.repeat(70));

  let rawData = '';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  for await (const line of rl) {
    rawData += line + '\n';
  }

  console.log('-'.repeat(70));

  if (!rawData.trim()) {
    console.log('❌ No data provided');
    process.exit(1);
  }

  try {
    // Parse the data (manual mode by default, add OpenAI key for AI mode)
    const fundData = await parseWithAI(rawData, false);

    console.log('\n✅ Parsed Data:');
    console.log(JSON.stringify(fundData, null, 2));

    // Import to database
    await importToDatabase(fundData);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Check if reading from file
if (process.argv[2]) {
  const filePath = process.argv[2];
  console.log(`\n📁 Reading from file: ${filePath}`);

  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('❌ Error reading file:', err.message);
      process.exit(1);
    }

    try {
      const fundData = await parseWithAI(data, false);
      await importToDatabase(fundData);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });
} else {
  main();
}
