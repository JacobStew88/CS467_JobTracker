import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import passport from 'passport';
import { requireAuth } from './middleware/passport';


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
app.use('/auth', authRouter);
app.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated 🎉" });
});

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express Server!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});