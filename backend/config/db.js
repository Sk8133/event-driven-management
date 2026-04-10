import mongoose from 'mongoose';

const connectDB = async (retries = 10) => { // Increased retries for Render
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      socketTimeoutMS: 60000, // Increased timeout
      connectTimeoutMS: 30000, // Increased timeout
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error (attempt ${11 - retries}):`, error.message);

    if (retries > 1) {
      const delay = Math.min(10000, 5000 * (11 - retries)); // Progressive delay
      console.log(`Retrying in ${delay/1000} seconds... (${retries - 1} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1);
    }

    console.error('MongoDB connection failed after all retries. Please check IP whitelist in MongoDB Atlas.');
    throw error; // Let the application crash so Render shows the error
  }
};

export default connectDB;
