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
    console.log(
      `[Middleware] Connecting MongoDB for ${req.method} ${req.path}`
    );
    await mongodb.connect();
    console.log(
      '[Middleware] MongoDB connected, isConnected:',
      mongodb.isConnected()
    );
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

// Test route
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    const db = mongodb.getDb();
    const collections = await db.listCollections().toArray();
    res.json({
      success: true,
      message: 'Database connected',
      collections: collections.map((c) => c.name),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Strip /api prefix since Vercel already adds it
// When request comes as /api/auth/google, we mount at /api/auth
app.use('/api/auth', authRoutes);

// For Vercel serverless, export the Express app directly
// Vercel's @vercel/node builder handles the conversion
export default app;
