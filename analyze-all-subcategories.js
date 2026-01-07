// Check subcategories from larger dataset
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
            console.log(`Parse error: ${e.message}`);
            resolve(null);
          }
        });
      })
      .on('error', (e) => {
        console.log(`Request error: ${e.message}`);
        resolve(null);
      });
  });
}

async function getAllSubcategories(category, label) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 ${label.toUpperCase()} FUNDS - SUBCATEGORY ANALYSIS`);
  console.log('='.repeat(70));

  const subcategories = {};
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    // Max 10 pages = 500 funds
    const result = await testAPI(
      `http://localhost:3002/api/funds?category=${category}&limit=50&page=${page}`
    );

    if (!result || !result.success || !result.data) {
      console.log(`❌ Failed to fetch page ${page}`);
      break;
    }

    result.data.forEach((fund) => {
      const subCat = fund.subCategory || 'Unknown';
      if (!subcategories[subCat]) {
        subcategories[subCat] = [];
      }
      subcategories[subCat].push(fund.schemeName);
    });

    hasMore = result.pagination?.hasNextPage;
    page++;

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const sorted = Object.entries(subcategories).sort(
    (a, b) => b[1].length - a[1].length
  );

  console.log(
    `\n✅ Total ${label} funds analyzed: ${Object.values(subcategories).flat().length}`
  );
  console.log(`📋 Found ${sorted.length} unique subcategories:\n`);

  sorted.forEach(([subCat, funds]) => {
    console.log(`  ${funds.length.toString().padStart(4)} funds | ${subCat}`);
    // Show 2 examples
    console.log(`       └─ ${funds[0]?.substring(0, 60)}...`);
    if (funds[1]) console.log(`       └─ ${funds[1]?.substring(0, 60)}...`);
  });
}

async function main() {
  console.log('\n🔍 COMPREHENSIVE FUND SUBCATEGORY ANALYSIS...\n');

  await getAllSubcategories('equity', 'Equity');
  await getAllSubcategories('debt', 'Debt');
  await getAllSubcategories('hybrid', 'Hybrid');

  // Search for commodity funds
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔍 COMMODITY FUNDS (GOLD/SILVER ETFs)`);
  console.log('='.repeat(70));

  const goldResult = await testAPI(
    `http://localhost:3002/api/search/funds?q=gold&limit=50`
  );
  if (goldResult && goldResult.success) {
    console.log(
      `\n📊 GOLD Funds found: ${goldResult.data?.results?.length || 0}`
    );
    if (goldResult.data?.results?.length > 0) {
      const goldSubcats = {};
      goldResult.data.results.forEach((f) => {
        const key = `${f.category} - ${f.subCategory}`;
        goldSubcats[key] = (goldSubcats[key] || 0) + 1;
      });
      Object.entries(goldSubcats).forEach(([cat, count]) => {
        console.log(`  ${count} funds in: ${cat}`);
      });
    }
  }

  const silverResult = await testAPI(
    `http://localhost:3002/api/search/funds?q=silver&limit=50`
  );
  if (silverResult && silverResult.success) {
    console.log(
      `\n📊 SILVER Funds found: ${silverResult.data?.results?.length || 0}`
    );
    if (silverResult.data?.results?.length > 0) {
      const silverSubcats = {};
      silverResult.data.results.forEach((f) => {
        const key = `${f.category} - ${f.subCategory}`;
        silverSubcats[key] = (silverSubcats[key] || 0) + 1;
      });
      Object.entries(silverSubcats).forEach(([cat, count]) => {
        console.log(`  ${count} funds in: ${cat}`);
      });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ ANALYSIS COMPLETE');
  console.log('='.repeat(70) + '\n');
}

main();
