const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const multer = require('multer');

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new project
router.post('/add', upload.single('previewImage'), async (req, res) => {
  try {
    const { batchNumber, teamNumber, name, description, githubLink, developer } = req.body;
    const previewImage = req.file ? req.file.buffer : null;
    const previewImageType = req.file ? req.file.mimetype : null;

    const newProject = new Project({
      batchNumber,
      teamNumber,
      name,
      description,
      githubLink,
      developer,
      previewImage,
      previewImageType
    });

    await newProject.save();
    res.status(201).send('Project added successfully');
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project', details: error.message });
  }
});

// Route to fetch projects based on batchNumber and teamNumber
router.get('/', async (req, res) => {
  const { batchNumber, teamNumber } = req.query;

  try {
    let query = {};

    if (batchNumber) {
      query.batchNumber = batchNumber;
    }

    if (teamNumber) {
      query.teamNumber = teamNumber;
    }

    const projects = await Project.find(query);

    const projectsWithImages = projects.map(project => {
      if (project.previewImage && project.previewImageType) {
        return {
          ...project.toObject(),
          previewImage: project.previewImage.toString('base64')
        };
      } else {
        return project;
      }
    });

    res.json(projectsWithImages);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('Failed to fetch projects');
  }
});
// Route to fetch all distinct batch numbers
router.get('/batch-numbers', async (req, res) => {
  try {
    const batchNumbers = await Project.distinct('batchNumber');
    res.json(batchNumbers);
  } catch (error) {
    console.error('Error fetching batch numbers:', error);
    res.status(500).send('Failed to fetch batch numbers');
  }
});

// Route to fetch all distinct team numbers
router.get('/team-numbers', async (req, res) => {
  try {
    const teamNumbers = await Project.distinct('teamNumber');
    res.json(teamNumbers);
  } catch (error) {
    console.error('Error fetching team numbers:', error);
    res.status(500).send('Failed to fetch team numbers');
  }
});




// Route to update a project
router.put('/:id', upload.single('previewImage'), async (req, res) => {
  try {
    const { batchNumber, teamNumber, name, description, githubLink, developer } = req.body;
    const previewImage = req.file ? req.file.buffer : null;
    const previewImageType = req.file ? req.file.mimetype : null;

    const updateData = {
      batchNumber,
      teamNumber,
      name,
      description,
      githubLink,
      developer
    };

    if (previewImage && previewImageType) {
      updateData.previewImage = previewImage;
      updateData.previewImageType = previewImageType;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
});

// Route to delete a project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).send('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

module.exports = router;
