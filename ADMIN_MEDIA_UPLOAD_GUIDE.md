═══════════════════════════════════════════════════════════════════════════════
           ADMIN MEDIA UPLOAD FEATURE - QUICK GUIDE
═══════════════════════════════════════════════════════════════════════════════

🎬 NEW FEATURE: Upload Videos & Photos to Events

Admins can now easily add photos and videos to events directly from the 
Admin Dashboard!

═══════════════════════════════════════════════════════════════════════════════

📋 HOW TO USE

Step 1: Open Admin Dashboard
├── Login with admin credentials
└── Navigate to Admin Dashboard

Step 2: Click "Upload Media" Button
├── Location: Top of the dashboard with other action buttons
├── Button Color: Purple gradient
└── Positioning: Right side of "Create Event" and "Assign Task" buttons

Step 3: Select an Event
├── You'll see all your events displayed as cards
├── Each card shows:
│   • Event Title
│   • Event Description
│   • Location & Date
└── Click on the event you want to upload media for

Step 4: Upload Photos & Videos
├── IMAGES:
│   • Drag & drop images (JPG, PNG) or click to select
│   • Max size: 10MB per image
│   • Can upload multiple images at once
│
└── VIDEOS:
    • Drag & drop videos (MP4, MKV, WebM) or click to select
    • Max size: 50MB per video
    • Can upload multiple videos at once

Step 5: Preview & Upload
├── Selected files appear in a preview list
├── Review your selections
├── Click "Upload" to save to the event
└── Success message will appear when complete

Step 6: Manage Existing Media
├── View all uploaded images & videos
├── Hover over any image to see delete button
├── Delete unwanted media anytime
└── Changes save immediately

═══════════════════════════════════════════════════════════════════════════════

💡 TIPS & BEST PRACTICES

✓ Multiple Files: Upload many photos/videos at once
✓ Different Formats: Mix JPG, PNG for images and MP4, WebM for videos
✓ Drag & Drop: Easier than clicking - just drag files
✓ Preview: Check files before uploading
✓ Organization: Add photos before events to showcase them

⚠ IMPORTANT:

  • Supported Image Formats: JPG, JPEG, PNG
  • Supported Video Formats: MP4, MKV, WebM
  • Max Image Size: 10MB each
  • Max Video Size: 50MB each
  • Images Max: 10 images per upload
  • Videos Max: 5 videos per upload

═══════════════════════════════════════════════════════════════════════════════

🎯 WORKFLOW EXAMPLE

Scenario: Organizing "Tech Fest 2026" Event

1. Admin creates event:
   └── Click "Create Event" → Fill event details → Save

2. Admin uploads promotional materials:
   └── Click "Upload Media" → Select "Tech Fest 2026" → Add 3 posters

3. Admin assigns tasks to students:
   └── Click "Assign Task" → Select event → Create task

4. During event:
   └── Upload live photos & videos as event happens
   └── Real-time media updates visible to all

5. After event:
   └── Upload final event photos & highlights
   └── Create event album for future reference

═══════════════════════════════════════════════════════════════════════════════

🚀 BUTTON LOCATION

Admin Dashboard Layout:

┌─────────────────────────────────────────┐
│ ADMIN DASHBOARD HEADER                  │
└─────────────────────────────────────────┘

┌──────────────────┐
│ Create Event     │  (Blue) - Create new event
└──────────────────┘
   ↓
┌──────────────────┐
│ Assign Task      │  (Green) - Assign tasks to students
└──────────────────┘
   ↓
┌──────────────────┐
│ Upload Media     │  (Purple) - Upload photos & videos ⭐ NEW
└──────────────────┘

═══════════════════════════════════════════════════════════════════════════════

❓ FREQUENTLY ASKED QUESTIONS

Q: Can I upload media without creating an event first?
A: No, you must create an event first. Click "Create Event" first.

Q: How many files can I upload at once?
A: Up to 10 images and 5 videos per upload session.

Q: What if my file is too large?
A: You'll see an error message. Compress or reduce file size:
   • Images: Use image compression tools (under 10MB)
   • Videos: Use video conversion tools (under 50MB)

Q: Can I delete media after uploading?
A: Yes! Click the delete button (X) that appears when hovering over media.

