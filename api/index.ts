import express from 'express';
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

// Route is /auth/google (Vercel adds /api prefix automatically)
app.use('/auth', authRoutes);

export default app;
