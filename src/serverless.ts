import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app';
import { mongodb } from './db/mongodb';

// Cache for serverless - maintain connection across invocations
let isConnected = false;

const connectDB = async (): Promise<void> => {
  // Always check if connected, don't rely on cached flag alone
  if (mongodb.isConnected()) {
    return;
  }

  try {
    console.log('🔄 Attempting MongoDB connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    await mongodb.connect();
    isConnected = true;
    console.log('✅ MongoDB connected for serverless function');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error; // Don't continue if DB connection fails
  }
};

// Serverless handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure DB is connected
    await connectDB();

    // Handle the request with Express app
    // We need to wrap this properly for serverless
    await new Promise<void>((resolve, reject) => {
      // Set a flag to track if response was sent
      let responseSent = false;

      // Override res.end to know when response is complete
      const originalEnd = res.end.bind(res);
      res.end = function (...args: any[]) {
        if (!responseSent) {
          responseSent = true;
          originalEnd(...args);
          resolve();
        }
        return res;
      } as any;

      // Call Express app
      app(req as any, res as any, (err: any) => {
        if (err && !responseSent) {
          responseSent = true;
          reject(err);
        } else if (!responseSent) {
          // If no error and response not sent, something went wrong
          responseSent = true;
          resolve();
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Serverless function error:', error);

    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Also export the app
export { app };
