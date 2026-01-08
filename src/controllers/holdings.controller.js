/**
 * Holdings Controller
 * Manage fund portfolio holdings data
 */

const FundHoldings = require('../models/FundHoldings.model');
const Fund = require('../models/Fund.model');
const cacheClient = require('../config/redis.config');

class HoldingsController {
  /**
   * Get latest holdings for a fund
   * GET /api/holdings/:schemeCode
   */
  static async getHoldingsBySchemeCode(req, res) {
    try {
      const { schemeCode } = req.params;
      const { limit = 50 } = req.query;

      // Check cache (optional - skip if Redis unavailable)
      const cacheKey = `holdings:${schemeCode}:${limit}`;
      try {
        if (cacheClient && typeof cacheClient.get === 'function') {
          const cached = await cacheClient.get(cacheKey);
          if (cached) {
            return res.json({
              success: true,
              source: 'cache',
              ...cached,
            });
          }
        }
      } catch (cacheError) {
        console.log('Cache unavailable, fetching from DB');
      }

      // Get latest holdings
      const holdings = await FundHoldings.getLatestHoldings(schemeCode);

      if (!holdings || holdings.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Holdings not found',
          message: `No holdings data available for scheme ${schemeCode}`,
        });
      }

      // Apply limit
      const limitedHoldings = holdings.slice(0, parseInt(limit));

      // Get report date
      const reportDate = holdings[0]?.reportDate;

      // Calculate total weight
      const totalWeight = limitedHoldings.reduce(
        (sum, h) => sum + (h.weight || 0),
        0
      );

      const response = {
        schemeCode,
        fundName: holdings[0]?.fundName,
        reportDate,
        totalHoldings: holdings.length,
        displayedHoldings: limitedHoldings.length,
        totalWeight: parseFloat(totalWeight.toFixed(2)),
        holdings: limitedHoldings.map((h) => ({
          security: h.security,
          weight: h.weight,
          marketValue: h.marketValue,
          sector: h.sector,
          securityType: h.securityType,
        })),
      };

      // Cache for 24 hours (holdings don't change frequently)
      try {
        if (cacheClient && typeof cacheClient.set === 'function') {
          await cacheClient.set(cacheKey, response, 86400);
        }
      } catch (cacheError) {
        console.log('Cache set failed, continuing');
      }

      res.json({
        success: true,
        source: 'database',
        ...response,
      });
    } catch (error) {
      console.error('Error fetching holdings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch holdings',
        message: error.message,
      });
    }
  }

  /**
   * Get top holdings for a fund
   * GET /api/holdings/:schemeCode/top
   */
  static async getTopHoldings(req, res) {
    try {
      const { schemeCode } = req.params;
      const { limit = 10 } = req.query;

      const cacheKey = `holdings:top:${schemeCode}:${limit}`;
      try {
        if (cacheClient && typeof cacheClient.get === 'function') {
          const cached = await cacheClient.get(cacheKey);
          if (cached) {
            return res.json({ success: true, source: 'cache', ...cached });
          }
        }
      } catch (cacheError) {
        console.log('Cache unavailable, fetching from DB');
      }

      const holdings = await FundHoldings.getTopHoldings(
        schemeCode,
        parseInt(limit)
      );

      if (!holdings || holdings.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No holdings found',
        });
      }

      const response = {
        schemeCode,
        fundName: holdings[0]?.fundName,
        reportDate: holdings[0]?.reportDate,
        topHoldings: holdings.map((h) => ({
          security: h.security,
          weight: h.weight,
          marketValue: h.marketValue,
        })),
      };

      try {
        if (cacheClient && typeof cacheClient.set === 'function') {
          await cacheClient.set(cacheKey, response, 86400);
        }
      } catch (cacheError) {
        console.log('Cache set failed, continuing');
      }

      res.json({ success: true, source: 'database', ...response });
    } catch (error) {
      console.error('Error fetching top holdings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top holdings',
        message: error.message,
      });
    }
  }

  /**
   * Get sector allocation for a fund
   * GET /api/holdings/:schemeCode/sectors
   */
  static async getSectorAllocation(req, res) {
    try {
      const { schemeCode } = req.params;

      const cacheKey = `holdings:sectors:${schemeCode}`;
      try {
        if (cacheClient && typeof cacheClient.get === 'function') {
          const cached = await cacheClient.get(cacheKey);
          if (cached) {
            return res.json({ success: true, source: 'cache', ...cached });
          }
        }
      } catch (cacheError) {
        console.log('Cache unavailable, fetching from DB');
      }

      const sectors = await FundHoldings.getSectorAllocation(schemeCode);

      if (!sectors || sectors.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No sector data found',
        });
      }

      const response = {
        schemeCode,
        sectors: sectors.map((s) => ({
          sector: s._id,
          weight: parseFloat(s.totalWeight.toFixed(2)),
        })),
      };

      try {
        if (cacheClient && typeof cacheClient.set === 'function') {
          await cacheClient.set(cacheKey, response, 86400);
        }
      } catch (cacheError) {
        console.log('Cache set failed, continuing');
      }

      res.json({ success: true, source: 'database', ...response });
    } catch (error) {
      console.error('Error fetching sector allocation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch sector allocation',
        message: error.message,
      });
    }
  }

  /**
   * Get holdings statistics
   * GET /api/holdings/stats
   */
  static async getHoldingsStats(req, res) {
    try {
      const stats = await FundHoldings.aggregate([
        {
          $group: {
            _id: null,
            totalFunds: { $addToSet: '$schemeCode' },
            totalHoldings: { $sum: 1 },
            latestDate: { $max: '$reportDate' },
          },
        },
      ]);

      const result = stats[0] || {};

      res.json({
        success: true,
        stats: {
          totalFundsWithHoldings: result.totalFunds?.length || 0,
          totalHoldingsRecords: result.totalHoldings || 0,
          latestReportDate: result.latestDate,
        },
      });
    } catch (error) {
      console.error('Error fetching holdings stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message,
      });
    }
  }

  /**
   * Compare holdings between funds
   * POST /api/holdings/compare
   */
  static async compareHoldings(req, res) {
    try {
      const { schemeCodes } = req.body;

      if (!Array.isArray(schemeCodes) || schemeCodes.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Please provide at least 2 scheme codes',
        });
      }

      const holdingsData = await Promise.all(
        schemeCodes.map(async (code) => {
          const holdings = await FundHoldings.getLatestHoldings(code);
          return {
            schemeCode: code,
            holdings: holdings.slice(0, 20), // Top 20
          };
        })
      );

      // Find common holdings
      const allSecurities = new Map();
      holdingsData.forEach((fund) => {
        fund.holdings.forEach((h) => {
          if (!allSecurities.has(h.security)) {
            allSecurities.set(h.security, []);
          }
          allSecurities.get(h.security).push({
            schemeCode: fund.schemeCode,
            weight: h.weight,
          });
        });
      });

      const commonHoldings = Array.from(allSecurities.entries())
        .filter(([_, funds]) => funds.length >= 2)
        .map(([security, funds]) => ({ security, funds }));

      res.json({
        success: true,
        comparison: {
          funds: holdingsData.map((f) => ({
            schemeCode: f.schemeCode,
            topHoldings: f.holdings.slice(0, 10),
          })),
          commonHoldings: commonHoldings.slice(0, 20),
        },
      });
    } catch (error) {
      console.error('Error comparing holdings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to compare holdings',
        message: error.message,
      });
    }
  }
}

module.exports = HoldingsController;
