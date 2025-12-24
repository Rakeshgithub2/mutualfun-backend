import { Request, Response } from 'express';
import { marketIndicesService } from '../services/marketIndices.service';

/**
 * Market Indices Controller
 *
 * Endpoints:
 * - GET /api/market-indices - Get all major indices
 * - GET /api/market-indices/:indexId - Get specific index
 * - POST /api/market-indices/refresh - Refresh all indices (admin)
 */

/**
 * Get all major Indian and global market indices
 * @route GET /api/market-indices
 */
export const getMarketIndices = async (req: Request, res: Response) => {
  try {
    const indices = await marketIndicesService.getAllIndices();

    // Filter out stale or failed indices
    const validIndices = indices.filter(
      (idx) =>
        idx.sanityCheckPassed &&
        idx.staleness < 30 && // Less than 30 minutes old
        idx.currentValue > 0
    );

    if (validIndices.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Market indices temporarily unavailable',
        data: { indian: [], global: [] },
      });
    }

    // Organize indices by region with metadata
    const indianIndices = validIndices
      .filter((idx) =>
        [
          'NIFTY_50',
          'SENSEX',
          'BANK_NIFTY',
          'NIFTY_NEXT_50',
          'NIFTY_MIDCAP_100',
          'NIFTY_SMALLCAP_100',
        ].includes(idx.indexId)
      )
      .map((idx) => ({
        ...idx,
        country: 'India',
        exchange: idx.indexId.startsWith('NIFTY') ? 'NSE' : 'BSE',
      }));

    const globalIndices = validIndices
      .filter((idx) =>
        [
          'SPX',
          'DJI',
          'IXIC',
          'N225',
          'SSE',
          'HSI',
          'FTSE',
          'GDAXI',
          'FCHI',
        ].includes(idx.indexId)
      )
      .map((idx) => {
        const countryMap: Record<
          string,
          { country: string; exchange: string }
        > = {
          SPX: { country: 'USA', exchange: 'NYSE' },
          DJI: { country: 'USA', exchange: 'NYSE' },
          IXIC: { country: 'USA', exchange: 'NASDAQ' },
          N225: { country: 'Japan', exchange: 'TSE' },
          SSE: { country: 'China', exchange: 'SSE' },
          HSI: { country: 'Hong Kong', exchange: 'HKEX' },
          FTSE: { country: 'United Kingdom', exchange: 'LSE' },
          GDAXI: { country: 'Germany', exchange: 'XETRA' },
          FCHI: { country: 'France', exchange: 'Euronext' },
        };
        const info = countryMap[idx.indexId] || {
          country: 'Unknown',
          exchange: 'Unknown',
        };
        return {
          ...idx,
          country: info.country,
          exchange: info.exchange,
        };
      });

    return res.json({
      success: true,
      message: 'Market indices retrieved successfully',
      data: {
        indian: indianIndices,
        global: globalIndices,
      },
      metadata: {
        total: validIndices.length,
        indian: indianIndices.length,
        global: globalIndices.length,
        lastUpdated: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching market indices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch market indices',
      error: error.message,
    });
  }
};

/**
 * Get specific index by ID
 * @route GET /api/market-indices/:indexId
 */
export const getSpecificIndex = async (req: Request, res: Response) => {
  try {
    const { indexId } = req.params;

    const index = await marketIndicesService.getIndex(indexId);

    if (!index) {
      return res.status(404).json({
        success: false,
        message: `Index ${indexId} not found`,
      });
    }

    // Check data quality
    if (!index.sanityCheckPassed || index.staleness > 30) {
      return res.status(503).json({
        success: false,
        message: 'Index data temporarily unavailable or stale',
        data: index,
      });
    }

    return res.json({
      success: true,
      message: 'Index data retrieved successfully',
      data: index,
    });
  } catch (error: any) {
    console.error(`Error fetching index ${req.params.indexId}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch index data',
      error: error.message,
    });
  }
};

/**
 * Refresh all indices (admin endpoint)
 * @route POST /api/market-indices/refresh
 */
export const refreshIndices = async (req: Request, res: Response) => {
  try {
    await marketIndicesService.refreshAllIndices();

    return res.json({
      success: true,
      message: 'Market indices refreshed successfully',
    });
  } catch (error: any) {
    console.error('Error refreshing indices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to refresh indices',
      error: error.message,
    });
  }
};
