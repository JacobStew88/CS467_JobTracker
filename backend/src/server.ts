import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import jobRouter from './routes/jobRoutes';
import { requireAuth } from './middleware/passport';

// Enviroment Variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/jobs', requireAuth, jobRouter);


// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express Server!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});