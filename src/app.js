const express = require('express');
const taskRoutes = require('./routes/tasks');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Task Manager API running on port ${PORT}`);
});

module.exports = app;
