import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';
import fundRoutes from './routes/fund.routes';
import compareRoutes from './routes/compare.routes';
import overlapRoutes from './routes/overlap.routes';
import marketIndexRoutes from './routes/marketIndex.routes';
import { mongodb } from './db/mongodb';

// Main Express application for Vercel serverless
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5001',
      'http://localhost:5173',
      'https://mf-frontend-coral.vercel.app',
      'https://mutual-fun-frontend-osed.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection middleware for serverless
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    await mongodb.connect();
    next();
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
    });
  }
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongodb.isConnected(),
  });
});

// Test DB route
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

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/overlap', overlapRoutes);
app.use('/api/market', marketIndexRoutes);

// 404 handler - return JSON, not HTML
app.use((req: Request, res: Response) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/funds',
      'GET /api/funds/:id',
      'POST /api/compare',
      'POST /api/overlap',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/google',
      'POST /api/auth/google',
      'GET /api/market/indices',
      'GET /api/market/summary',
    ],
  });
});

// Global error handler - return JSON, not HTML
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// For Vercel serverless, export the Express app directly
export default app;
