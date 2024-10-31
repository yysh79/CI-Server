import mongoose from 'mongoose';
import  'dotenv/config';

//חיבור למונגו די בי
export const connectDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed', error);
    
  }
}



