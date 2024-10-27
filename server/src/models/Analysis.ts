import mongoose, { Document } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  videoUrl: string;
  results: {
    eyeContact: number;
    posture: number;
    gestures: number;
    speechClarity: number;
    voiceClarity?: number;
    pace?: number;
    engagement?: number;
  };
  feedback?: string;
  createdAt: Date;
}

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  results: {
    eyeContact: Number,
    posture: Number,
    gestures: Number,
    speechClarity: Number,
    voiceClarity: Number,
    pace: Number,
    engagement: Number
  },
  feedback: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure videoUrl is cleaned up when analysis is deleted
analysisSchema.pre('remove', async function(next) {
  try {
    // Import here to avoid circular dependency
    const { serverVideoService } = require('../services/serverVideoService');
    await serverVideoService.cleanup(this.videoUrl);
    next();
  } catch (error) {
    next(error);
  }
});

export const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);
export default Analysis;