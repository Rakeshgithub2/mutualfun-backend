// Check subcategories for each main category
const http = require('http');

async function testAPI(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

async function getSubcategories(category, label) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 ${label.toUpperCase()} SUBCATEGORIES`);
  console.log('='.repeat(60));

  // Fetch first 100 funds from this category
  const result = await testAPI(
    `http://localhost:3002/api/funds?category=${category}&limit=100`
  );

  if (!result || !result.success) {
    console.log(`❌ Failed to fetch ${label} funds`);
    return;
  }

  console.log(`Total ${label} funds: ${result.pagination.totalItems}`);

  // Extract unique subcategories
  const subcategories = {};
  result.data.forEach((fund) => {
    const subCat = fund.subCategory || 'Unknown';
    subcategories[subCat] = (subcategories[subCat] || 0) + 1;
  });

  // Sort by count
  const sorted = Object.entries(subcategories).sort((a, b) => b[1] - a[1]);

  console.log(
    `\nFound ${sorted.length} subcategories (from first 100 funds):\n`
  );
  sorted.forEach(([subCat, count]) => {
    console.log(`  ${count.toString().padStart(3)} | ${subCat}`);
  });
}

async function searchCommodity() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 SEARCHING FOR COMMODITY FUNDS`);
  console.log('='.repeat(60));

  const keywords = ['gold', 'silver', 'commodity'];

  for (const keyword of keywords) {
    const result = await testAPI(
      `http://localhost:3002/api/search/funds?q=${keyword}&limit=20`
    );

    if (result && result.success && result.data.results) {
      console.log(
        `\n"${keyword.toUpperCase()}" - Found ${result.data.results.length} funds:`
      );
      result.data.results.slice(0, 5).forEach((fund) => {
        console.log(`  - ${fund.schemeName.substring(0, 70)}...`);
        console.log(
          `    Category: ${fund.category} | SubCategory: ${fund.subCategory}`
        );
      });
    }
  }
}

async function main() {
  console.log('\n🔍 ANALYZING FUND CATEGORIES AND SUBCATEGORIES...\n');

  await getSubcategories('equity', 'Equity');
  await getSubcategories('debt', 'Debt');
  await getSubcategories('hybrid', 'Hybrid');
  await searchCommodity();

  console.log('\n' + '='.repeat(60));
  console.log('✅ ANALYSIS COMPLETE');
  console.log('='.repeat(60) + '\n');
}

main();
