import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(compression());
app.use(express.json());

// Serve static files from uploads folder
// Access: http://localhost:5000/uploads/images/filename.jpg
// Access: http://localhost:5000/uploads/videos/filename.mp4
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route - health check
app.get('/', (req, res) => {
  res.json({ message: 'EventHub API Server is running!', version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/teams', authMiddleware, teamRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle multer-specific errors
  if (err.message && err.message.includes('Invalid')) {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File size exceeds limit' });
  }
  
  // Handle file type validation errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  
  res.status(500).json({ message: 'Server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Media files accessible at http://localhost:${PORT}/uploads/`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
