import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educationalAssistant';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected.');
    });

  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
