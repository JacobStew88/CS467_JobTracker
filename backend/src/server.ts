import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import authRouter from './routes/authRoutes.js';
import { requireAuth } from './middleware/passport.js';
import jobRouter from './routes/jobRoutes.js';
import skillRouter from './routes/skillRoutes.js';
import userRouter from './routes/userRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import statsRouter from './routes/statsRoutes.js';

// Enviroment Variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/jobs', requireAuth, jobRouter);
app.use('/api/skills', requireAuth, skillRouter);
app.use('/api/users', requireAuth, userRouter);
app.use('/api/contacts', requireAuth, contactRouter);
app.use('/api/stats', requireAuth, statsRouter);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Backend API Working!');
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});