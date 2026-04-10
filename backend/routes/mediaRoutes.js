import express from 'express';
import { uploadMixed } from '../config/multer.js';
import {
  uploadEventMedia,
  getEventMedia,
  deleteEventMedia,
} from '../controllers/mediaController.js';

const router = express.Router({ mergeParams: true });

/**
 * MEDIA ENDPOINTS FOR EVENTS
 * 
 * All routes require event ID as parameter (/api/events/:id/...)
 */

/**
 * POST /api/events/:id/upload
 * Upload images and/or videos for an event
 * 
 * Request:
 * - Form-data with:
 *   - images (file field, multiple allowed)
 *   - videos (file field, multiple allowed)
 * 
 * Response:
 * - Success: { message, uploadedFiles, event }
 * - Error: { message }
 * 
 * Example using fetch:
 * const formData = new FormData();
 * formData.append('images', imageFile1);
 * formData.append('images', imageFile2);
 * formData.append('videos', videoFile1);
 * 
 * fetch(`/api/events/${eventId}/upload`, {
 *   method: 'POST',
 *   body: formData
 * })
 */
router.post('/upload', uploadMixed.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
]), uploadEventMedia);

/**
 * GET /api/events/:id/media
 * Retrieve all media files associated with an event
 * 
 * Response:
 * - Success: { eventId, eventTitle, imagesCount, videosCount, images[], videos[] }
 * - Error: { message }
 * 
 * Example:
 * fetch(`/api/events/${eventId}/media`).then(res => res.json())
 */
router.get('/media', getEventMedia);

/**
 * DELETE /api/events/:id/media/:mediaType/:index
 * Delete a specific image or video from an event
 * 
 * Params:
 * - mediaType: 'images' or 'videos'
 * - index: Position of media in array (0-based)
 * 
 * Response:
 * - Success: { message, event }
 * - Error: { message }
 * 
 * Example:
 * fetch(`/api/events/${eventId}/media/images/0`, {
 *   method: 'DELETE'
 * })
 */
router.delete('/media/:mediaType/:index', deleteEventMedia);

export default router;
