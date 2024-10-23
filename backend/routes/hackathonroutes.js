const express = require('express');
const router = express.Router();
const Hackathon = require('../models/hackathon');
const multer = require('multer');

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route to create a new hackathon
router.post('/', upload.array('teamPhotos'), async (req, res) => {
  try {
    console.log('Received POST request to /api/hackathons');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const hackathonData = JSON.parse(req.body.hackathon);
    
    // Process uploaded files
    hackathonData.teams.forEach((team, index) => {
      if (req.files[index]) {
        // Store file information in the database
        team.teamPhoto = {
          data: req.files[index].buffer,
          contentType: req.files[index].mimetype
        };
      }
    });

    const hackathon = new Hackathon(hackathonData);
    await hackathon.save();
    res.status(201).json(hackathon);
  } catch (error) {
    console.error('Error in POST /api/hackathons:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all hackathons
router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().select('-teams.teamPhoto');
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a specific hackathon by ID
router.get('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).select('-teams.teamPhoto');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a team photo
router.get('/:id/team/:teamId/photo', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const team = hackathon.teams.id(req.params.teamId);
    if (!team || !team.teamPhoto) {
      return res.status(404).json({ message: 'Team photo not found' });
    }
    res.set('Content-Type', team.teamPhoto.contentType);
    res.send(team.teamPhoto.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a hackathon
router.put('/:id', upload.array('teamPhotos'), async (req, res) => {
  try {
    const hackathonData = JSON.parse(req.body.hackathon);

    // Update team photos if new files are uploaded
    if (req.files && req.files.length > 0) {
      hackathonData.teams.forEach((team, index) => {
        if (req.files[index]) {
          team.teamPhoto = {
            data: req.files[index].buffer,
            contentType: req.files[index].mimetype
          };
        }
      });
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      hackathonData,
      { new: true }
    );

    // Convert team photos to base64
    updatedHackathon.teams.forEach(team => {
      if (team.teamPhoto && team.teamPhoto.data) {
        team.teamPhoto.data = bufferToBase64(team.teamPhoto.data);
      }
    });

    if (!updatedHackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(updatedHackathon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE route to remove a hackathon
router.delete('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;