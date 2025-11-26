const http = require('http');

async function testAPI() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3002/api/funds?limit=5', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('\n✅ SUCCESS! API returned:');
          console.log(`   Total funds: ${json.pagination.total}`);
          console.log(`   Returned: ${json.data.length} funds`);
          console.log('\nSample funds:');
          json.data.forEach((f) => console.log(`   - ${f.name}`));
          resolve();
        } catch (e) {
          console.error('Parse error:', e.message);
          console.log('Raw response:', data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('\n❌ Request failed:', e.message);
      reject(e);
    });

    req.setTimeout(10000, () => {
      console.error('\n❌ Request timed out');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

console.log('\n🔍 Testing backend API...\n');
testAPI().catch(() => process.exit(1));
