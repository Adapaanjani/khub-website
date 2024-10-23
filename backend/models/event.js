const mongoose = require('mongoose');

const subEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: Buffer
    }
  ]
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mainPic: {
    type: Buffer,
    required: true
  },
  subEvents: [subEventSchema]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
