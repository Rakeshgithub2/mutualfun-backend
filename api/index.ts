import type { VercelRequest, VercelResponse } from '@vercel/node';

// Main serverless handler - routes all API requests to Express app
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers dynamically based on origin
  const allowedOrigins = [
    'https://mf-frontend-coral.vercel.app',
    'https://mutual-fun-frontend-osed.vercel.app',
    'http://localhost:3000',
    'http://localhost:5001',
    'http://localhost:3001',
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Import the serverless handler
    const { default: serverlessHandler } = await import('../src/serverless');
    return await serverlessHandler(req, res);
  } catch (error: any) {
    console.error('Serverless handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
