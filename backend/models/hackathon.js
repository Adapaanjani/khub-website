const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  technology: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  teams: [{
    projectName: { 
      type: String, 
      required: true 
    },
    members: [{ 
      name: { 
        type: String, 
        required: true 
      } 
    }],
    githubLink: { 
      type: String, 
      required: true 
    },
    teamPhoto: { 
      data: Buffer,
      contentType: String
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', HackathonSchema);