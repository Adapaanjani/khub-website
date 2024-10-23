// achievementsRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Achievement = require('../models/achivements');

// POST route to add a new achievement with manual file upload
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageBuffer = req.file.buffer.toString('base64'); // Assuming you store image as base64 string

    // Create a new achievement
    const newAchievement = new Achievement({
      title,
      image: imageBuffer, // Store image as base64 string
      description,
    });

    // Save the achievement to the database
    const savedAchievement = await newAchievement.save();

    res.status(201).json(savedAchievement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET route to fetch all achievements
router.get('/', async (req, res) => {
    try {
      const achievements = await Achievement.find().sort({ createdAt: -1 });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });







  router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
  
    try {
      // Find the existing achievement
      const achievement = await Achievement.findById(id);
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
  
      // Update the fields
      achievement.title = title;
      achievement.description = description;
  
      // Update the image if a new one is provided
      if (req.file) {
        achievement.image = req.file.buffer.toString('base64');
      }
  
      // Save the updated achievement
      const updatedAchievement = await achievement.save();
  
      res.json({ message: 'Achievement updated successfully', updatedAchievement });
    } catch (error) {
      console.error('Error updating achievement:', error);
      res.status(500).json({ error: 'Server error, failed to update achievement' });
    }
  });
  
  
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete achievement from the database
      const deletedAchievement = await Achievement.findByIdAndDelete(id);
  
      if (!deletedAchievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
  
      res.json({ message: 'Achievement deleted successfully', deletedAchievement });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      res.status(500).json({ error: 'Server error, failed to delete achievement' });
    }
  });

module.exports = router;
