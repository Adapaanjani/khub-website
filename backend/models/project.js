const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  batchNumber: { type: String, required: true },
  teamNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  githubLink: { type: String, required: true },
  developer: { type: String, required: true },
  previewImage: { type: Buffer },
  previewImageType: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
