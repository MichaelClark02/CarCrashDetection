const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Serve the static HTML file
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
