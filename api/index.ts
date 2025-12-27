import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';

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

// Strip /api prefix since Vercel already adds it
// When request comes as /api/auth/google, we mount at /api/auth
app.use('/api/auth', authRoutes);

// For Vercel serverless, export the Express app directly
// Vercel's @vercel/node builder handles the conversion
export default app;
