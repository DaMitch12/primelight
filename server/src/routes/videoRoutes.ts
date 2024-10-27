import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';
import videoAnalysisService from '../services/videoAnalysisService';
import { Types } from 'mongoose';

const router = express.Router();

// Configure multer for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Upload and start video analysis session
router.post('/start', authMiddleware, upload.single('video'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    // Upload video to Google Cloud Storage
    const videoUrl = await videoAnalysisService.uploadVideo(
      req.file.buffer,
      req.file.originalname,
      req.user.userId
    );

    // Start analysis session
    const session = await videoAnalysisService.startAnalysis(
      new Types.ObjectId(req.user.userId),
      videoUrl
    );

    res.json({ success: true, session, videoUrl });
  } catch (error) {
    console.error('Start analysis error:', error);
    res.status(500).json({ message: 'Error starting analysis session' });
  }
});

// Process video and save results
router.post('/process', authMiddleware, async (req: any, res) => {
  try {
    const { videoUrl } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    // Process the video
    const results = await videoAnalysisService.processVideo(videoUrl);
    
    // Save the results
    const analysis = await videoAnalysisService.saveResults(
      new Types.ObjectId(req.user.userId),
      videoUrl,
      results
    );

    // Clean up the video file from storage if needed
    await videoAnalysisService.cleanup(videoUrl);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Process video error:', error);
    res.status(500).json({ message: 'Error processing video' });
  }
});

// Get analysis history
router.get('/history', authMiddleware, async (req: any, res) => {
  try {
    const history = await videoAnalysisService.getAnalysisHistory(
      new Types.ObjectId(req.user.userId)
    );
    res.json({ success: true, history });
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Error fetching analysis history' });
  }
});

// Get single analysis by ID
router.get('/:analysisId', authMiddleware, async (req: any, res) => {
  try {
    const analysis = await videoAnalysisService.getAnalysisById(
      new Types.ObjectId(req.params.analysisId),
      new Types.ObjectId(req.user.userId)
    );
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Fetch analysis error:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
});

// Delete analysis
router.delete('/:analysisId', authMiddleware, async (req: any, res) => {
  try {
    await videoAnalysisService.deleteAnalysis(
      new Types.ObjectId(req.params.analysisId),
      new Types.ObjectId(req.user.userId)
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Error deleting analysis' });
  }
});


// Test Google Cloud connection
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const bucket = await serverVideoService.testGoogleCloudConnection();
    res.json({ success: true, bucket });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({ error: 'Failed to connect to Google Cloud' });
  }
});

// Test audio transcription
router.post('/test-audio', authMiddleware, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    const transcript = await serverVideoService.testAudioTranscription(req.file.buffer);
    res.json({ success: true, transcript });
  } catch (error) {
    console.error('Audio test error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;