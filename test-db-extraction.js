require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

console.log('🔍 DATABASE URL EXTRACTION TEST');
console.log('='.repeat(70));
console.log('\nDATABASE_URL:', DATABASE_URL);
console.log('\nExtraction logic test:');

// For Atlas URLs, extract the database name from the path
if (DATABASE_URL.includes('mongodb+srv://')) {
  // Pattern: mongodb+srv://user:pass@host/dbname?params
  const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
  console.log('Match result:', match);

  if (match && match[1]) {
    console.log('✅ Extracted DB name:', match[1]);
  } else {
    console.log('❌ No match found, using default: mutual_funds_db');
  }
}
