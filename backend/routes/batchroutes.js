const express = require('express');
const multer = require('multer');
const { Batch, Alumni, Mentor } = require('../models/model');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a new batch without updating alumni and mentor collections
router.post('/api/teams/batch', upload.any(), async (req, res) => {
  try {
    const batchData = JSON.parse(req.body.data);
    console.log('Received batch data:', batchData);

    // Process file uploads
    req.files.forEach(file => {
      const [type, teamIndex, memberType, memberIndex] = file.fieldname.split('_');
      const base64Image = file.buffer.toString('base64');

      if (type === 'teamLeader') {
        batchData.teams[teamIndex].teamLeader.image = base64Image;
      } else if (type === 'teamMentor') {
        batchData.teams[teamIndex].teamMentor.image = base64Image;
      } else if (type === 'team') {
        batchData.teams[teamIndex].members[memberIndex].image = base64Image;
      }
    });

    // Save new batch
    const newBatch = new Batch(batchData);
    await newBatch.save();

    console.log('Batch saved successfully');
    res.status(201).json({ message: 'Batch added successfully', batch: newBatch });
  } catch (error) {
    console.error('Error adding batch:', error);
    res.status(500).json({ message: 'Error adding batch', error: error.message });
  }
});

router.post('/api/teams/addTeam', upload.any(), async (req, res) => {
  try {
    const teamData = JSON.parse(req.body.data);
    console.log('Received team data:', teamData);

    // Process images if any
    req.files.forEach(file => {
      const [type, memberType, memberIndex] = file.fieldname.split('_');
      const base64Image = file.buffer.toString('base64');

      if (type === 'teamLeader') {
        teamData.teamLeader.image = base64Image;
      } else if (type === 'teamMentor') {
        teamData.teamMentor.image = base64Image;
      } else if (type === 'team') {
        teamData.members[memberIndex].image = base64Image;
      }
    });

    // Find the latest batch
    const latestBatch = await Batch.findOne().sort({ _id: -1 });

    if (!latestBatch) {
      return res.status(400).json({ message: 'No batches found. Please create a batch first.' });
    }

    // Add the new team to the latest batch
    latestBatch.teams.push(teamData);
    await latestBatch.save();

    console.log('Team added successfully');
    res.status(201).json({ message: 'Team added successfully', batch: latestBatch });
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).json({ message: 'Error adding team', error: error.message });
  }
});

// Add a member to a team in the latest batch

router.post('/api/teams/:batchNumber/:teamNumber/member', upload.any(), async (req, res) => {
  try {
    const { batchNumber, teamNumber } = req.params;
    const newMember = JSON.parse(req.body.data);

    const batch = await Batch.findOne({ batchNumber });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const team = batch.teams[teamNumber - 1];
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (req.files.length > 0) {
      const file = req.files[0];
      const base64Image = file.buffer.toString('base64');
      newMember.image = base64Image;
    }

    team.members.push(newMember);
    await batch.save();

    res.status(201).json({ message: 'Member added successfully', team });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
});

// Fetch all batches
router.get('/api/batches', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ batchNumber: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching batches', error: error.message });
  }
});


// Fetch a specific batch by batchNumber
router.get('/api/batches/:batchNumber', async (req, res) => {
  try {
    const { batchNumber } = req.params;
    const batch = await Batch.findOne({ batchNumber });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Error fetching batch', error: error.message });
  }
});






// Edit a team
router.put('/api/teams/:batchNumber/:teamNumber', async (req, res) => {
  try {
    const { batchNumber, teamNumber } = req.params;
    const updatedTeam = req.body;

    const batch = await Batch.findOne({ batchNumber });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.teams[teamNumber - 1] = updatedTeam;
    await batch.save();

    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error: error.message });
  }
});

// Delete a team
router.delete('/api/teams/:batchNumber/:teamNumber', async (req, res) => {
  try {
    const { batchNumber, teamNumber } = req.params;

    const batch = await Batch.findOne({ batchNumber });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.teams.splice(teamNumber - 1, 1);
    await batch.save();

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error: error.message });
  }
});





// Delete a batch
router.delete('/api/batches/:batchNumber', async (req, res) => {
  try {
    const { batchNumber } = req.params;

    await Batch.deleteOne({ batchNumber });

    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting batch', error: error.message });
  }
});



router.delete('/api/teams/:batchNumber/:teamNumber/:memberId', async (req, res) => {
  try {
    const { batchNumber, teamNumber, memberId } = req.params;
    console.log(`Attempting to delete member ${memberId} from batch ${batchNumber}, team ${teamNumber}`);

    const batch = await Batch.findOne({ batchNumber });

    if (!batch) {
      console.log(`Batch ${batchNumber} not found`);
      return res.status(404).json({ message: 'Batch not found' });
    }

    const team = batch.teams[teamNumber - 1];

    if (!team) {
      console.log(`Team ${teamNumber} not found in batch ${batchNumber}`);
      return res.status(404).json({ message: 'Team not found' });
    }

    const initialMemberCount = team.members.length;
    team.members = team.members.filter(member => member._id.toString() !== memberId);
    const finalMemberCount = team.members.length;

    if (initialMemberCount === finalMemberCount) {
      console.log(`Member ${memberId} not found in team`);
      return res.status(404).json({ message: 'Member not found' });
    }

    await batch.save();
    console.log(`Successfully deleted member ${memberId}`);

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Error deleting team member', error: error.message });
  }
});


// Fetch team details by batchNumber and teamNumber
router.get('/api/teams/batch/:batchNumber/:teamNumber', async (req, res) => {
  const { batchNumber, teamNumber } = req.params;

  try {
    const batch = await Batch.findOne({ batchNumber });
    if (!batch) {
      return res.status(404).json({ message: `Batch ${batchNumber} not found` });
    }

    const teamIndex = teamNumber - 1;
    if (teamIndex < 0 || teamIndex >= batch.teams.length) {
      return res.status(404).json({ message: `Team ${teamNumber} not found in Batch ${batchNumber}` });
    }

    const team = batch.teams[teamIndex];
    res.json(team); // Return the complete team object
  } catch (error) {
    console.error(`Error fetching team details for Batch ${batchNumber}, Team ${teamNumber}:`, error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});






module.exports = router;
