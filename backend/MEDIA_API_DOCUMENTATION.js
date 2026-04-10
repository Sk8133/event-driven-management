/**
 * ============================================================================
 * COLLEGE EVENT TASK MANAGER - MEDIA UPLOAD API DOCUMENTATION
 * ============================================================================
 * 
 * This document provides comprehensive information about the media upload
 * functionality in the Event Manager backend.
 * 
 * Base URL: http://localhost:5000
 * 
 * ============================================================================
 * ENDPOINTS
 * ============================================================================
 */

/**
 * 1. UPLOAD MEDIA TO EVENT
 * ============================================================================
 * 
 * Endpoint: POST /api/events/:id/upload
 * Description: Upload images and/or videos for a specific event
 * Authentication: Not required
 * Content-Type: multipart/form-data
 * 
 * Path Parameters:
 *   - id (string, required): MongoDB Event ID
 * 
 * Form Data Fields:
 *   - images (file, optional): Images to upload (can be multiple)
 *     Allowed formats: JPEG, PNG, JPG
 *     Max file size: 10MB per image
 *     Max count: 10 images at once
 * 
 *   - videos (file, optional): Videos to upload (can be multiple)
 *     Allowed formats: MP4, MKV, WebM
 *     Max file size: 50MB per video
 *     Max count: 5 videos at once
 * 
 * Example Request (using fetch):
 * ──────────────────────────────────
 * const formData = new FormData();
 * formData.append('images', imageFile1);
 * formData.append('images', imageFile2);
 * formData.append('videos', videoFile1);
 * 
 * const response = await fetch(
 *   'http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/upload',
 *   {
 *     method: 'POST',
 *     body: formData
 *   }
 * );
 * const data = await response.json();
 * console.log(data);
 * 
 * 
 * Success Response (200 OK):
 * ──────────────────────────────────
 * {
 *   "message": "Media uploaded and associated with event successfully",
 *   "uploadedFiles": {
 *     "images": [
 *       "/uploads/images/photo1-1234567890.jpg",
 *       "/uploads/images/photo2-1234567891.jpg"
 *     ],
 *     "videos": [
 *       "/uploads/videos/promo-1234567892.mp4"
 *     ]
 *   },
 *   "event": {
 *     "_id": "650f1a2b3c4d5e6f7g8h9i0j",
 *     "title": "Tech Fest 2024",
 *     "images": [
 *       "/uploads/images/photo1-1234567890.jpg",
 *       "/uploads/images/photo2-1234567891.jpg"
 *     ],
 *     "videos": [
 *       "/uploads/videos/promo-1234567892.mp4"
 *     ]
 *   }
 * }
 * 
 * 
 * Error Responses:
 * ──────────────────────────────────
 * 
 * 400 Bad Request - No files uploaded:
 * {
 *   "message": "No files uploaded. Please upload at least one image or video."
 * }
 * 
 * 400 Bad Request - Invalid file type:
 * {
 *   "message": "Invalid image type. Allowed: jpg, jpeg, png. Got: gif"
 * }
 * 
 * 400 Bad Request - File too large:
 * {
 *   "message": "File size exceeds limit (50MB max)"
 * }
 * 
 * 404 Not Found - Event doesn't exist:
 * {
 *   "message": "Event not found"
 * }
 * 
 * 500 Server Error:
 * {
 *   "message": "Error uploading files: [error details]"
 * }
 */

/**
 * 2. GET ALL MEDIA FOR AN EVENT
 * ============================================================================
 * 
 * Endpoint: GET /api/events/:id/media
 * Description: Retrieve all images and videos associated with an event
 * Authentication: Not required
 * Content-Type: application/json
 * 
 * Path Parameters:
 *   - id (string, required): MongoDB Event ID
 * 
 * Example Request:
 * ──────────────────────────────────
 * const response = await fetch(
 *   'http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media'
 * );
 * const data = await response.json();
 * console.log(data);
 * 
 * 
 * Success Response (200 OK):
 * ──────────────────────────────────
 * {
 *   "eventId": "650f1a2b3c4d5e6f7g8h9i0j",
 *   "eventTitle": "Tech Fest 2024",
 *   "imagesCount": 5,
 *   "videosCount": 2,
 *   "images": [
 *     "/uploads/images/photo1-1234567890.jpg",
 *     "/uploads/images/photo2-1234567891.jpg",
 *     "/uploads/images/photo3-1234567892.jpg",
 *     "/uploads/images/photo4-1234567893.jpg",
 *     "/uploads/images/photo5-1234567894.jpg"
 *   ],
 *   "videos": [
 *     "/uploads/videos/promo-1234567895.mp4",
 *     "/uploads/videos/highlight-1234567896.webm"
 *   ]
 * }
 * 
 * 
 * Error Responses:
 * ──────────────────────────────────
 * 
 * 404 Not Found - Event doesn't exist:
 * {
 *   "message": "Event not found"
 * }
 */

