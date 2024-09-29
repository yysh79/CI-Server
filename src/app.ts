import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
app.use(express.json()); // Middleware שממיר את גוף הבקשה ל-JSON.

// רישום הנתיבים של המשתמשים
app.use('/api/users', userRoutes);

// רישום Middleware לטיפול בשגיאות
app.use(errorMiddleware);

export default app;
