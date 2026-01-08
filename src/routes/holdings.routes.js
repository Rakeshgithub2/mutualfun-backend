/**
 * Holdings Routes
 * API endpoints for fund portfolio holdings
 */

const express = require('express');
const router = express.Router();
const HoldingsController = require('../controllers/holdings.controller');
const rateLimiter = require('../middleware/rateLimiter.middleware');

// Public routes with lenient rate limiting (read-only operations)
router.get(
  '/stats',
  rateLimiter.fundQueryLimiter,
  HoldingsController.getHoldingsStats
);

router.get(
  '/:schemeCode',
  rateLimiter.fundQueryLimiter,
  HoldingsController.getHoldingsBySchemeCode
);

router.get(
  '/:schemeCode/top',
  rateLimiter.fundQueryLimiter,
  HoldingsController.getTopHoldings
);

router.get(
  '/:schemeCode/sectors',
  rateLimiter.fundQueryLimiter,
  HoldingsController.getSectorAllocation
);

// Comparison endpoint
router.post(
  '/compare',
  rateLimiter.apiLimiter,
  HoldingsController.compareHoldings
);

module.exports = router;
