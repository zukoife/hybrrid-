const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Basic production hardening
app.disable('x-powered-by');

// CORS configuration
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// Middleware
app.use(express.json({ limit: '1mb' }));

// Simple request logger (production-safe, minimal)
app.use((req, _res, next) => {
  const start = Date.now();
  const { method, url } = req;
  next();
  const durationMs = Date.now() - start;
  // Avoid logging bodies to keep secrets safe
  console.log(`[${new Date().toISOString()}] ${method} ${url} ${durationMs}ms`);
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

mongoose
  .connect(mongoUri, {})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.json({ status: 'ok', uptime: process.uptime() });
});

// Start server
const port = Number(process.env.PORT) || 4000;
app
  .listen(port, () => {
    console.log(`Server running on port ${port} (env: ${process.env.NODE_ENV || 'development'})`);
  })
  .on('error', (err) => {
    console.error('HTTP server error:', err);
  });
