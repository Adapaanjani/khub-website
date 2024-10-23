const mongoose = require('mongoose');

// Define schemas
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  subteam: { type: String, required: true },
  git: String,
  linkedin: String,
  image: { type: String, required: true },  // Will store the base64 string
});

const TeamSchema = new mongoose.Schema({
  teamLeader: { type: MemberSchema, required: true },
  teamMentor: { type: MemberSchema, required: true },
  members: { type: [MemberSchema], validate: v => Array.isArray(v) && v.length > 0 },
});

const BatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true },
  teams: { type: [TeamSchema], validate: v => Array.isArray(v) && v.length > 0 },
});

const AlumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  subteam: { type: String, required: true },
  git: String,
  linkedin: String,
  batchNumber: { type: String, required: true },
  teamNumber: { type: Number, required: true },
  image: String,  // Store the base64 string
});

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Mentor' },
  subteam: { type: String, required: true },
  git: String,
  linkedin: String,
  batchNumber: { type: String, required: true },
  teamNumber: { type: Number, required: true },
  image: String,  // Store the base64 string
});






// Create models
const Batch = mongoose.model('Batch', BatchSchema);
const Alumni = mongoose.model('Alumni', AlumniSchema);
const Mentor = mongoose.model('Mentor', MentorSchema);
module.exports = { Batch, Alumni, Mentor };
