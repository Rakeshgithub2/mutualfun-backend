/**
 * Test Redis Connection
 */

const Redis = require('ioredis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testRedisConnection() {
  console.log('🔍 Testing Redis connection...\n');
  console.log(
    'Redis URL:',
    process.env.REDIS_URL?.replace(/:[^:@]+@/, ':****@')
  ); // Hide password

  const redis = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => {
      if (times > 3) {
        console.log('❌ Max retries reached');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 50, 2000);
      console.log(`⏳ Retry attempt ${times}, waiting ${delay}ms...`);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully!');
  });

  redis.on('ready', async () => {
    console.log('✅ Redis is ready to accept commands\n');

    try {
      // Test SET command
      console.log('📝 Testing SET command...');
      await redis.set('test:connection', 'Hello from Node.js!');
      console.log('✅ SET successful');

      // Test GET command
      console.log('📖 Testing GET command...');
      const value = await redis.get('test:connection');
      console.log('✅ GET successful:', value);

      // Test PING command
      console.log('🏓 Testing PING command...');
      const pong = await redis.ping();
      console.log('✅ PING successful:', pong);

      // Get Redis info
      console.log('\n📊 Redis Info:');
      const info = await redis.info('server');
      const version = info.match(/redis_version:([^\r\n]+)/)?.[1];
      console.log('  Version:', version);

      console.log('\n🎉 All tests passed! Redis is working perfectly!\n');

      await redis.quit();
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      await redis.quit();
      process.exit(1);
    }
  });

  redis.on('error', (error) => {
    console.error('❌ Redis connection error:', error.message);
  });

  // Timeout after 10 seconds
  setTimeout(() => {
    console.error('❌ Connection timeout after 10 seconds');
    redis.quit();
    process.exit(1);
  }, 10000);
}

testRedisConnection();
