import { Router } from 'express';
import authRoutes from './auth';
import fundsRoutes from './funds';
import fundManagersRoutes from './fundManagers';
import usersRoutes from './users';
import watchlistRoutes from './watchlist';
import alertsRoutes from './alerts';
import portfolioRoutes from './portfolio';
import investmentRoutes from './investments';
import kycRoutes from './kyc';
import marketIndicesRoutes from './marketIndices';
import newsRoutes from './news';
import adminRoutes from './admin';
import calculatorRoutes from './calculator';
import comparisonRoutes from './comparison';
import taxRoutes from './tax';
import aiRoutes from './ai';
import suggestRoutes from './suggest';
import feedbackRoutes from './feedback.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/funds', fundsRoutes);
router.use('/fund-managers', fundManagersRoutes);
router.use('/suggest', suggestRoutes); // Autocomplete endpoint
router.use('/users', usersRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/alerts', alertsRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/investments', investmentRoutes);
router.use('/kyc', kycRoutes);
router.use('/market-indices', marketIndicesRoutes);
router.use('/news', newsRoutes);
router.use('/admin', adminRoutes);
router.use('/calculator', calculatorRoutes);
router.use('/comparison', comparisonRoutes);
router.use('/tax', taxRoutes);
router.use('/ai', aiRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
