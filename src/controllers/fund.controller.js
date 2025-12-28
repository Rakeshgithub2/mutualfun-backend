/**
 * Fund Controller
 * Handles all fund-related operations with caching
 */

const Fund = require('../models/Fund.model');
const FundNav = require('../models/FundNav.model');
const FundHolding = require('../models/FundHolding.model');
const cacheClient = require('../cache/redis.client');
const PaginationUtil = require('../utils/pagination.util');
const DateUtil = require('../utils/date.util');

class FundController {
  /**
   * Get all funds (paginated)
   * GET /api/funds?page=1&limit=20&category=Equity&subCategory=Large Cap
   */
  static async getAllFunds(req, res) {
    try {
      const { page, limit, skip } = PaginationUtil.parsePaginationParams(req);
      const { category, subCategory, amc, status = 'Active' } = req.query;

      // Build cache key
      const cacheKey = `funds:list:${page}:${limit}:${category || 'all'}:${subCategory || 'all'}:${amc || 'all'}`;

      // Check cache
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          ...cached,
        });
      }

      // Build query
      const query = { status };
      if (category) query.category = category;
      if (subCategory) query.subCategory = subCategory;
      if (amc) query['amc.name'] = new RegExp(amc, 'i');

      // Execute query with pagination
      const [funds, total] = await Promise.all([
        Fund.find(query)
          .select('-__v')
          .skip(skip)
          .limit(limit)
          .sort({ 'returns.1Y': -1 })
          .lean(),
        Fund.countDocuments(query),
      ]);

      const response = PaginationUtil.buildResponse(funds, page, limit, total);

      // Cache result
      await cacheClient.set(cacheKey, response, 86400); // 24h

      res.json({
        success: true,
        source: 'database',
        ...response,
      });
    } catch (error) {
      console.error('Error fetching funds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch funds',
        message: error.message,
      });
    }
  }

  /**
   * Get fund by scheme code
   * GET /api/funds/:schemeCode
   */
  static async getFundBySchemeCode(req, res) {
    try {
      const { schemeCode } = req.params;

      // Check cache
      const cached = await cacheClient.getFund(schemeCode);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Query database
      const fund = await Fund.findOne({ schemeCode, status: 'Active' })
        .select('-__v')
        .lean();

      if (!fund) {
        return res.status(404).json({
          success: false,
          error: 'Fund not found',
          message: `No fund found with scheme code: ${schemeCode}`,
        });
      }

      // Cache result
      await cacheClient.cacheFund(schemeCode, fund);

      res.json({
        success: true,
        source: 'database',
        data: fund,
      });
    } catch (error) {
      console.error('Error fetching fund:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch fund',
        message: error.message,
      });
    }
  }

  /**
   * Get funds by category
   * GET /api/funds/category/:category
   */
  static async getFundsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page, limit, skip } = PaginationUtil.parsePaginationParams(req);

      // Check cache
      const cacheKey = `funds:category:${category}:${page}:${limit}`;
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          ...cached,
        });
      }

      // Query database
      const [funds, total] = await Promise.all([
        Fund.find({ category, status: 'Active' })
          .select('-__v')
          .skip(skip)
          .limit(limit)
          .sort({ 'returns.1Y': -1 })
          .lean(),
        Fund.countDocuments({ category, status: 'Active' }),
      ]);

      const response = PaginationUtil.buildResponse(funds, page, limit, total);

      // Cache result
      await cacheClient.set(cacheKey, response, 86400); // 24h

      res.json({
        success: true,
        source: 'database',
        ...response,
      });
    } catch (error) {
      console.error('Error fetching funds by category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch funds',
        message: error.message,
      });
    }
  }

  /**
   * Get funds by subcategory
   * GET /api/funds/subcategory/:subcategory
   */
  static async getFundsBySubcategory(req, res) {
    try {
      const { subcategory } = req.params;
      const { page, limit, skip } = PaginationUtil.parsePaginationParams(req);

      // Check cache
      const cached = await cacheClient.getFundsBySubcategory(subcategory);
      if (cached && !req.query.page) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Query database
      const [funds, total] = await Promise.all([
        Fund.find({ subCategory: subcategory, status: 'Active' })
          .select('-__v')
          .skip(skip)
          .limit(limit)
          .sort({ 'returns.1Y': -1 })
          .lean(),
        Fund.countDocuments({ subCategory: subcategory, status: 'Active' }),
      ]);

      const response = PaginationUtil.buildResponse(funds, page, limit, total);

      // Cache result
      await cacheClient.cacheFundsBySubcategory(subcategory, response);

      res.json({
        success: true,
        source: 'database',
        ...response,
      });
    } catch (error) {
      console.error('Error fetching funds by subcategory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch funds',
        message: error.message,
      });
    }
  }

  /**
   * Search funds
   * GET /api/funds/search?q=hdfc
   */
  static async searchFunds(req, res) {
    try {
      const { q: searchQuery } = req.query;
      const { page, limit, skip } = PaginationUtil.parsePaginationParams(req);

      if (!searchQuery || searchQuery.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Invalid search query',
          message: 'Search query must be at least 2 characters',
        });
      }

      // Check cache
      const cacheKey = `funds:search:${searchQuery}:${page}:${limit}`;
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          ...cached,
        });
      }

      // Text search
      const [funds, total] = await Promise.all([
        Fund.find(
          {
            $text: { $search: searchQuery },
            status: 'Active',
          },
          { score: { $meta: 'textScore' } }
        )
          .select('-__v')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .lean(),
        Fund.countDocuments({
          $text: { $search: searchQuery },
          status: 'Active',
        }),
      ]);

      const response = PaginationUtil.buildResponse(funds, page, limit, total);

      // Cache result
      await cacheClient.set(cacheKey, response, 21600); // 6h

      res.json({
        success: true,
        source: 'database',
        query: searchQuery,
        ...response,
      });
    } catch (error) {
      console.error('Error searching funds:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error.message,
      });
    }
  }

  /**
   * Get fund NAV history
   * GET /api/funds/:schemeCode/nav?days=365
   */
  static async getFundNavHistory(req, res) {
    try {
      const { schemeCode } = req.params;
      const days = parseInt(req.query.days) || 365;

      // Check cache
      const cacheKey = `fund:nav:history:${schemeCode}:${days}`;
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Get NAV history
      const navHistory = await FundNav.getNavHistory(schemeCode, days);

      if (!navHistory || navHistory.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'NAV history not found',
          message: `No NAV history found for scheme code: ${schemeCode}`,
        });
      }

      // Cache result
      await cacheClient.set(cacheKey, navHistory, 43200); // 12h

      res.json({
        success: true,
        source: 'database',
        data: navHistory,
        meta: {
          schemeCode,
          days,
          count: navHistory.length,
        },
      });
    } catch (error) {
      console.error('Error fetching NAV history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch NAV history',
        message: error.message,
      });
    }
  }

  /**
   * Get fund holdings
   * GET /api/funds/:schemeCode/holdings
   */
  static async getFundHoldings(req, res) {
    try {
      const { schemeCode } = req.params;

      // Check cache
      const cached = await cacheClient.getFundHoldings(schemeCode);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Get latest holdings
      const holdings = await FundHolding.getLatestHoldings(schemeCode);

      if (!holdings) {
        return res.status(404).json({
          success: false,
          error: 'Holdings not found',
          message: `No holdings found for scheme code: ${schemeCode}`,
        });
      }

      // Cache result
      await cacheClient.cacheFundHoldings(schemeCode, holdings);

      res.json({
        success: true,
        source: 'database',
        data: holdings,
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
   * Get top performing funds
   * GET /api/funds/top-performers?period=1Y&category=Equity&limit=10
   */
  static async getTopPerformers(req, res) {
    try {
      const { period = '1Y', category, limit = 10 } = req.query;

      // Check cache
      const cacheKey = `funds:top:${period}:${category || 'all'}:${limit}`;
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Build query
      const query = {
        status: 'Active',
        [`returns.${period}`]: { $exists: true, $ne: null },
      };
      if (category) query.category = category;

      // Get top performers
      const funds = await Fund.find(query)
        .select('schemeCode schemeName amc category returns nav')
        .sort({ [`returns.${period}`]: -1 })
        .limit(parseInt(limit))
        .lean();

      // Cache result
      await cacheClient.set(cacheKey, funds, 86400); // 24h

      res.json({
        success: true,
        source: 'database',
        data: funds,
        meta: {
          period,
          category: category || 'all',
          count: funds.length,
        },
      });
    } catch (error) {
      console.error('Error fetching top performers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top performers',
        message: error.message,
      });
    }
  }

  /**
   * Get fund categories
   * GET /api/funds/categories
   */
  static async getCategories(req, res) {
    try {
      // Check cache
      const cacheKey = 'funds:categories';
      const cached = await cacheClient.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          source: 'cache',
          data: cached,
        });
      }

      // Get categories with counts
      const categories = await Fund.aggregate([
        { $match: { status: 'Active' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            subcategories: { $addToSet: '$subCategory' },
          },
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            subcategories: 1,
            _id: 0,
          },
        },
        { $sort: { category: 1 } },
      ]);

      // Cache result
      await cacheClient.set(cacheKey, categories, 86400); // 24h

      res.json({
        success: true,
        source: 'database',
        data: categories,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories',
        message: error.message,
      });
    }
  }

  /**
   * 🔥 SMART SEARCH - Search with fallback to external API
   * GET /api/funds/smart-search?q=hdfc&schemeCode=119551
   *
   * Flow:
   * 1. Search in local MongoDB database
   * 2. If not found, fetch from MFAPI.in in real-time
   * 3. Save fetched fund to MongoDB for future
   * 4. Return fund data with source indicator
   */
  static async smartSearch(req, res) {
    try {
      const { q: searchQuery, schemeCode } = req.query;

      // Validate input
      if (!searchQuery && !schemeCode) {
        return res.status(400).json({
          success: false,
          error: 'Missing search parameter',
          message: 'Provide either "q" (search query) or "schemeCode"',
        });
      }

      // Step 1: Search in local database
      console.log(
        `🔍 Smart search initiated: query="${searchQuery}", code="${schemeCode}"`
      );

      let fund = null;

      if (schemeCode) {
        // Direct scheme code search
        fund = await Fund.findOne({
          schemeCode: schemeCode.toString(),
          status: 'Active',
        }).lean();

        if (fund) {
          console.log(`✅ Found in database: ${fund.schemeName}`);
          return res.json({
            success: true,
            source: 'database',
            cached: true,
            data: fund,
          });
        }

        console.log(`❌ Scheme code ${schemeCode} not found in database`);

        // Step 2: Fetch from external API (MFAPI)
        const mfapiService = require('../services/mfapi.service');

        try {
          console.log(`🌐 Fetching from MFAPI: ${schemeCode}`);
          const apiFund = await mfapiService.fetchFundBySchemeCode(schemeCode);

          if (!apiFund) {
            return res.status(404).json({
              success: false,
              error: 'Fund not found',
              message: `No fund found with scheme code: ${schemeCode}`,
              searchedIn: ['database', 'mfapi'],
            });
          }

          // Step 3: Save to MongoDB
          console.log(`💾 Saving new fund to database: ${apiFund.schemeName}`);
          fund = await Fund.create(apiFund);

          // Invalidate relevant caches
          await cacheClient.del('funds:list:*');

          console.log(
            `✅ Fund saved and returned from API: ${fund.schemeName}`
          );

          return res.json({
            success: true,
            source: 'live-api',
            cached: false,
            provider: 'MFAPI',
            data: fund,
            message: 'Fund fetched from external API and saved to database',
          });
        } catch (apiError) {
          console.error('MFAPI fetch failed:', apiError.message);

          return res.status(503).json({
            success: false,
            error: 'External API unavailable',
            message: 'Could not fetch fund from external source',
            details: apiError.message,
          });
        }
      } else if (searchQuery) {
        // Text search in database
        const funds = await Fund.find(
          {
            $text: { $search: searchQuery },
            status: 'Active',
          },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(10)
          .lean();

        if (funds.length > 0) {
          console.log(
            `✅ Found ${funds.length} funds matching "${searchQuery}"`
          );
          return res.json({
            success: true,
            source: 'database',
            cached: true,
            query: searchQuery,
            data: funds,
            count: funds.length,
          });
        }

        // No results in database, suggest using scheme code
        return res.status(404).json({
          success: false,
          error: 'No funds found',
          message: `No funds found matching "${searchQuery}". Try searching with a scheme code.`,
          suggestion:
            'Use ?schemeCode=119551 to fetch specific fund from external API',
        });
      }
    } catch (error) {
      console.error('Smart search error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error.message,
      });
    }
  }

  /**
   * 🔄 BATCH IMPORT - Import multiple funds from external API
   * POST /api/funds/batch-import
   * Body: { schemeCodes: ["119551", "119552", "119553"] }
   */
  static async batchImport(req, res) {
    try {
      const { schemeCodes } = req.body;

      if (!Array.isArray(schemeCodes) || schemeCodes.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          message: 'Provide an array of scheme codes',
        });
      }

      if (schemeCodes.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Too many codes',
          message: 'Maximum 100 scheme codes per request',
        });
      }

      console.log(`📦 Batch import initiated for ${schemeCodes.length} funds`);

      const mfapiService = require('../services/mfapi.service');
      const results = {
        total: schemeCodes.length,
        successful: 0,
        failed: 0,
        skipped: 0,
        funds: [],
        errors: [],
      };

      for (const schemeCode of schemeCodes) {
        try {
          // Check if already exists
          const existing = await Fund.findOne({ schemeCode });
          if (existing) {
            console.log(`⏭️  Skipping existing fund: ${schemeCode}`);
            results.skipped++;
            continue;
          }

          // Fetch from API
          const apiFund = await mfapiService.fetchFundBySchemeCode(schemeCode);

          if (!apiFund) {
            results.failed++;
            results.errors.push({
              schemeCode,
              error: 'Not found in MFAPI',
            });
            continue;
          }

          // Save to database
          const savedFund = await Fund.create(apiFund);
          results.successful++;
          results.funds.push({
            schemeCode: savedFund.schemeCode,
            name: savedFund.schemeName,
          });

          console.log(`✅ Imported: ${savedFund.schemeName}`);
        } catch (error) {
          results.failed++;
          results.errors.push({
            schemeCode,
            error: error.message,
          });
          console.error(`❌ Failed to import ${schemeCode}:`, error.message);
        }
      }

      // Invalidate caches
      await cacheClient.del('funds:list:*');

      console.log(
        `📦 Batch import complete: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped`
      );

      res.json({
        success: true,
        message: 'Batch import completed',
        results,
      });
    } catch (error) {
      console.error('Batch import error:', error);
      res.status(500).json({
        success: false,
        error: 'Batch import failed',
        message: error.message,
      });
    }
  }
}

module.exports = FundController;
