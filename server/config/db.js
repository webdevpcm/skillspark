import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillspark';

  try {
    // Attempt standard connection first with 3 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`Connected to MongoDB via URI: ${uri}`);
    return;
  } catch (err) {
    console.warn(`Standard MongoDB connection to ${uri} failed (${err.message}). Starting MongoMemoryServer...`);
  }

  // Fallback to in-memory MongoDB
  try {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'skillspark'
      },
      binary: {
        version: '7.0.14'
      },
      startupTimeout: 180000
    });

    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to embedded MongoMemoryServer at: ${memoryUri}`);
  } catch (error) {
    console.error('Failed to initialize MongoMemoryServer:', error);
    throw error;
  }
}

export async function closeDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
