import Event from '../models/Event.js';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { sendEmailToStudents, mediaUploadEmailTemplate } from '../config/emailService.js';

const extractCloudinaryPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/i);
  return match ? match[1] : null;
};

/**
 * UPLOAD MEDIA FOR EVENT
 * POST /api/events/:id/upload
 * 
 * Accepts: multipart/form-data with:
 * - images (multiple files)
 * - videos (multiple files)
 * 
 * Returns: Updated event with media files
 */
export const uploadEventMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Handle uploaded files
    const uploadedFiles = {
      images: [],
      videos: [],
    };

    // Process uploaded images
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of imageFiles) {
        const uploadResponse = await cloudinary.uploader.upload(file.path, {
          folder: `event_media/${event._id || id}/images`,
          resource_type: 'image',
        });

        const securePath = uploadResponse.secure_url;
        uploadedFiles.images.push(securePath);
        event.images.push(securePath);

        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.warn('Unable to remove temp image file:', unlinkError);
        }
      }
    }

    // Process uploaded videos
    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos)
        ? req.files.videos
        : [req.files.videos];

      for (const file of videoFiles) {
        const uploadResponse = await cloudinary.uploader.upload(file.path, {
          folder: `event_media/${event._id || id}/videos`,
          resource_type: 'video',
        });

        const securePath = uploadResponse.secure_url;
        uploadedFiles.videos.push(securePath);
        event.videos.push(securePath);

        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.warn('Unable to remove temp video file:', unlinkError);
        }
      }
    }

    // Check if any files were uploaded
    if (uploadedFiles.images.length === 0 && uploadedFiles.videos.length === 0) {
      return res.status(400).json({ 
        message: 'No files uploaded. Please upload at least one image or video.' 
      });
    }

    // Save updated event to database
    await event.save();

    // Send email to all registered students if uploaded by admin
    if (userRole === 'admin') {
      const students = await User.find({ role: 'student' }, 'email');
      const studentEmails = students.map(s => s.email);
      
      if (studentEmails.length > 0) {
        let mediaType = 'Media';
        let mediaCount = 0;

        if (uploadedFiles.images.length > 0) {
          mediaType = 'Images';
          mediaCount = uploadedFiles.images.length;
        } else if (uploadedFiles.videos.length > 0) {
          mediaType = 'Videos';
          mediaCount = uploadedFiles.videos.length;
        }

        const emailHTML = mediaUploadEmailTemplate(event.title, mediaType, mediaCount);
        sendEmailToStudents(studentEmails, `New ${mediaType} Added to Event: ${event.title}`, emailHTML);
      }
    }

    // Return success response
    res.status(200).json({
      message: 'Media uploaded and associated with event successfully',
      uploadedFiles,
      event,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle multer errors
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message.includes('LIMIT_FILE_SIZE')) {
      return res.status(400).json({ message: 'File size exceeds limit (50MB max)' });
    }

    res.status(500).json({ message: 'Error uploading files: ' + error.message });
  }
};

/**
 * GET ALL MEDIA FOR AN EVENT
 * GET /api/events/:id/media
 * 
 * Returns: Event with all associated images and videos
 */
export const getEventMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event and populate media
    const event = await Event.findById(id).select('title images videos');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Return media files
    res.status(200).json({
      eventId: event._id,
      eventTitle: event.title,
      imagesCount: event.images.length,
      videosCount: event.videos.length,
      images: event.images,
      videos: event.videos,
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Error retrieving media: ' + error.message });
  }
};

/**
 * DELETE MEDIA FROM EVENT
 * DELETE /api/events/:id/media/:mediaType/:index
 * 
 * Params:
 * - id: Event ID
 * - mediaType: 'images' or 'videos'
 * - index: Index of media file to delete
 * 
 * Deletes file from both filesystem and database
 */
export const deleteEventMedia = async (req, res) => {
  try {
    const { id, mediaType, index } = req.params;

    // Validate media type
    if (!['images', 'videos'].includes(mediaType)) {
      return res.status(400).json({ message: 'Invalid media type. Use "images" or "videos"' });
    }

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get media array
    const mediaArray = event[mediaType];
    if (!mediaArray || mediaArray.length === 0) {
      return res.status(404).json({ message: `No ${mediaType} found for this event` });
    }

    // Validate index
    const mediaIndex = parseInt(index);
    if (mediaIndex < 0 || mediaIndex >= mediaArray.length) {
      return res.status(400).json({ message: 'Invalid media index' });
    }

    // Get file path and delete from filesystem or Cloudinary
    const filePath = mediaArray[mediaIndex];
    const isRemoteUrl = typeof filePath === 'string' && filePath.startsWith('http');

    if (isRemoteUrl) {
      const publicId = extractCloudinaryPublicId(filePath);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: mediaType === 'images' ? 'image' : 'video',
          });
        } catch (cloudError) {
          console.warn('Could not delete Cloudinary file:', cloudError);
        }
      }
    } else {
      const fullPath = path.join(
        path.dirname(new URL(import.meta.url).pathname),
        '../..',
        filePath
      );

      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (fsError) {
        console.warn('Could not delete file from filesystem:', fsError);
      }
    }

    // Remove from database
    mediaArray.splice(mediaIndex, 1);
    await event.save();

    res.status(200).json({
      message: `${mediaType.slice(0, -1)} deleted successfully`,
      event,
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Error deleting media: ' + error.message });
  }
};
