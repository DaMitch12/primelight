// src/services/VideoAnalysisService.ts

interface AnalysisResult {
  eyeContact: number;
  posture: number;
  gestures: number;
  voiceClarity: number;
  pace: number;
  engagement: number;
}

interface AnalysisSession {
  _id: string;
  userId: string;
  videoUrl: string;
  status: string;
  timestamp: Date;
}

class VideoAnalysisService {
  private apiUrl: string;
  private useMockData: boolean;

  constructor() {
    this.apiUrl = '/api/video';
    this.useMockData = true; // Set to false when backend is ready
  }

  async startAnalysis(videoFile: File): Promise<AnalysisSession> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await fetch(`${this.apiUrl}/start`, {
        method: 'POST',
        body: formData,
        headers: {
          // Include auth header if you have it
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const data = await response.json();
      return data.session;
    } catch (error) {
      console.error('Start analysis error:', error);
      throw error;
    }
  }

  async processVideo(videoUrl: string): Promise<AnalysisResult> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        eyeContact: Math.floor(Math.random() * (95 - 75) + 75),
        posture: Math.floor(Math.random() * (90 - 70) + 70),
        gestures: Math.floor(Math.random() * (85 - 65) + 65),
        voiceClarity: Math.floor(Math.random() * (95 - 80) + 80),
        pace: Math.floor(Math.random() * (90 - 70) + 70),
        engagement: Math.floor(Math.random() * (95 - 75) + 75)
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth header if you have it
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Process video error:', error);
      throw error;
    }
  }

  async processRealTimeFrame(frame: ImageData): Promise<Partial<AnalysisResult>> {
    if (this.useMockData) {
      return {
        eyeContact: Math.floor(Math.random() * (95 - 75) + 75),
        posture: Math.floor(Math.random() * (90 - 70) + 70),
        gestures: Math.floor(Math.random() * (85 - 65) + 65)
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/process-frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameData: Array.from(frame.data),
          width: frame.width,
          height: frame.height
        }),
      });

      if (!response.ok) {
        throw new Error('Frame processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Frame processing error:', error);
      throw error;
    }
  }

  async getAnalysisHistory(): Promise<AnalysisSession[]> {
    try {
      const response = await fetch(`${this.apiUrl}/history`, {
        headers: {
          // Include auth header if you have it
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }

  async cleanup(videoUrl: string): Promise<void> {
    if (videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
  }
}

export const videoAnalysisService = new VideoAnalysisService();