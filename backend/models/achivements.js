// achievementsModel.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming you store the image path or URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
