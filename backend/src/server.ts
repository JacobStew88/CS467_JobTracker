import express, { Application, Request, Response } from 'express';
import { requireAuth } from './middleware/passport';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import passport from 'passport';
import jobRouter from './routes/jobRoutes';
import skillRouter from './routes/skillRoutes';
import userRouter from './routes/userRoutes';

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

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Backend API Working!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});