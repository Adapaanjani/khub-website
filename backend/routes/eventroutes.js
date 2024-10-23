const express = require('express');
const multer = require('multer');
const Event = require('../models/event');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add', upload.fields([{ name: 'mainPic' }, { name: 'subEventImages' }]), async (req, res) => {
  try {
    const { name, subEvents } = req.body;

    if (!req.files['mainPic'] || req.files['mainPic'].length === 0) {
      return res.status(400).send({ error: 'Main picture is required' });
    }

    const mainPic = req.files['mainPic'][0].buffer;
    
    let parsedSubEvents;
    try {
      parsedSubEvents = JSON.parse(subEvents);
    } catch (error) {
      return res.status(400).send({ error: 'Invalid subEvents data' });
    }

    let totalImagesProcessed = 0;
    const processedSubEvents = parsedSubEvents.map((subEvent) => {
      const startIndex = totalImagesProcessed;
      const endIndex = totalImagesProcessed + subEvent.imageCount;
      
      const images = req.files['subEventImages']
        ? req.files['subEventImages']
            .slice(startIndex, endIndex)
            .map(file => file.buffer)
        : [];

      totalImagesProcessed += subEvent.imageCount;

      return {
        name: subEvent.name,
        description: subEvent.description,
        images
      };
    });

    const event = new Event({
      name,
      mainPic,
      subEvents: processedSubEvents
    });

    await event.save();
    res.status(201).send(event);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(400).send({ error: error.message });
  }
});
// Add this to your eventRoutes.js
router.get('/', async (req, res) => {
    try {
      const events = await Event.find();
      res.send(events);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  // Add this to your eventRoutes.js
router.get('/:id', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).send({ error: 'Event not found' });
      }
      res.send(event);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  


  router.put('/:id', upload.single('mainPic'), async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      if (req.body.name) event.name = req.body.name;
      if (req.body.subEvents) event.subEvents = JSON.parse(req.body.subEvents);
      if (req.file) {
        event.mainPic = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }
  
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json({ message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/:id/mainPic', upload.single('image'), async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      if (req.file) {
        event.mainPic = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }
  
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.delete('/:id/mainPic', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      event.mainPic = undefined;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.put('/:id/subevents/:subEventIndex/images/:imageIndex', upload.single('image'), async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      const subEventIndex = parseInt(req.params.subEventIndex);
      const imageIndex = parseInt(req.params.imageIndex);
  
      if (!event.subEvents[subEventIndex]) {
        return res.status(404).json({ message: 'Sub-event not found' });
      }
  
      if (!event.subEvents[subEventIndex].images) {
        event.subEvents[subEventIndex].images = [];
      }
  
      if (req.file) {
        event.subEvents[subEventIndex].images[imageIndex] = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }
  
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating sub-event image:', error);
      res.status(400).json({ message: error.message });
    }
  });
  
  router.delete('/:id/subevents/:subEventIndex/images/:imageIndex', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      const subEventIndex = parseInt(req.params.subEventIndex);
      const imageIndex = parseInt(req.params.imageIndex);
  
      if (!event.subEvents[subEventIndex]) {
        return res.status(404).json({ message: 'Sub-event not found' });
      }
  
      if (event.subEvents[subEventIndex].images) {
        event.subEvents[subEventIndex].images.splice(imageIndex, 1);
      }
  
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
module.exports = router;
