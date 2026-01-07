// Search for funds with commodity keywords in their names
const http = require('http');

async function searchFunds(query, label) {
  return new Promise((resolve) => {
    const url = `http://localhost:3002/api/funds/search?q=${encodeURIComponent(query)}&limit=20`;
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(`\n${label}:`);
            console.log(`  Query: "${query}"`);
            if (json.success && json.data && Array.isArray(json.data)) {
              console.log(`  Found: ${json.data.length} funds`);
              json.data.slice(0, 5).forEach((f, i) => {
                console.log(`  ${i + 1}. ${f.schemeName?.substring(0, 70)}`);
                console.log(
                  `     Category: ${f.category} | Sub: ${f.subCategory}`
                );
              });
            } else {
              console.log(`  ❌ No results or error`);
            }
            resolve(json);
          } catch (e) {
            console.log(`  ❌ Parse error: ${e.message}`);
            resolve(null);
          }
        });
      })
      .on('error', (e) => {
        console.log(`  ❌ Error: ${e.message}`);
        resolve(null);
      });
  });
}

async function main() {
  console.log('\n🔍 SEARCHING FOR COMMODITY FUNDS...\n');
  console.log('================================');

  await searchFunds('gold', '[1] Search: "gold"');
  await searchFunds('silver', '[2] Search: "silver"');
  await searchFunds('commodity', '[3] Search: "commodity"');
  await searchFunds('metal', '[4] Search: "metal"');

  console.log('\n================================\n');
}

main();
