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
  origin: true, // Allow any origin temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect to MongoDB
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if no connection
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events', opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  // Skip for static files or simple health checks if needed, but safer to just connect
  if (req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Middleware Connection Error:", error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Glam Icon Events API is running');
});

// DB Test Route
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/User');
    const count = await User.countDocuments();
    res.json({ status: 'success', message: 'DB Connected', userCount: count });
  } catch (err) {
    console.error("DB TEST FAILED:", err);
    res.status(500).json({ status: 'error', message: 'DB Connection Failed: ' + err.message });
  }
});

// Create Admin Route (Temporary)
app.get('/api/create-admin', async (req, res) => {
  try {
    await connectDB();
    const User = require('./models/User');
    const email = 'admin@glamicon.io';
    let user = await User.findOne({ email });

    if (user) {
      user.password = 'password1234';
      user.role = 'admin';
      await user.save({ validateBeforeSave: false }); // Force update
      return res.json({ status: 'success', message: 'Admin Updated', email });
    }

    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);

    user = await User.create({
      name: 'Glam Admin',
      email,
      password: 'password1234',
      role: 'admin',
      isVerified: true,
      memberId: `GII-${year}-${random}`
    });

    res.json({ status: 'success', message: 'Admin Created', email });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
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
