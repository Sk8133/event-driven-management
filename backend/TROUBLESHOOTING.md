═══════════════════════════════════════════════════════════════════════════════
                   MEDIA UPLOAD FEATURE - TROUBLESHOOTING GUIDE
═══════════════════════════════════════════════════════════════════════════════

🔧 COMMON ISSUES & SOLUTIONS

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #1: Backend won't start / Port 5000 already in use

🔍 DIAGNOSIS:
  Error: "Error: listen EADDRINUSE: address already in use :::5000"

✅ SOLUTION:
  
  Windows (PowerShell):
  ──────────────────
  # Find what's using port 5000
  netstat -ano | findstr :5000
  
  # Kill the process (replace PID with actual number)
  taskkill /PID 6044 /F
  
  # Restart backend
  cd backend
  npm start

  Mac/Linux:
  ─────────
  # Find what's using port 5000
  lsof -i :5000
  
  # Kill the process
  kill -9 <PID>
  
  # Restart backend
  npm start

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #2: Upload folder not created

🔍 DIAGNOSIS:
  Files: backend/uploads/ directory doesn't exist
  Error: "ENOENT: no such file or directory"

✅ SOLUTION:

  Option 1: Automatic (npm start)
  ──────────────────────────────
  • Multer.js automatically creates folders
  • Just run: npm start
  • Folders created: backend/uploads/images/ and backend/uploads/videos/

  Option 2: Manual Creation
  ─────────────────────────
  # In backend folder
  mkdir -p uploads/images
  mkdir -p uploads/videos
  
  # Create .gitignore (prevent committing large files)
  echo "*" > uploads/.gitignore

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #3: "Cannot find module 'multer'"

🔍 DIAGNOSIS:
  Error: "Error: Cannot find module 'multer'"
  Multer not installed

✅ SOLUTION:

  Install Multer:
  ──────────────
  cd backend
  npm install multer
  
  Verify Installation:
  ────────────────────
  # Check package.json shows: "multer": "^1.4.5"
  cat package.json | grep multer
  
  # List node_modules
  npm list multer

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #4: Files upload but can't access them

🔍 DIAGNOSIS:
  Error: 404 when accessing http://localhost:5000/uploads/images/file.jpg
  Files exist in backend/uploads/ but not accessible

✅ SOLUTION:

  Verify server.js has static file serving:
  ───────────────────────────────────────────
  1. Open backend/server.js
  2. Look for line containing: app.use('/uploads', express.static(...))
  3. Should say: app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
  
  If missing, add it (after app.use(express.json())):
  ──────────────────────────────────────────────────
  import path from 'path';
  import { fileURLToPath } from 'url';
  
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // After cors and bodyParser middleware:
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  Then restart:
  ─────────────
  npm start

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #5: Upload fails with file type error

🔍 DIAGNOSIS:
  Error: "Only .jpeg, .jpg and .png files are allowed"
  Even though uploading correct file type

✅ SOLUTION:

  1. Verify correct file type:
     – Images: .jpg, .jpeg, .png (JPEG, PNG MIME types)
     – Videos: .mp4, .mkv, .webm (MP4, MKV, WebM MIME types)
  
  2. Check browser doesn't block:
     – Open DevTools (F12)
     – Check Network tab for actual error
     – Check Console for stack trace
  
  3. Check server logs:
     – Look at terminal running "npm start"
     – See what error multer reports
  
  4. Verify multer configuration:
     – Open backend/config/multer.js
     – Check imageFilter and videoFilter functions
     – Verify MIME types match your files
  
  5. Try adding bypass (debug only):
     – Edit mediaController.js uploadEventMedia()
     – Add: console.log('Files:', req.files);
     – Check what multer receives

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #6: File size limit error

🔍 DIAGNOSIS:
  Error: "File too large" or "LIMIT_FILE_SIZE"
  File exceeds maximum allowed size

✅ SOLUTION:

  Current Limits:
  ───────────────
  • Images: 10MB max per file
  • Videos: 50MB max per file

  To increase limits:
  ──────────────────
  1. Edit backend/config/multer.js
  2. Find:
     storage: imageStorage,
     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  
  3. Change to desired size:
     limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  
  4. Save and restart:
     npm start

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #7: React component not found / Import error

