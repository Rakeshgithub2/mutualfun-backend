import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app';
import { mongodb } from './db/mongodb';

// Cache for serverless - maintain connection across invocations
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
    // Continue anyway - some endpoints might not need DB
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
