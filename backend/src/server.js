const express = require('express');
const bodyParser = require('body-parser');
const { router } = require('./router');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// Health Check Endpoint
app.get('/ping', (req, res) => {// Route for a simple ping-pong response
  res.send({ pong: 'ok' });
});

router.forEach((route) => {
  app.use(route);
});

// Catch-All Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3001, () => {
  console.log('Server started on http://localhost:3001');
});