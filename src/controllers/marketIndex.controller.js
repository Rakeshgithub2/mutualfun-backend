/**
 * Market Index Controller
 * Handles market indices data
 */

const MarketIndex = require('../models/MarketIndex.model');
const cacheClient = require('../cache/redis.client');
const MarketHoursUtil = require('../utils/marketHours.util');

class MarketIndexController {
  /**
   * Get all market indices
   * GET /api/market/indices
   */
  static async getAllIndices(req, res) {
    try {
      // Check cache
      const cached = await cacheClient.getAllIndices();
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
          marketStatus: MarketHoursUtil.getMarketStatus(),
        });
      }

      // Query database
      const indices = await MarketIndex.getActiveIndices();

      // Cache result
      await cacheClient.cacheAllIndices(indices);

      res.json({
        success: true,
        source: 'database',
        data: indices,
        marketStatus: MarketHoursUtil.getMarketStatus(),
      });
    } catch (error) {
      console.error('Error fetching indices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market indices',
        message: error.message,
      });
    }
  }

  /**
   * Get specific market index
   * GET /api/market/indices/:symbol
   */
  static async getIndexBySymbol(req, res) {
    try {
      const { symbol } = req.params;

      // Check cache
      const cached = await cacheClient.getMarketIndex(symbol.toUpperCase());
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Query database
      const index = await MarketIndex.getIndexBySymbol(symbol);

      if (!index) {
        return res.status(404).json({
          success: false,
          error: 'Index not found',
          message: `No index found with symbol: ${symbol}`,
        });
      }

      // Cache result
      await cacheClient.cacheMarketIndex(symbol.toUpperCase(), index);

      res.json({
        success: true,
        source: 'database',
        data: index,
      });
    } catch (error) {
      console.error('Error fetching index:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch index',
        message: error.message,
      });
    }
  }

  /**
   * Get broad market indices
   * GET /api/market/indices/broad
   */
  static async getBroadMarketIndices(req, res) {
    try {
      // Check cache
      const cacheKey = 'market:indices:broad';
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Query database
      const indices = await MarketIndex.getBroadMarketIndices();

      // Cache result
      await cacheClient.set(cacheKey, indices, 7200); // 2h

      res.json({
        success: true,
        source: 'database',
        data: indices,
      });
    } catch (error) {
      console.error('Error fetching broad market indices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch broad market indices',
        message: error.message,
      });
    }
  }

  /**
   * Get sectoral indices
   * GET /api/market/indices/sectoral
   */
  static async getSectoralIndices(req, res) {
    try {
      // Check cache
      const cacheKey = 'market:indices:sectoral';
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Query database
      const indices = await MarketIndex.getSectoralIndices();

      // Cache result
      await cacheClient.set(cacheKey, indices, 7200); // 2h

      res.json({
        success: true,
        source: 'database',
        data: indices,
      });
    } catch (error) {
      console.error('Error fetching sectoral indices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch sectoral indices',
        message: error.message,
      });
    }
  }

  /**
   * Get market status
   * GET /api/market/status
   */
  static async getMarketStatus(req, res) {
    try {
      const sessionInfo = MarketHoursUtil.getMarketSessionInfo();

      res.json({
        success: true,
        data: sessionInfo,
      });
    } catch (error) {
      console.error('Error fetching market status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market status',
        message: error.message,
      });
    }
  }

  /**
   * Get market summary
   * GET /api/market/summary
   */
  static async getMarketSummary(req, res) {
    try {
      // Check cache
      const cacheKey = 'market:summary';
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          ...cached,
        });
      }

      // Get key indices
      const [nifty, sensex, bankNifty] = await Promise.all([
        MarketIndex.getIndexBySymbol('NIFTY50'),
        MarketIndex.getIndexBySymbol('SENSEX'),
        MarketIndex.getIndexBySymbol('BANKNIFTY'),
      ]);

      const summary = {
        majorIndices: [nifty, sensex, bankNifty].filter(Boolean),
        marketStatus: MarketHoursUtil.getMarketStatus(),
        lastUpdated: new Date(),
      };

      // Cache result
      await cacheClient.set(cacheKey, summary, 600); // 10min

      res.json({
        success: true,
        source: 'database',
        data: summary,
      });
    } catch (error) {
      console.error('Error fetching market summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market summary',
        message: error.message,
      });
    }
  }
}

module.exports = MarketIndexController;
