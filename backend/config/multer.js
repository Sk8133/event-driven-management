import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload folders
const uploadDir = path.join(__dirname, '../uploads');
const imageDir = path.join(uploadDir, 'images');
const videoDir = path.join(uploadDir, 'videos');

// Create directories if they don't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

// Define allowed file types and their destinations
const allowedVideoTypes = ['video/mp4', 'video/x-matroska', 'video/webm'];

/**
 * MULTER CONFIGURATION FOR IMAGES
 * - Destination: uploads/images/
 * - File naming: timestamp + random + original extension
 * - File size limit: 10MB
 * - Allowed types: JPEG, PNG, JPG
 */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    // Create filename: timestamp + random number + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type. Allowed: all image formats. Got: ${file.mimetype}`), false);
  }
};

/**
 * MULTER CONFIGURATION FOR VIDEOS
 * - Destination: uploads/videos/
 * - File naming: timestamp + random + original extension
 * - File size limit: 50MB
 * - Allowed types: MP4, MKV, WebM
 */
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    // Create filename: timestamp + random number + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const videoFilter = (req, file, cb) => {
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid video type. Allowed: mp4, mkv, webm. Got: ${file.mimetype}`), false);
  }
};

/**
 * Create Multer instances for images and videos
 */
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for images
});

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
});

/**
 * Multer instance for mixed files (both images and videos)
 */
export const uploadMixed = multer({
  storage: (_, file, cb) => {
    // Dynamically choose storage based on file type
    if (allowedImageTypes.includes(file.mimetype)) {
      imageStorage._handleFile(_, file, cb);
    } else if (allowedVideoTypes.includes(file.mimetype)) {
      videoStorage._handleFile(_, file, cb);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), null);
    }
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: all image formats and videos (mp4, mkv, webm)`), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});
