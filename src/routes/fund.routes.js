/**
 * Fund Routes
 */

const express = require('express');
const router = express.Router();
const FundController = require('../controllers/fund.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimiter.middleware');

// Public routes (with rate limiting)
router.get('/', rateLimiter.apiLimiter, FundController.getAllFunds);

router.get('/search', rateLimiter.searchLimiter, FundController.searchFunds);

router.get('/categories', rateLimiter.apiLimiter, FundController.getCategories);

router.get(
  '/top-performers',
  rateLimiter.apiLimiter,
  FundController.getTopPerformers
);

router.get(
  '/category/:category',
  rateLimiter.apiLimiter,
  FundController.getFundsByCategory
);

router.get(
  '/subcategory/:subcategory',
  rateLimiter.apiLimiter,
  FundController.getFundsBySubcategory
);

router.get(
  '/:schemeCode',
  rateLimiter.apiLimiter,
  FundController.getFundBySchemeCode
);

router.get(
  '/:schemeCode/nav',
  rateLimiter.apiLimiter,
  FundController.getFundNavHistory
);

router.get(
  '/:schemeCode/holdings',
  rateLimiter.apiLimiter,
  FundController.getFundHoldings
);

module.exports = router;
