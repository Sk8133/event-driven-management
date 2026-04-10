# 📸 Media Upload Feature - Setup & Usage Guide

This document explains the media upload functionality added to your College Event Task Manager. This feature allows users to upload images and videos for events.

---

## 📋 What's New

### Features Added:
✅ **Image uploads** (JPG, PNG, JPEG)  
✅ **Video uploads** (MP4, MKV, WebM)  
✅ **Multiple file upload** (10 images, 5 videos at once)  
✅ **File size validation** (10MB images, 50MB videos)  
✅ **Delete media** from events  
✅ **View all media** for an event  
✅ **Drag & drop** file upload (frontend)  
✅ **Static file serving** (access uploaded files via HTTP)  

---

## 📁 Files Created & Modified

### New Files:
- `backend/config/multer.js` - Multer configuration for file uploads
- `backend/controllers/mediaController.js` - Upload & media management logic
- `backend/routes/mediaRoutes.js` - Media API endpoints
- `frontend/src/components/EventMediaUpload.jsx` - React upload component
- `backend/uploads/` - Folder for storing uploaded files
- `MEDIA_API_DOCUMENTATION.js` - Complete API documentation

### Modified Files:
- `backend/models/Event.js` - Added images[] and videos[] fields
- `backend/server.js` - Added static file serving & error handling
- `backend/routes/eventRoutes.js` - Mounted media routes
- `backend/package.json` - Added multer dependency

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies (Already Done ✓)
```bash
cd backend
npm install multer
```

### Step 2: Verify Folder Structure
The following folders have been created:
```
backend/
├── uploads/
│   ├── images/    (stores uploaded images)
│   ├── videos/    (stores uploaded videos)
│   └── .gitignore (prevents committing large files)
```

These folders store uploaded media files on your server.

### Step 3: Restart Backend Server
```bash
# Kill the old process and restart
npm start
# or
npm run dev
```

You should see in the console:
```
Server running on http://localhost:5000
Media files accessible at http://localhost:5000/uploads/
```

---

## 📡 API Endpoints Overview

### 1. Upload Media
```
POST /api/events/:id/upload
```
Upload images and/or videos for an event.

**Request:**
```javascript
const formData = new FormData();
formData.append('images', imageFile);
formData.append('videos', videoFile);

fetch(`http://localhost:5000/api/events/EVENT_ID/upload`, {
  method: 'POST',
  body: formData
});
```

### 2. Get All Media
```
GET /api/events/:id/media
```
Retrieve all images and videos for an event.

**Response:**
```json
{
  "eventId": "...",
  "eventTitle": "...",
  "imagesCount": 3,
  "videosCount": 2,
  "images": ["/uploads/images/file1.jpg", ...],
  "videos": ["/uploads/videos/file1.mp4", ...]
}
```

### 3. Delete Media
```
DELETE /api/events/:id/media/:mediaType/:index
```
Delete a specific image or video.

**Params:**
- `mediaType`: "images" or "videos"
- `index`: Array position (0, 1, 2, ...)

**Example:**
```javascript
fetch(`/api/events/EVENT_ID/media/images/0`, {
  method: 'DELETE'
});
```

---

## 🎨 Frontend Integration

### Using the EventMediaUpload Component

1. **Import the component:**
```javascript
import EventMediaUpload from '../components/EventMediaUpload';
```

2. **Use it in your event detail page:**
```jsx
<EventMediaUpload
  eventId="650f1a2b3c4d5e6f7g8h9i0j"
  eventTitle="Tech Fest 2024"
  onMediaUpdated={(event) => {
    console.log('Media uploaded!', event);
  }}
