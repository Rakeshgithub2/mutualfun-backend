/**
 * Redis Configuration
 * High-performance caching layer for fund and market data
 */

const Redis = require('ioredis');

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  lazyConnect: false,
  keepAlive: 30000,
};

class RedisConfig {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Connect to Redis
   */
  async connect() {
    if (this.isConnected && this.client) {
      console.log('🔥 Redis: Already connected');
      return this.client;
    }

    try {
      this.client = new Redis(REDIS_CONFIG);

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis error:', error.message);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.warn('⚠️ Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      // Wait for connection
      await this.client.ping();

      return this.client;
    } catch (error) {
      console.error('❌ Redis connection failed:', error.message);
      console.warn('⚠️ Running without Redis cache');
      this.client = null;
      this.isConnected = false;
      return null;
    }
  }

  /**
   * Get Redis client
   */
  getClient() {
    return this.client;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (!this.client) return;

    try {
      await this.client.quit();
      this.isConnected = false;
      console.log('🔌 Redis connection closed');
    } catch (error) {
      console.error('❌ Error closing Redis connection:', error.message);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      status: this.client ? this.client.status : 'disconnected',
    };
  }

  /**
   * Cache key patterns for different data types
   */
  static KEYS = {
    // Fund data keys
    FUND_BY_ID: (fundId) => `fund:${fundId}`,
    FUND_BY_CATEGORY: (category) => `funds:category:${category}`,
    FUND_BY_SUBCATEGORY: (subcategory) => `funds:subcategory:${subcategory}`,
    FUND_NAV: (fundId) => `fund:nav:${fundId}`,
    FUND_HOLDINGS: (fundId) => `fund:holdings:${fundId}`,
    FUND_LIST: (page, limit) => `funds:list:${page}:${limit}`,
    FUND_SEARCH: (query) => `funds:search:${query}`,

    // Market indices keys
    MARKET_INDEX: (symbol) => `market:index:${symbol}`,
    MARKET_ALL_INDICES: () => 'market:indices:all',

    // User data keys
    USER_WATCHLIST: (userId) => `user:${userId}:watchlist`,
    USER_GOALS: (userId) => `user:${userId}:goals`,
    USER_PORTFOLIO: (userId) => `user:${userId}:portfolio`,

    // Analytics keys
    FUND_RANK: (category) => `rank:${category}`,
    TRENDING_FUNDS: () => 'trending:funds',
  };

  /**
   * Default TTL values (in seconds)
   */
  static TTL = {
    FUND_DATA: 24 * 60 * 60, // 24 hours
    FUND_NAV: 12 * 60 * 60, // 12 hours (updated twice daily)
    FUND_HOLDINGS: 90 * 24 * 60 * 60, // 90 days
    MARKET_INDEX: 2 * 60 * 60, // 2 hours
    USER_DATA: 1 * 60 * 60, // 1 hour
    SEARCH_RESULTS: 6 * 60 * 60, // 6 hours
    TRENDING: 30 * 60, // 30 minutes
  };

  /**
   * Clear all cache
   */
  async clearAll() {
    if (!this.client || !this.isConnected) {
      console.warn('⚠️ Redis not connected, cannot clear cache');
      return false;
    }

    try {
      await this.client.flushdb();
      console.log('🗑️ Redis cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing cache:', error.message);
      return false;
    }
  }

  /**
   * Clear cache by pattern
   */
  async clearByPattern(pattern) {
    if (!this.client || !this.isConnected) return false;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
        console.log(`🗑️ Cleared ${keys.length} keys matching: ${pattern}`);
      }
      return true;
    } catch (error) {
      console.error('❌ Error clearing cache by pattern:', error.message);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    if (!this.client || !this.isConnected) {
      return { connected: false };
    }

    try {
      const info = await this.client.info('stats');
      const dbSize = await this.client.dbsize();

      return {
        connected: true,
        totalKeys: dbSize,
        info: info,
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error.message);
      return { connected: false, error: error.message };
    }
  }
}

// Singleton instance
const redisConfig = new RedisConfig();

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisConfig.disconnect();
});

module.exports = redisConfig;