🔍 DIAGNOSIS:
  Error: "Cannot find module '../components/EventMediaUpload'"
  Component not in right location

✅ SOLUTION:

  Verify file location:
  ────────────────────
  File must be at: frontend/src/components/EventMediaUpload.jsx
  
  Check it exists:
  ────────────────
  # Windows
  dir frontend\src\components\EventMediaUpload.jsx
  
  # Mac/Linux
  ls -la frontend/src/components/EventMediaUpload.jsx
  
  If missing, copy from documentation:
  ─────────────────────────────────────
  See QUICK_START.md or MEDIA_SETUP_README.md
  Copy full component code to EventMediaUpload.jsx

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #8: Images/videos not showing up in component

🔍 DIAGNOSIS:
  Component renders but shows empty media lists
  Files uploaded but not displaying

✅ SOLUTION:

  1. Check EventMediaUpload is getting eventId:
     ───────────────────────────────────────────
     <EventMediaUpload 
       eventId="YOUR_EVENT_ID"  ← Make sure this is provided
       eventTitle="Event Name"
     />

  2. Check files exist in database:
     ──────────────────────────────
     # MongoDB check
     db.events.findOne({ _id: ObjectId("YOUR_EVENT_ID") })
     
     Should show:
     {
       title: "...",
       images: ["/uploads/images/..."],
       videos: ["/uploads/videos/..."]
     }

  3. Check API call succeeds:
     ────────────────────────
     # Open browser DevTools (F12)
     # Go to Network tab
     # Try to upload a file
     # Check POST /api/events/:id/upload returns 200
     # Check GET /api/events/:id/media returns media arrays

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #9: Files upload but database not updated

🔍 DIAGNOSIS:
  Upload succeeds (files in backend/uploads/)
  But Event document doesn't have file paths
  GET /api/events/:id/media returns empty arrays

✅ SOLUTION:

  Check mediaController.js:
  ────────────────────────
  uploadEventMedia function should:
  1. Save files to disk ✓
  2. Get file paths ✓
  3. Update Event document with paths ← CHECK THIS

  Verify this code exists in uploadEventMedia():
  ──────────────────────────────────────────────
  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      $push: {
        images: imagePaths,
        videos: videoPaths
      }
    },
    { new: true }
  );

  If missing:
  ──────────
  Add it after files are saved to disk
  Make sure event is updated before response

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #10: Can upload but can't delete files

🔍 DIAGNOSIS:
  DELETE button exists but doesn't work
  Error: "Cannot delete media"
  Files remain in uploads folder

✅ SOLUTION:

  Check delete endpoint works:
  ────────────────────────────
  # Test with curl (replace values)
  curl -X DELETE http://localhost:5000/api/events/650f1a2b3c4d5e6f7g8h9i0j/media/images/0
  
  Should return success message

  Check deleteEventMedia() in controller:
  ─────────────────────────────────────────
  Should:
  1. Get event by ID
  2. Remove file from filesystem
  3. Remove path from images/videos array
  4. Save event
  5. Return success response

  Verify event actually has that index:
  ──────────────────────────────────────
  images array: [path0, path1, path2]
  Delete index:  0 = path0, 1 = path1, 2 = path2

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #11: Getting CORS errors

🔍 DIAGNOSIS:
  Error: "Access to XMLHttpRequest blocked by CORS policy"
  Frontend can't reach backend API

