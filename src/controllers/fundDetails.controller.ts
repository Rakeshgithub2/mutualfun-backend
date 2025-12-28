/**
 * FUND DETAILS CONTROLLER
 * Returns complete fund information including:
 * - Sector allocation
 * - Top 15 holdings
 * - Asset allocation
 * - NAV history
 * - Fund manager details
 * - Risk metrics
 */

import { Request, Response } from 'express';
const Fund = require('../models/Fund.model');

/**
 * GET /api/funds/:fundId/details
 * Returns complete fund details with sectors and holdings
 */
export const getFundDetails = async (req: Request, res: Response) => {
  try {
    const { fundId } = req.params;

    console.log(`📊 Fetching complete details for fund: ${fundId}`);

    // Fetch fund with all details
    const fund = await Fund.findOne({
      $or: [{ fundId }, { _id: fundId }],
    }).lean();

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    // Extract complete details
    const fundDetails = {
      // Basic Info
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      subCategory: fund.subCategory,
      fundHouse: fund.fundHouse,
      fundType: fund.fundType,

      // NAV & Returns
      currentNav: fund.currentNav,
      previousNav: fund.previousNav,
      navDate: fund.navDate,
      returns: fund.returns,

      // Holdings (Top 15)
      holdings:
        fund.holdings?.slice(0, 15).map((holding: any) => ({
          companyName: holding.companyName,
          sector: holding.sector,
          percentage: holding.percentage,
          value: holding.value,
          quantity: holding.quantity,
        })) || [],

      // Sector Allocation
      sectorAllocation:
        fund.sectorAllocation?.map((sector: any) => ({
          sector: sector.sector,
          percentage: sector.percentage,
          amount: sector.amount,
        })) || [],

      // Asset Allocation
      assetAllocation: fund.assetAllocation || {
        equity: 0,
        debt: 0,
        cash: 0,
        others: 0,
      },

      // Fund Manager
      fundManager: fund.fundManager || {
        name: 'Not Available',
        experience: 0,
        since: null,
      },

      // Risk Metrics
      riskMetrics: fund.riskMetrics || {},

      // Additional Details
      aum: fund.aum,
      expenseRatio: fund.expenseRatio?.value || fund.expenseRatio,
      exitLoad: fund.exitLoad?.value || fund.exitLoad,
      minInvestment: fund.minInvestment,
      inceptionDate: fund.inceptionDate,
      status: fund.status || 'Active',

      // Ratings
      ratings: fund.ratings || {},

      // Performance Metrics
      categoryRank: fund.categoryRank,
      totalFundsInCategory: fund.totalFundsInCategory,
    };

    console.log(
      `✅ Fund details fetched: ${fundDetails.holdings.length} holdings, ${fundDetails.sectorAllocation.length} sectors`
    );

    res.json({
      success: true,
      data: fundDetails,
    });
  } catch (error: any) {
    console.error('❌ Error fetching fund details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch fund details',
    });
  }
};

/**
 * GET /api/funds/:fundId/sectors
 * Returns only sector allocation for a fund
 */
export const getFundSectors = async (req: Request, res: Response) => {
  try {
    const { fundId } = req.params;

    const fund = await Fund.findOne(
      {
        $or: [{ fundId }, { _id: fundId }],
      },
      { sectorAllocation: 1, name: 1, category: 1 }
    ).lean();

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    res.json({
      success: true,
      data: {
        fundId,
        name: fund.name,
        category: fund.category,
        sectors: fund.sectorAllocation || [],
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching fund sectors:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch fund sectors',
    });
  }
};

/**
 * GET /api/funds/:fundId/holdings
 * Returns only top holdings for a fund
 */
export const getFundHoldings = async (req: Request, res: Response) => {
  try {
    const { fundId } = req.params;
    const limit = parseInt(req.query.limit as string) || 15;

    const fund = await Fund.findOne(
      {
        $or: [{ fundId }, { _id: fundId }],
      },
      { holdings: 1, name: 1, category: 1 }
    ).lean();

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    const holdings = fund.holdings?.slice(0, limit) || [];

    res.json({
      success: true,
      data: {
        fundId,
        name: fund.name,
        category: fund.category,
        holdings,
        totalHoldings: fund.holdings?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching fund holdings:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch fund holdings',
    });
  }
};
