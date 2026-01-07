const Redis = require('ioredis');
require('dotenv').config();

async function clearCache() {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

  try {
    console.log('✅ Connected to Redis');

    await client.flushdb();
    console.log('✅ Redis cache cleared');

    await client.quit();
    console.log('✅ Disconnected from Redis');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

clearCache();
