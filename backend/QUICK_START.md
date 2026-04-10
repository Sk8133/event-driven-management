# 🚀 Media Upload Feature - Quick Start Guide

Welcome! Your Event Manager now has powerful media upload capabilities. Here's how to use it in 5 minutes!

---

## ⚡ 5-Minute Quick Start

### Step 1: Backend is Ready ✅
Your backend server is already configured. It will:
- Accept images (JPG, PNG) up to 10MB
- Accept videos (MP4, MKV, WebM) up to 50MB  
- Store files in `backend/uploads/` folder
- Serve files via HTTP at `/uploads/` endpoint

### Step 2: Test with Postman (Optional)
Want to test the API manually?

1. **Open Postman**
2. **Create a POST request:**
   ```
   http://localhost:5000/api/events/YOUR_EVENT_ID/upload
   ```
3. **Set to form-data and add:**
   - Key: `images` → Select an image file
   - Key: `videos` → Select a video file
4. **Click Send** ✅

Expected response:
```json
{
  "message": "Media uploaded and associated with event successfully",
  "uploadedFiles": {
    "images": ["/uploads/images/filename.jpg"],
    "videos": ["/uploads/videos/filename.mp4"]
  }
}
```

### Step 3: Use in Your React App

**In any event page, add the media upload component:**

```jsx
import EventMediaUpload from '../components/EventMediaUpload';

export default function EventDetailPage() {
  return (
    <div>
      <h1>Event Details</h1>
      
      {/* Add media upload here */}
      <EventMediaUpload
        eventId="YOUR_EVENT_ID_HERE"
        eventTitle="Your Event Name"
        onMediaUpdated={(event) => {
          console.log('Media uploaded!', event);
        }}
      />
    </div>
  );
}
```

That's it! Users can now:
- 📸 Upload images via drag & drop or file selector
- 🎬 Upload videos for event documentation
- 👁️ View all uploaded media
- 🗑️ Delete media they don't need

---

## 🎯 API Endpoints

### Upload Media
```javascript
// POST /api/events/:id/upload
fetch(`http://localhost:5000/api/events/EVENT_ID/upload`, {
  method: 'POST',
  body: formData  // Contains images and/or videos
})
```

### View Media
```javascript
// GET /api/events/:id/media
fetch(`http://localhost:5000/api/events/EVENT_ID/media`)
  .then(res => res.json())
  .then(data => {
    console.log(data.images);  // ["path/to/image.jpg", ...]
    console.log(data.videos);  // ["path/to/video.mp4", ...]
  })
```

### Delete Media
```javascript
// DELETE /api/events/:id/media/images/0
fetch(`http://localhost:5000/api/events/EVENT_ID/media/images/0`, {
  method: 'DELETE'
})
```

---

## 🖼️ Display Uploaded Files

### Show Images
```jsx
import { useEffect, useState } from 'react';

export default function EventGallery({ eventId }) {
  const [media, setMedia] = useState({ images: [], videos: [] });

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${eventId}/media`)
      .then(res => res.json())
      .then(data => setMedia(data));
  }, [eventId]);

  return (
    <div>
      {/* Images */}
      <div className="grid grid-cols-3 gap-4">
        {media.images.map((image, i) => (
          <img 
            key={i} 
            src={`http://localhost:5000${image}`} 
            alt="Event"
          />
        ))}
      </div>

      {/* Videos */}
      <div className="space-y-4">
        {media.videos.map((video, i) => (
          <video key={i} width="400" controls>
            <source src={`http://localhost:5000${video}`} />
          </video>
        ))}
      </div>
    </div>
  );
}
```

---

## 📁 File Organization

Your uploaded files are automatically organized:

```
backend/uploads/
├── images/
│   ├── photo1-1234567890.jpg
│   ├── photo2-1234567891.jpg
│   └── ...
└── videos/
    ├── promo-1234567892.mp4
    ├── highlight-1234567893.webm
    └── ...
