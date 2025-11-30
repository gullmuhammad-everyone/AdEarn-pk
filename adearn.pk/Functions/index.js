const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'AdEarn.pk Backend',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoint
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Registration endpoint' });
});

// Export API
exports.api = functions.https.onRequest(app);
