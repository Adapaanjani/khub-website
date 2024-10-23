const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Poster Schema
const posterSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
}, {
  timestamps: true
});

const Poster = mongoose.model('Poster', posterSchema);

// POST route to upload a new poster
router.post('/', upload.single('poster'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const newPoster = new Poster({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype
  });

  try {
    await newPoster.save();
    res.status(201).send('Poster uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading poster');
  }
});
// GET route to fetch all posters
router.get('/', async (req, res) => {
  try {
    const posters = await Poster.find().sort({ createdAt: -1 });
    const postersWithBase64 = posters.map(poster => {
      return {
        ...poster._doc,
        data: poster.data.toString('base64')
      };
    });
    res.status(200).json(postersWithBase64);
  } catch (error) {
    console.error('Error fetching posters:', error);
    res.status(500).json({ message: 'Error fetching posters', error: error.message });
  }
});


module.exports = router;