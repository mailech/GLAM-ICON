require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Middleware
app.use(cookieParser());
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Glam Icon Events API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR 💥:', err);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack
  });
});

// For Vercel, we export the app
module.exports = app;

// Only listen if executed directly (not when imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
