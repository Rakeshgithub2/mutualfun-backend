/**
 * ═══════════════════════════════════════════════════════════════════════
 * NEWS API ROUTES
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const MarketNews = require('../models/MarketNews.model');

/**
 * GET /api/news
 * Get latest news articles
 *
 * Query params:
 * - category: stock|mutualfund|gold|finance
 * - limit: number of articles (default: 20)
 */
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;

    const query = {};
    if (category) {
      query.category = category;
    }

    const news = await MarketNews.find(query)
      .sort({ published_at: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message,
    });
  }
});

/**
 * GET /api/news/:id
 * Get single news article
 */
router.get('/:id', async (req, res) => {
  try {
    const news = await MarketNews.findById(req.params.id).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message,
    });
  }
});

module.exports = router;
