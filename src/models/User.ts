// src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profilePicture: String,
  settings: {
    notifications: { type: Boolean, default: true },
    privacyLevel: { type: String, enum: ['private', 'public'], default: 'private' }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

export const User = mongoose.model('User', userSchema);

// src/models/Analysis.ts
const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoUrl: { type: String, required: true },
  posture: { type: Number, min: 0, max: 100 },
  gestures: { type: Number, min: 0, max: 100 },
  eyeContact: { type: Number, min: 0, max: 100 },
  voiceClarity: { type: Number, min: 0, max: 100 },
  pace: { type: Number, min: 0, max: 100 },
  engagement: { type: Number, min: 0, max: 100 },
  timestamp: { type: Date, default: Date.now },
  aiInsights: {
    strengths: [String],
    improvements: [String],
    recommendations: [String]
  },
  metadata: {
    duration: Number,
    fileSize: Number,
    format: String
  }
});

export const Analysis = mongoose.model('Analysis', analysisSchema);

// src/models/Session.ts
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' }],
  startTime: { type: Date, required: true },
  endTime: Date,
  goals: [String],
  notes: String,
  progress: {
    initial: {
      posture: Number,
      gestures: Number,
      eyeContact: Number,
      voiceClarity: Number,
      pace: Number,
      engagement: Number
    },
    final: {
      posture: Number,
      gestures: Number,
      eyeContact: Number,
      voiceClarity: Number,
      pace: Number,
      engagement: Number
    }
  }
});

export const Session = mongoose.model('Session', sessionSchema);