```

Files are named with timestamps to avoid collisions.

---

## ⚙️ Configuration

### Change File Size Limits

Edit `backend/config/multer.js`:

```javascript
// Change image limit from 10MB to 50MB
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 50 * 1024 * 1024 },  // 50MB
});

// Change video limit from 50MB to 200MB
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 200 * 1024 * 1024 },  // 200MB
});
```

### Allow More File Types

Edit `backend/config/multer.js`:

```javascript
// Add GIF support to images
const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif'  // Add this line
];

// Add AVI support to videos
const allowedVideoTypes = [
  'video/mp4',
  'video/x-matroska',
  'video/webm',
  'video/x-msvideo'  // Add this line
];
```

After changes, restart backend: `npm start`

---

## 🧪 Complete Example

### Full Event Upload Page

```jsx
import React, { useState, useEffect } from 'react';
import EventMediaUpload from '../components/EventMediaUpload';

export default function EventPage({ eventId }) {
  const [event, setEvent] = useState(null);
  const [media, setMedia] = useState({ images: [], videos: [] });

  useEffect(() => {
    // Fetch event details
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEvent(data));

    // Fetch media
    fetch(`http://localhost:5000/api/events/${eventId}/media`)
      .then(res => res.json())
      .then(data => setMedia(data));
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Event Info */}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-8">{event.description}</p>

      {/* Upload Component */}
      <EventMediaUpload
        eventId={eventId}
        eventTitle={event.title}
        onMediaUpdated={() => {
          // Refresh media list after upload
          fetch(`http://localhost:5000/api/events/${eventId}/media`)
            .then(res => res.json())
            .then(data => setMedia(data));
        }}
      />

      {/* Media Gallery */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
        
        {/* Images */}
        {media.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Photos</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {media.images.map((image, i) => (
                <div key={i} className="relative">
                  <img
                    src={`http://localhost:5000${image}`}
                    alt="Event"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {media.videos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Videos</h3>
            <div className="space-y-4">
              {media.videos.map((video, i) => (
                <video
                  key={i}
                  width="100%"
                  height="400"
                  controls
                  className="rounded-lg"
                >
                  <source src={`http://localhost:5000${video}`} />
                  Your browser doesn't support HTML5 video.
                </video>
              ))}
            </div>
          </div>
        )}

        {!media.images.length && !media.videos.length && (
          <p className="text-gray-500">No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
```

---

## 🔗 Available Endpoints

All endpoints base URL: `http://localhost:5000`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/events/:id/upload` | Upload images/videos |
| GET | `/api/events/:id/media` | Get all media |
| DELETE | `/api/events/:id/media/images/:index` | Delete image |
| DELETE | `/api/events/:id/media/videos/:index` | Delete video |
| GET | `/uploads/...` | Access uploaded file |

---

## ❓ Common Questions

**Q: How do I test without a frontend?**
A: Use Postman, cURL, or Thunder Client to test endpoints directly.

**Q: What if my video is larger than 50MB?**
A: Change the limit in `backend/config/multer.js` and restart server.

**Q: Where are uploaded files stored?**
A: In `backend/uploads/images/` and `backend/uploads/videos/`

**Q: Can users access the files?**
A: Yes! They're served at `/uploads/images/filename` and `/uploads/videos/filename`

**Q: How do I delete uploaded files?**
A: Use the DELETE endpoint or the EventMediaUpload component's delete button.

---

## 🐛 Troubleshooting

### "File size exceeds limit"
```javascript
// Increase limits in backend/config/multer.js
limits: { fileSize: 100 * 1024 * 1024 }  // 100MB
```

### "Invalid image type"
Make sure file is .jpg, .jpeg, or .png

### "Event not found"
Check that event ID is correct and exists in database

### Files not accessible
Ensure server is running and port 5000 is correct

---

## 📚 Need More Info?

- **Full API Docs:** See `MEDIA_API_DOCUMENTATION.js`
- **Setup Guide:** See `MEDIA_SETUP_README.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

---

## ✅ You're All Set!

Your media upload system is ready to use. Start uploading! 🎉

**Questions?** Check the detailed guides in your backend folder.

Happy coding! 🚀
