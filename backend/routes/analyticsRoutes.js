import express from 'express';
import { getDashboardAnalytics, getSummaryAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

/**
 * ANALYTICS ROUTES
 * Endpoints for fetching analytics data
 */

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get comprehensive analytics dashboard data
 * @access  Public (can be restricted to admin only if needed)
 * @returns {Object} Analytics data with all metrics
 */
router.get('/dashboard', getDashboardAnalytics);

/**
 * @route   GET /api/analytics/summary
 * @desc    Get quick summary metrics
 * @access  Public
 * @returns {Object} Summary metrics (totalEvents, totalTasks, etc.)
 */
router.get('/summary', getSummaryAnalytics);

export default router;
