const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// MongoDB optional connection (graceful fallback to store.json)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 2000
  })
  .then(() => console.log(' Connected to MongoDB successfully'))
  .catch((err) => {
    console.log(' Notice: MongoDB local connection skipped (using built-in persistent JSON store).');
  });
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/footer', require('./routes/footerRoutes'));
app.use('/api/reset', require('./routes/resetRoutes'));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Portfolio Backend API is running',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/home',
      '/api/about',
      '/api/stats',
      '/api/skills',
      '/api/projects',
      '/api/experiences',
      '/api/contact',
      '/api/footer'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