✅ SOLUTION:

  Verify CORS enabled in server.js:
  ──────────────────────────────────
  // Should have this near top:
  import cors from 'cors';
  app.use(cors());

  Or enable specific origins:
  ───────────────────────────
  app.use(cors({
    origin: 'http://localhost:5173',  // Your React dev server
    credentials: true
  }));

  Check frontend API URL:
  ──────────────────────
  frontend/src/services/api.js should have:
  const API_URL = 'http://localhost:5000/api';
  
  Not: 'localhost:5000' (needs http://)

═══════════════════════════════════════════════════════════════════════════════

❌ ISSUE #12: MongoDB not connected

🔍 DIAGNOSIS:
  Error: "MongooseError: Cannot connect to MongoDB"
  Backend starts but can't connect to database

✅ SOLUTION:

  Verify MongoDB is running:
  ─────────────────────────
  Windows:
    mongod.exe (start MongoDB service)
  
  Mac:
    brew services start mongodb-community
  
  Linux:
    sudo systemctl start mongod

  Check connection string:
  ───────────────────────
  backend/config/db.js should connect to localhost:27017
  Or use MongoDB Atlas connection string

  Verify connection string:
  ────────────────────────
  Open backend/config/db.js
  Check: mongoose.connect('mongodb://localhost:27017/eventmgmt')

═══════════════════════════════════════════════════════════════════════════════

🔍 DIAGNOSTIC CHECKLIST

Run this to verify everything is set up:

□ Backend running?
  npm start (in backend folder)
  Look for: "Server running on http://localhost:5000"

□ Multer installed?
  npm list multer | grep multer
  Should show: multer@1.4.5

□ Upload folders exist?
  Windows: dir backend\uploads\images
  Mac/Linux: ls -la backend/uploads/images/

□ Config file exists?
  Windows: type backend\config\multer.js
  Mac/Linux: cat backend/config/multer.js

□ Controller file exists?
  Windows: type backend\controllers\mediaController.js
  Mac/Linux: cat backend/controllers/mediaController.js

□ Routes imported?
  Look in backend/routes/eventRoutes.js
  Should have: import mediaRoutes from './mediaRoutes.js'
  Should have: router.use('/:id', mediaRoutes)

□ Static serving enabled?
  Look in backend/server.js
  Should have: app.use('/uploads', express.static(...))

□ MongoDB connected?
  Check terminal running npm start
  Should show: "MongoDB connected"

□ React component exists?
  frontend/src/components/EventMediaUpload.jsx

═══════════════════════════════════════════════════════════════════════════════

💡 DEBUG MODE

To see detailed logs:

1. Edit backend/controllers/mediaController.js
2. Add at start of each function:
   console.log('Function called with:', { eventId, files: req.files });

3. Edit backend/config/multer.js
4. Add in filters:
   console.log('File validation:', { filename: file.originalname, mimetype: file.mimetype });

5. Restart backend:
   npm start

6. Try uploading and watch terminal for detailed logs

═══════════════════════════════════════════════════════════════════════════════

📞 GETTING HELP

If still stuck:

1. Check QUICK_START.md for quick solutions
2. Review MEDIA_SETUP_README.md for detailed setup
3. Check MEDIA_API_DOCUMENTATION.js for API details
4. Search IMPLEMENTATION_SUMMARY.md for concepts
5. Enable debug mode (see above) and watch console logs
6. Verify all files exist:
   - backend/config/multer.js
   - backend/controllers/mediaController.js
   - backend/routes/mediaRoutes.js
   - frontend/src/components/EventMediaUpload.jsx

═══════════════════════════════════════════════════════════════════════════════

✅ QUICK TEST

To verify system is working:

1. Backend running?
   npm start (already running from earlier)

2. Can access homepage?
   http://localhost:5000/

3. Can access API?
   http://localhost:5000/api/events/

4. Upload folder accessible?
   http://localhost:5000/uploads/

5. Component working?
   Add EventMediaUpload to a page and upload a test file

═══════════════════════════════════════════════════════════════════════════════

If all else fails, restart everything:

# Stop backend (Ctrl+C in terminal)
# Kill other processes
  Windows PowerShell: Get-Process node | Stop-Process -Force
  Mac/Linux: killall node

# Clear node_modules and reinstall (if issues don't resolve)
  cd backend
  rm -r node_modules
  npm install
  npm start

# Fresh frontend if needed
  cd ../frontend
  npm install

═══════════════════════════════════════════════════════════════════════════════

Good luck! You've got this! 🚀

═══════════════════════════════════════════════════════════════════════════════
