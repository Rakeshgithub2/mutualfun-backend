/**
 * Market Index Routes
 */

const express = require('express');
const router = express.Router();
const MarketIndexController = require('../controllers/marketIndex.controller');
const rateLimiter = require('../middleware/rateLimiter.middleware');

// Public routes (with rate limiting)
router.get(
  '/indices',
  rateLimiter.apiLimiter,
  MarketIndexController.getAllIndices
);

router.get(
  '/indices/broad',
  rateLimiter.apiLimiter,
  MarketIndexController.getBroadMarketIndices
);

router.get(
  '/indices/sectoral',
  rateLimiter.apiLimiter,
  MarketIndexController.getSectoralIndices
);

router.get(
  '/indices/:symbol',
  rateLimiter.apiLimiter,
  MarketIndexController.getIndexBySymbol
);

router.get(
  '/status',
  rateLimiter.apiLimiter,
  MarketIndexController.getMarketStatus
);

router.get(
  '/summary',
  rateLimiter.apiLimiter,
  MarketIndexController.getMarketSummary
);

module.exports = router;
