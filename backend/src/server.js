const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const renderRoutes = require('./routes/renderRoutes');
const collabRoutes = require('./routes/collabRoutes');
const attachCollabGateway = require('./ws/collabGateway');
const renderFarmRoutes = require('./routes/renderFarmRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'hollywood-editor-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/renders', renderRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/render-farm', renderFarmRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({ message: 'Internal server error', detail: error.message });
});

connectDB(env.mongoUri)
  .then(() => {
    const server = http.createServer(app);
    attachCollabGateway(server);
    server.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
