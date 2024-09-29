import mongoose from 'mongoose';
import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error connecting to the database', err);
});
