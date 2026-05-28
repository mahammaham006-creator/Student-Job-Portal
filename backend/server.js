const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Handle CORS preflight for ALL routes first — before anything else
app.options('*', cors());

// CORS — allow any vercel.app subdomain + localhost
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:3000' ||
      origin === process.env.CLIENT_URL
    ) {
      return callback(null, true);
    }
    return callback(null, true); // allow all for now during development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection — cached for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGO_URI environment variable is not set');
  await mongoose.connect(uri);
  isConnected = true;
};

// Connect to DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Error:', err.message);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: isConnected ? 'connected' : 'disconnected' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Local dev only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