/>
```

3. **Component Features:**
   - Drag & drop file upload
   - File preview before upload
   - Remove files before uploading
   - Display existing uploaded media
   - Delete media with one click
   - Error handling & validation
   - Upload progress feedback

---

## 📤 Uploading Files

### Method 1: Using the React Component (Easy!)
Simply use the `EventMediaUpload` component in your app.

### Method 2: Manual JavaScript Fetch
```javascript
const uploadMedia = async (eventId, imageFile, videoFile) => {
  const formData = new FormData();
  
  if (imageFile) {
    formData.append('images', imageFile);
  }
  
  if (videoFile) {
    formData.append('videos', videoFile);
  }

  const response = await fetch(
    `http://localhost:5000/api/events/${eventId}/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();
  console.log('Upload result:', data);
};
```

### Method 3: Using cURL
```bash
curl -X POST \
  http://localhost:5000/api/events/YOUR_EVENT_ID/upload \
  -F "images=@/path/to/image.jpg" \
  -F "videos=@/path/to/video.mp4"
```

---

## 🖼️ Displaying Uploaded Files

### Display an Image
```jsx
<img 
  src="http://localhost:5000/uploads/images/photo1-1234567890.jpg" 
  alt="Event photo" 
/>
```

### Display a Video
```jsx
<video controls width="400">
  <source 
    src="http://localhost:5000/uploads/videos/promo-1234567895.mp4" 
    type="video/mp4"
  />
  Your browser doesn't support HTML5 video.
</video>
```

### In React with State
```jsx
const [media, setMedia] = useState(null);

useEffect(() => {
  fetch(`/api/events/EVENT_ID/media`)
    .then(res => res.json())
    .then(data => setMedia(data));
}, []);

return (
  <div>
    {media?.images.map((img, i) => (
      <img key={i} src={`http://localhost:5000${img}`} alt="" />
    ))}
  </div>
);
```

---

## ⚠️ File Size & Type Restrictions

### Image Files
- **Allowed formats:** JPG, JPEG, PNG
- **Max file size:** 10MB per image
- **Max count:** 10 images per upload

### Video Files
- **Allowed formats:** MP4, MKV, WebM
- **Max file size:** 50MB per video
- **Max count:** 5 videos per upload

**Note:** These limits can be modified in `backend/config/multer.js`

---

## 🔧 Configuration

### To Change File Size Limits

Edit `backend/config/multer.js`:

```javascript
// Change image limit to 20MB
export const uploadImage = multer({
  // ...
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Change video limit to 100MB
export const uploadVideo = multer({
  // ...
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
```

### To Add More File Types

Edit `backend/config/multer.js`:

```javascript
// Add support for GIF images
const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif'  // Add this
];

// Add support for AVI videos
const allowedVideoTypes = [
  'video/mp4',
  'video/x-matroska',
  'video/webm',
  'video/x-msvideo'  // Add this
];
```

---

## 🧪 Testing

### Test with Postman

1. **Open Postman**
2. **Create new POST request** to: `http://localhost:5000/api/events/YOUR_EVENT_ID/upload`
3. **Go to Body tab** → Select **form-data**
4. **Add file fields:**
   - Key: `images` → Value: Select your image file
   - Key: `videos` → Value: Select your video file
5. **Click Send**

### Test with cURL

```bash
# Upload image
curl -X POST \
  http://localhost:5000/api/events/YOUR_EVENT_ID/upload \
  -F "images=@/path/to/image.jpg"

# Upload video
curl -X POST \
  http://localhost:5000/api/events/YOUR_EVENT_ID/upload \
  -F "videos=@/path/to/video.mp4"

# Get media
curl http://localhost:5000/api/events/YOUR_EVENT_ID/media

# Delete media
curl -X DELETE \
  http://localhost:5000/api/events/YOUR_EVENT_ID/media/images/0
```

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/events/:id/upload"
**Solution:** Make sure the media routes are imported in `eventRoutes.js`

### Issue: "File size exceeds limit"
**Solution:** 
- Images must be < 10MB
- Videos must be < 50MB
- Change limits in `backend/config/multer.js` if needed

### Issue: "Invalid image type"
**Solution:** Only JPG, PNG, JPEG are allowed. Make sure file extension matches content.

### Issue: Uploaded files are not accessible
**Solution:** Verify:
1. Files exist in `backend/uploads/` folder
2. Server is running
3. Try URL: `http://localhost:5000/uploads/images/filename.jpg`

### Issue: "Event not found"
**Solution:** Make sure the event ID in the URL is correct and exists in the database

---

## 📊 Database Schema Update

The Event model now includes:

```javascript
{
  ...previousFields,
  images: [String],      // Array of image file paths
  videos: [String],      // Array of video file paths
}
```

**Example Event Document:**
```json
{
  "_id": "650f1a2b3c4d5e6f7g8h9i0j",
  "title": "Tech Fest 2024",
  "description": "Annual tech fest",
  "date": "2024-06-15",
  "images": [
    "/uploads/images/photo1.jpg",
    "/uploads/images/photo2.png"
  ],
  "videos": [
    "/uploads/videos/promo.mp4",
    "/uploads/videos/highlight.webm"
  ],
  "createdAt": "2024-03-25T10:30:00Z"
}
```

---

## 🔒 Security Considerations

The current implementation is **beginner-friendly without authentication**. For production, consider:

1. **Add authentication** - Only authenticated users can upload
2. **Add authorization** - Only event creators can upload to their events
3. **Virus scanning** - Scan uploaded files for malware
4. **Rate limiting** - Prevent abuse with upload limits per user
5. **Cloud storage** - Use AWS S3 or similar for production
6. **File validation** - Use file-type library for deeper validation

---

## 📚 Additional Resources

- **Multer Documentation:** https://github.com/expressjs/multer
- **Express Static Files:** https://expressjs.com/en/starter/static-files.html
- **MongoDB File References:** https://docs.mongodb.com/manual/

---

## ✅ Implementation Checklist

- [x] Multer installed
- [x] Upload folders created
- [x] Event model updated
- [x] Multer config created
- [x] Media controller created
- [x] Media routes created
- [x] Event routes updated
- [x] Server.js updated with static serving
- [x] Frontend component created
- [x] API documentation provided
- [x] Error handling implemented

---

## 🎯 Next Steps

1. **Test the API** using the examples above
2. **Integrate EventMediaUpload** component into your event detail page
3. **Create an event gallery** page showing all media
4. **Add thumbnail generation** for images (optional)
5. **Add video streaming** optimization (optional)
6. **Implement authentication** (for production)

---

## ❓ Questions?

All API endpoints are documented in `MEDIA_API_DOCUMENTATION.js` with detailed examples.

Enjoy your enhanced event management system! 🎉
