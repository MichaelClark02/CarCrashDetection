const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Serve the static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded videos to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const videoName = `${Date.now()}-${file.originalname}`;
    cb(null, videoName);
  },
});
const upload = multer({ storage });

// Route for uploading videos
app.post('/upload', upload.single('video'), (req, res) => {
  res.json({ message: 'Video uploaded successfully' });
});

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for watching videos
app.get('/watch/:videoFilename', (req, res) => {
  const videoFilename = req.params.videoFilename;
  res.sendFile(path.join(__dirname, 'public', 'watch.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
