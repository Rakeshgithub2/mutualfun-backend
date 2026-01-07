// Simple HTTP test to check API
const http = require('http');

async function testAPI(url, label) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(`\n${label}:`);
            console.log(`  Success: ${json.success}`);
            if (json.data && Array.isArray(json.data)) {
              console.log(`  Count: ${json.data.length}`);
              if (json.pagination) {
                console.log(`  Total: ${json.pagination.totalItems}`);
              }
              if (json.data.length > 0) {
                console.log(
                  `  Sample: ${json.data[0].schemeName?.substring(0, 60)}...`
                );
                console.log(`  Category: ${json.data[0].category}`);
                console.log(`  SubCategory: ${json.data[0].subCategory}`);
              }
            }
            resolve(json);
          } catch (e) {
            console.log(`  ❌ Error parsing: ${e.message}`);
            resolve(null);
          }
        });
      })
      .on('error', (e) => {
        console.log(`  ❌ Request error: ${e.message}`);
        resolve(null);
      });
  });
}

async function main() {
  console.log('🧪 TESTING BACKEND API...\n');
  console.log('================================');

  await testAPI(
    'http://localhost:3002/api/funds?limit=5',
    '[1] All Funds (limit=5)'
  );
  await testAPI(
    'http://localhost:3002/api/funds?category=equity&limit=5',
    '[2] Equity Funds'
  );
  await testAPI(
    'http://localhost:3002/api/funds?category=debt&limit=5',
    '[3] Debt Funds'
  );
  await testAPI(
    'http://localhost:3002/api/funds?category=hybrid&limit=5',
    '[4] Hybrid Funds'
  );
  await testAPI(
    'http://localhost:3002/api/funds?category=commodity&limit=5',
    '[5] Commodity Funds'
  );
  await testAPI(
    'http://localhost:3002/api/funds?category=other&limit=5',
    '[6] Other Funds'
  );

  console.log('\n================================');
  console.log('✅ API Tests Complete\n');
}

main();
