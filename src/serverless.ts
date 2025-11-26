import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './index';
import { mongodb } from './db/mongodb';

// Cache for serverless
let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    if (!mongodb.isConnected()) {
      await mongodb.connect();
      isConnected = true;
      console.log('✅ MongoDB connected for serverless function');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Continue anyway - some endpoints don't need DB
  }
};

// For Vercel serverless - proper typing
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Connect to DB before processing request
    await connectDB();

    // Pass request to Express app using proper method
    // Express apps need to be invoked as middleware
    return new Promise((resolve, reject) => {
      app(req as any, res as any, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}

// Also export the app for local development
export { app };
