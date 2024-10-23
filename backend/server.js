const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const batchRoutes = require('./routes/batchroutes');
const eventRoutes = require('./routes/eventroutes');
const hackathonRoutes = require('./routes/hackathonroutes');
const projectRoutes = require('./routes/project');
const achivementsRoutes = require('./routes/achivements');
const newsRoutes = require('./routes/newss');
const adminRoutes = require('./routes/adminroutes');
const contactRoutes = require('./routes/contactroutes');
const posterRoutes=require('./routes/posterroutes')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Connect to MongoDB
const mongoDBUri = 'mongodb+srv://pavan:21b21a4367@cluster0.2hy3uul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Use routes
app.use(batchRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use(newsRoutes);
app.use('/api/achievements', achivementsRoutes);
app.use('/api', adminRoutes);
app.use('/api', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});