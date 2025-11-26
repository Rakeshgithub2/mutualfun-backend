import { Request, Response } from 'express';
import { z } from 'zod';
import { mongodb } from '../db/mongodb';
import { FundModel } from '../models/Fund.model';
import { FundManagerModel } from '../models/FundManager.model';
import {
  formatResponse,
  formatPaginatedResponse,
  pagination,
  buildSortOrder,
} from '../utils/response';

const getFundsSchema = z.object({
  query: z.string().optional(), // Changed from 'q' to 'query'
  type: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(), // Add subCategory support
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.string().optional(),
});

const getFundNavsSchema = z.object({
  period: z.enum(['1M', '3M', '1Y', '5Y', 'ALL']).optional().default('1Y'),
  from: z.string().optional(),
  to: z.string().optional(),
});

/**
 * GET /funds
 * Search, filter, paginate funds
 * Query params: query, type, category, limit, page
 * Replaces all mock fund lists
 */
export const getFunds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log('📥 GET /funds request received');
    const { query, type, category, subCategory, page, limit, sort } =
      getFundsSchema.parse(req.query);
    console.log('✅ Request params validated:', {
      query,
      type,
      category,
      subCategory,
      page,
      limit,
      sort,
    });

    const { skip, take } = pagination(page, limit);

    // Build MongoDB query using Fund Model
    const fundModel = FundModel.getInstance();

    let fundsRaw: any[];
    let total: number;

    // Build filter with proper subcategory filtering for equity
    const searchOptions: any = {
      limit: take,
      skip,
    };

    // If query parameter is provided, use search method
    if (query) {
      fundsRaw = await fundModel.search(query, {
        category: category as any,
        fundType: type as any,
        limit: take,
        skip,
      });
      total = fundsRaw.length; // Approximate - should be improved with count query
    } else {
      // Use findByCategory for category filtering or findAll
      if (category || subCategory) {
        // If subCategory is provided, filter by that specific subcategory
        if (subCategory) {
          fundsRaw = await fundModel.findBySubCategory(subCategory, {
            limit: take,
            skip,
          });
        } else if (category === 'equity') {
          // For equity, filter by matching subcategories
          const equitySubcategories = [
            'Large Cap',
            'Mid Cap',
            'Small Cap',
            'Multi Cap',
            'Flexi Cap',
            'ELSS',
            'Sectoral',
            'Thematic',
            'Value Fund',
            'Contra Fund',
            'Dividend Yield',
            'Focused Fund',
            'Large & Mid Cap',
          ];
          // Search by subCategory, not category
          const collection = mongodb.getCollection('funds');
          fundsRaw = await collection
            .find({
              subCategory: { $in: equitySubcategories },
              isActive: true,
            })
            .limit(take)
            .skip(skip)
            .sort({ popularity: -1, _id: -1 })
            .toArray();
        } else if (category === 'commodity') {
          // For commodity, filter by COMMODITY category
          fundsRaw = await fundModel.findByCategory('COMMODITY', {
            limit: take,
            skip,
          });
        } else {
          fundsRaw = await fundModel.findByCategory(category as string, {
            limit: take,
            skip,
          });
        }
      } else {
        fundsRaw = await fundModel.findAll({
          limit: take,
          skip,
        });
      }
      total = fundsRaw.length; // Approximate - should be improved with count query
    }

    // Map _id to id for frontend compatibility
    const funds = fundsRaw.map((fund) => ({
      id: fund._id || fund.fundId,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      subCategory: fund.subCategory,
      fundType: fund.fundType,
      fundHouse: fund.fundHouse,
      currentNav: fund.currentNav,
      previousNav: fund.previousNav,
      navDate: fund.navDate,
      returns: fund.returns,
      riskMetrics: {
        sharpeRatio: fund.riskMetrics?.sharpeRatio,
        standardDeviation: fund.riskMetrics?.standardDeviation,
      },
      aum: fund.aum,
      expenseRatio: fund.expenseRatio,
      ratings: fund.ratings,
      popularity: fund.popularity,
    }));

    console.log('✅ Funds retrieved:', funds.length);

    const response = formatPaginatedResponse(
      funds,
      total,
      page,
      limit,
      'Funds retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get funds error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

/**
 * GET /funds/:id
 * Return complete fund details
 * Returns: Basic info, Manager info, NAV, Top holdings, Sectors, AUM
 * Replaces static detail pages
 */
export const getFundById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log('📥 GET /funds/:id request received for id:', id);

    const fundModel = FundModel.getInstance();
    const fund = await fundModel.findById(id);

    if (!fund) {
      console.log('❌ Fund not found:', id);
      return res.status(404).json({ error: 'Fund not found' });
    }

    // Get manager details if fundManagerId exists
    let managerInfo = null;
    if (fund.fundManagerId) {
      const managerModel = FundManagerModel.getInstance();
      const manager = await managerModel.findById(fund.fundManagerId);

      if (manager) {
        managerInfo = {
          id: manager._id,
          name: manager.name,
          experience: manager.experience,
          designation: manager.designation,
          fundsManaged: manager.fundsManaged?.length || 0,
          totalAum: manager.totalAumManaged || 0,
          avgReturn: manager.averageReturns?.threeYear || 0,
          bio: manager.bio,
        };
      }
    }

    // Build complete fund details
    const fundDetails = {
      // Basic Info
      id: fund._id || fund.fundId,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      subCategory: fund.subCategory,
      fundType: fund.fundType,
      fundHouse: fund.fundHouse,
      launchDate: fund.launchDate,

      // Current NAV
      currentNav: fund.currentNav,
      previousNav: fund.previousNav,
      navDate: fund.navDate,
      navChange: fund.currentNav - fund.previousNav,
      navChangePercent:
        ((fund.currentNav - fund.previousNav) / fund.previousNav) * 100,

      // Financial Metrics
      aum: fund.aum,
      expenseRatio: fund.expenseRatio,
      exitLoad: fund.exitLoad,
      minInvestment: fund.minInvestment,
      sipMinAmount: fund.sipMinAmount,

      // Performance Returns
      returns: fund.returns,

      // Risk Metrics
      riskMetrics: fund.riskMetrics,

      // Top Holdings (top 15 real companies)
      topHoldings: (fund.holdings || []).slice(0, 15).map((h) => ({
        name: h.name,
        ticker: h.ticker,
        percentage: h.percentage,
        sector: h.sector,
        value: h.value,
      })),

      // Sector Allocation
      sectorAllocation: fund.sectorAllocation,

      // Manager Info
      fundManager: fund.fundManager,
      managerDetails: managerInfo,

      // Ratings
      ratings: fund.ratings,

      // Additional Info
      // benchmark: fund.benchmark, // Not in schema
      // portfolioTurnover: fund.portfolioTurnover, // Not in schema

      // Metadata
      popularity: fund.popularity,
      tags: fund.tags,
      lastUpdated: fund.lastUpdated,
    };

    console.log('✅ Fund details retrieved:', fund.name);

    const response = formatResponse(
      fundDetails,
      'Fund details retrieved successfully'
    );
    return res.json(response);
  } catch (error) {
    console.error('❌ Get fund by ID error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

/**
 * GET /funds/:id/price-history
 * Return chart data for different periods
 * Supports: 1M, 3M, 1Y, 5Y, ALL
 */
export const getFundNavs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { period, from, to } = getFundNavsSchema.parse(req.query);
    console.log('📥 GET /funds/:id/price-history request received for id:', id);

    // Calculate date range based on period
    let startDate: Date;
    const endDate = new Date();

    if (from && to) {
      // Custom date range
      startDate = new Date(from);
    } else {
      // Period-based date range
      switch (period) {
        case '1M':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3M':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '1Y':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case '5Y':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 5);
          break;
        case 'ALL':
        default:
          startDate = new Date('2000-01-01'); // Get all available data
          break;
      }
    }

    // Get price history from MongoDB
    const pricesCollection = mongodb.getCollection('fundPrices');

    const priceHistory = await pricesCollection
      .find({
        fundId: id,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .toArray();

    // Format for chart data
    const chartData = priceHistory.map((p: any) => ({
      date: p.date,
      nav: p.close || p.nav,
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
      volume: p.volume,
    }));

    console.log('✅ Price history retrieved:', chartData.length, 'data points');

    const response = formatResponse(
      {
        fundId: id,
        period,
        startDate,
        endDate,
        dataPoints: chartData.length,
        data: chartData,
      },
      'Price history retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get fund price history error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

/**
 * GET /suggest?q=sb
 * Fuzzy search for autocomplete
 * Used in: Fund Compare, Fund Overlap, Search bar
 * Supports 1-2 word queries
 */
export const getSuggestions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({
        error:
          'Query parameter "q" is required and must be at least 2 characters',
      });
    }

    const query = q.trim();
    console.log('📥 GET /suggest request received for query:', query);

    const fundModel = FundModel.getInstance();

    // Use the search method with a limit of 10 for suggestions
    const searchResults = await fundModel.search(query, {
      limit: 10,
      skip: 0,
    });

    // Format suggestions for autocomplete
    const suggestions = searchResults.map((fund: any) => ({
      id: fund._id || fund.fundId,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      fundType: fund.fundType,
      fundHouse: fund.fundHouse,
      currentNav: fund.currentNav,
      returns: {
        oneYear: fund.returns?.oneYear,
        threeYear: fund.returns?.threeYear,
      },
    }));

    console.log('✅ Suggestions retrieved:', suggestions.length);

    const response = formatResponse(
      {
        query,
        count: suggestions.length,
        suggestions,
      },
      'Suggestions retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    console.error('❌ Get suggestions error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};
