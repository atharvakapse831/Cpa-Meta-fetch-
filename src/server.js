require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const mediaRoutes = require('./routes/media');
const { TEMP_DIR } = require('./config');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure tmp dir exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Rate limit: 60 req/min per IP
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cpa-media-service', ts: new Date().toISOString() });
});

app.use('/api', mediaRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`cpa-media-service running on port ${PORT}`);
});
