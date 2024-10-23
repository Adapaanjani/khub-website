const express = require('express');
const router = express.Router();
const multer = require('multer');
const News = require('../models/news');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/news', upload.single('image'), async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);

    if (!req.body.items) {
      return res.status(400).json({ message: 'No items data received' });
    }

    let items;
    try {
      items = JSON.parse(req.body.items);
    } catch (parseError) {
      console.error('Error parsing items:', parseError);
      return res.status(400).json({ message: 'Invalid items data', error: parseError.toString() });
    }

    console.log('Parsed items:', items);
    
    if (req.file) {
      const imageIndex = items.findIndex(item => item.value === 'IMAGE_PLACEHOLDER');
      if (imageIndex !== -1) {
        const base64Image = req.file.buffer.toString('base64');
        items[imageIndex].value = `data:${req.file.mimetype};base64,${base64Image}`;
      }
    }

    const news = new News({ items });
    await news.save();

    res.status(201).json({ message: 'News items saved successfully', news });
  } catch (error) {
    console.error('Error saving news items:', error);
    res.status(500).json({ message: 'Failed to save news items', error: error.toString() });
  }
});

// In your newsRoutes.js file

router.get('/api/news', async (req, res) => {
  try {
    const allNews = await News.find().sort({ createdAt: -1 });
    res.status(200).json(allNews);
  } catch (error) {
    console.error('Error retrieving news items:', error);
    res.status(500).json({ message: 'Failed to retrieve news items' });
  }
});


router.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error('Error retrieving news item:', error);
    res.status(500).json({ message: 'Failed to retrieve news item' });
  }
});





// Updated route to update news
router.put('/api/news/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);

    let updatedItems;
    if (typeof req.body.items === 'string') {
      try {
        updatedItems = JSON.parse(req.body.items);
      } catch (parseError) {
        console.error('Error parsing items:', parseError);
        return res.status(400).json({ message: 'Invalid items data', error: parseError.toString() });
      }
    } else if (Array.isArray(req.body.items)) {
      updatedItems = req.body.items;
    } else {
      return res.status(400).json({ message: 'Invalid items data format' });
    }

    console.log('Parsed items:', updatedItems);

    if (req.file) {
      const imageIndex = updatedItems.findIndex(item => item.type === 'image');
      if (imageIndex !== -1) {
        const base64Image = req.file.buffer.toString('base64');
        updatedItems[imageIndex].value = `data:${req.file.mimetype};base64,${base64Image}`;
      }
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { items: updatedItems },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: 'News item not found' });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error updating news item:', error);
    res.status(500).json({ message: 'Failed to update news item', error: error.toString() });
  }
});

// New route to delete news
router.delete('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: 'News item not found' });
    }

    res.status(200).json({ message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    res.status(500).json({ message: 'Failed to delete news item', error: error.toString() });
  }
});

module.exports = router;