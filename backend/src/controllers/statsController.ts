import { Request, Response } from 'express';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';
import { getDashboardStats } from '../models/statsModel.js';

export const getDashboardStatsController = withErrorHandling(
  async (req: Request, res: Response): Promise<void> => {
    // user comes from authenticated JWT middleware
    const payload = req.user as JWTUserPayload;
    const userId = payload.user_id;

    const stats = await getDashboardStats(userId);

    res.status(200).json(stats);
  }
);