/**
 * 3. DELETE MEDIA FROM EVENT
 * ============================================================================
 * 
 * Endpoint: DELETE /api/events/:id/media/:mediaType/:index
 * Description: Delete a specific image or video from an event
 * Authentication: Not required
 * Content-Type: application/json
 * 
 * Path Parameters:
 *   - id (string, required): MongoDB Event ID
 *   - mediaType (string, required): Type of media to delete
 *     Options: "images" or "videos"
 *   - index (number, required): Index position of media in array (0-based)
 * 
 * Example Request:
 * ──────────────────────────────────
 * // Delete the first image from an event
 * const response = await fetch(
 *   'http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media/images/0',
 *   {
 *     method: 'DELETE'
 *   }
 * );
 * const data = await response.json();
 * console.log(data);
 * 
 * // Delete the second video from an event
 * const response = await fetch(
 *   'http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media/videos/1',
 *   {
 *     method: 'DELETE'
 *   }
 * );
 * 
 * 
 * Success Response (200 OK):
 * ──────────────────────────────────
 * {
 *   "message": "Image deleted successfully",
 *   "event": {
 *     "_id": "650f1a2b3c4d5e6f7g8h9i0j",
 *     "title": "Tech Fest 2024",
 *     "images": [
 *       "/uploads/images/photo2-1234567891.jpg",
 *       "/uploads/images/photo3-1234567892.jpg",
 *       "/uploads/images/photo4-1234567893.jpg",
 *       "/uploads/images/photo5-1234567894.jpg"
 *     ],
 *     "videos": [
 *       "/uploads/videos/promo-1234567895.mp4",
 *       "/uploads/videos/highlight-1234567896.webm"
 *     ]
 *   }
 * }
 * 
 * 
 * Error Responses:
 * ──────────────────────────────────
 * 
 * 400 Bad Request - Invalid media type:
 * {
 *   "message": "Invalid media type. Use \"images\" or \"videos\""
 * }
 * 
 * 400 Bad Request - Invalid index:
 * {
 *   "message": "Invalid media index"
 * }
 * 
 * 404 Not Found - Event not found:
 * {
 *   "message": "Event not found"
 * }
 * 
 * 404 Not Found - No media of that type:
 * {
 *   "message": "No images found for this event"
 * }
 */

/**
 * ============================================================================
 * ACCESSING UPLOADED FILES
 * ============================================================================
 * 
 * Once uploaded, files are accessible via HTTP:
 * 
 * Image:
 *   http://localhost:5000/uploads/images/photo1-1234567890.jpg
 * 
 * Video:
 *   http://localhost:5000/uploads/videos/promo-1234567895.mp4
 * 
 * You can use these URLs directly in:
 * - <img src="..." /> tags
 * - <video src="..." /> tags
 * - <a href="..." download /> tags
 */

/**
 * ============================================================================
 * FILE STRUCTURE
 * ============================================================================
 * 
 * Uploaded files are stored in:
 * 
 * backend/
 * ├── uploads/
 * │   ├── images/          (all image files)
 * │   │   ├── photo1-1234567890.jpg
 * │   │   ├── photo2-1234567891.jpg
 * │   │   └── ...
 * │   └── videos/          (all video files)
 * │       ├── promo-1234567895.mp4
 * │       ├── highlight-1234567896.webm
 * │       └── ...
 */

/**
 * ============================================================================
 * SUPPORTED FILE TYPES & LIMITS
 * ============================================================================
 * 
 * IMAGES:
 *   - Formats: JPEG, PNG, JPG
 *   - Size limit: 10MB per file
 *   - Max upload: 10 images at once
 * 
 * VIDEOS:
 *   - Formats: MP4, MKV, WebM
 *   - Size limit: 50MB per file
 *   - Max upload: 5 videos at once
 */

/**
 * ============================================================================
 * FRONTEND INTEGRATION
 * ============================================================================
 * 
 * Use the EventMediaUpload component in your React app:
 * 
 * import EventMediaUpload from '../components/EventMediaUpload';
 * 
 * <EventMediaUpload
 *   eventId="650f1a2b3c4d5e6f7g8h9i0j"
 *   eventTitle="Tech Fest 2024"
 *   onMediaUpdated={(event) => console.log('Media updated!', event)}
 * />
 * 
 * Props:
 *   - eventId (string, required): The event's MongoDB ID
 *   - eventTitle (string, optional): Event name to display
 *   - onMediaUpdated (function, optional): Callback when media is uploaded
 */

/**
 * ============================================================================
 * CURL EXAMPLES
 * ============================================================================
 * 
 * Upload images:
 * ──────────────────────────────────
 * curl -X POST \
 *   http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/upload \
 *   -F "images=@/path/to/image1.jpg" \
 *   -F "images=@/path/to/image2.jpg"
 * 
 * 
 * Get all media:
 * ──────────────────────────────────
 * curl http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media
 * 
 * 
 * Delete first image:
 * ──────────────────────────────────
 * curl -X DELETE \
 *   http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media/images/0
 */

export default {}; // Placeholder for import compatibility
