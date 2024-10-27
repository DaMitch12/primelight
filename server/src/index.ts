// server/src/index.ts
import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import connectDB from '../src/config/db';
import authRoutes from '../src/routes/authRoutes';
import userRoutes from '../src/routes/userRoutes';
import videoRoutes from '../src/routes/videoRoutes';

dotenv.config();

const app: Express = express();

// Configure multer for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes with existing paths maintained
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to CommSkill API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;