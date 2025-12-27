import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';
import { mongodb } from '../src/db/mongodb';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://mf-frontend-coral.vercel.app',
      'https://mutual-fun-frontend-osed.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json());

// MongoDB connection middleware for serverless
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await mongodb.connect();
    next();
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
    });
  }
});

// Strip /api prefix since Vercel already adds it
// When request comes as /api/auth/google, we mount at /api/auth
app.use('/api/auth', authRoutes);

// For Vercel serverless, export the Express app directly
// Vercel's @vercel/node builder handles the conversion
export default app;