Q: Can I upload media from mobile?
A: Yes, the interface is mobile-responsive.

Q: Where are the uploaded files stored?
A: On the server in backend/uploads/ folder
   • Images: backend/uploads/images/
   • Videos: backend/uploads/videos/

Q: Can students see the uploaded media?
A: Yes, students can view event details including photos and videos.

Q: What happens if I delete an event?
A: Media associated with the event needs to be managed separately.

═══════════════════════════════════════════════════════════════════════════════

🎨 INTERFACE DETAILS

Upload Form Sections:
──────────────────

1. Event Selection Panel
   ├── Shows all available events
   ├── Click to select event
   └── Shows event title, description, location, date

2. Images Upload Section (Blue theme)
   ├── Drag & drop area
   ├── Selected files list
   ├── Existing images gallery
   └── Delete buttons (on hover)

3. Videos Upload Section (Purple theme)
   ├── Drag & drop area
   ├── Selected files list
   ├── Existing videos list
   └── Delete buttons (on hover)

4. Action Buttons
   ├── Upload - Save all selected files
   ├── Remove file - Remove from selection (before upload)
   └── Delete - Remove from event (after upload)

═══════════════════════════════════════════════════════════════════════════════

⚙️ TECHNICAL DETAILS (For Reference)

API Endpoints Used:
──────────────────

1. Upload Media
   POST /api/events/:eventId/upload
   Body: FormData with images & videos

2. Get Event Media
   GET /api/events/:eventId/media
   Response: List of images & videos

3. Delete Media
   DELETE /api/events/:eventId/media/:type/:index
   Params: type="images" or "videos", index=0-based

Files in Repository:
───────────────────

Frontend:
├── frontend/src/components/EventMediaUpload.jsx (Component)
└── frontend/src/pages/AdminDashboard.jsx (Updated)

Backend:
├── backend/config/multer.js (Upload config)
├── backend/controllers/mediaController.js (Upload logic)
├── backend/routes/mediaRoutes.js (API routes)
└── backend/models/Event.js (Database schema)

═══════════════════════════════════════════════════════════════════════════════

📞 TROUBLESHOOTING

Problem: Upload button doesn't appear
Solution: Refresh page, ensure you're in Admin Dashboard

Problem: Can't upload certain file formats
Solution: Check supported formats:
  Images: JPG, JPEG, PNG only
  Videos: MP4, MKV, WebM only

Problem: File size error when uploading
Solution: Reduce file size below 10MB (images) or 50MB (videos)

Problem: Media not showing after upload
Solution: Try refreshing the page or clearing browser cache

Problem: Can't delete media
Solution: Check browser console for errors, ensure event is loaded

═══════════════════════════════════════════════════════════════════════════════

✨ FEATURES BREAKDOWN

✓ Drag & Drop Upload
  └── Easy file selection without clicking

✓ Multiple File Upload
  └── Upload many files in single action

✓ File Validation
  └── Automatic format & size checking

✓ Instant Preview
  └── See selected files before uploading

✓ Media Gallery
  └── View all uploaded media
  └── See image thumbnails
  └── Link to video files

✓ Easy Deletion
  └── Delete individual files anytime
  └── Hover to see delete button

✓ Success/Error Feedback
  └── Clear messages on completion
  └── Error descriptions for issues

═══════════════════════════════════════════════════════════════════════════════

🎯 NEXT STEPS

1. Login as admin
2. Navigate to Admin Dashboard
3. Create an event (if you haven't already)
4. Click "Upload Media" button
5. Select an event
6. Upload some photos and videos
7. Verify files appear in "Existing Media" section
8. Try deleting a file
9. Check that uploads work!

═══════════════════════════════════════════════════════════════════════════════

Need Help?

Refer to:
├── QUICK_START.md - Quick reference guide
├── MEDIA_SETUP_README.md - Detailed setup guide
├── TROUBLESHOOTING.md - Problem solutions
└── MEDIA_API_DOCUMENTATION.js - Technical API details

═══════════════════════════════════════════════════════════════════════════════

Happy uploading! 🚀📸🎥

═══════════════════════════════════════════════════════════════════════════════
