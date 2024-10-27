import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { serverVideoService } from '../services/serverVideoService';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    id?: string;
  };
  file?: Express.Multer.File;
}

export class VideoController {
  async uploadAndAnalyze(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const userId = req.user?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Upload and analyze video
      const analysis = await serverVideoService.uploadAndAnalyze(
        req.file.buffer,
        userId
      );

      res.json({
        success: true,
        results: analysis,
      });
    } catch (error) {
      console.error('Video analysis error:', error);
      res.status(500).json({ error: 'Failed to process video' });
    }
  }

  async getAnalysisList(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analyses = await serverVideoService.getAnalysisList(userId);
      res.json({
        success: true,
        analyses,
      });
    } catch (error) {
      console.error('Analysis list error:', error);
      res.status(500).json({ error: 'Failed to fetch analysis list' });
    }
  }
}

export const videoController = new VideoController();