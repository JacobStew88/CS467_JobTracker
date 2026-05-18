import express from 'express';
import { getDashboardStatsController } from '../controllers/statsController.js';

const router = express.Router();

// Protected analytics endpoint
router.get('/', getDashboardStatsController);

export default router;