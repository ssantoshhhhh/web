const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const seekerRoutes = require('./routes/seekerRoutes');
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());  // for parsing application/json
app.use(cors());          // for handling cross-origin requests

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Routes
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/employer', employerRoutes);   // Employer-related routes
app.use('/api/seeker', seekerRoutes);       // Seeker-related routes

// Default route (Health check)
app.get('/', (req, res) => {
  res.send('Job Board API is running');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const seekerRoutes = require('./routes/seekerRoutes');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(express.json());  // Middleware to parse application/json
app.use(cors());          // Middleware to handle cross-origin requests

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // Disable deprecated findAndModify
  useCreateIndex: true,    // Ensure indexes are created on the database
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);  // Exit process if DB connection fails
});

// Routes setup
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/employer', employerRoutes); // Employer-related routes
app.use('/api/seeker', seekerRoutes);     // Job seeker-related routes

// Default route (Health check)
app.get('/', (req, res) => {
  res.send('Job Board API is running');
});

// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

  console.log(`Server is running on port ${PORT}`);
});
