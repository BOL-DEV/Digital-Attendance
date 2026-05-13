require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http');
const cron = require('node-cron');
const { Server } = require('socket.io');

const { connectDb } = require('./config/db');
const routes = require('./routes');
const Session = require('./models/Session');

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.set('io', io);

app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', routes);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('join_session', (session_id) => {
    socket.join(`session_${session_id}`);
  });

  socket.on('leave_session', (session_id) => {
    socket.leave(`session_${session_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Auto-close sessions every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const expired = await Session.find({ status: 'active', closesAt: { $lte: now } });
    for (const session of expired) {
      session.status = 'closed';
      session.closedAt = now;
      await session.save();
      io.to(`session_${session._id}`).emit('session_closed', {
        session_id: session._id,
        message: 'Session has automatically closed.',
      });
    }
  } catch (err) {
    console.error('Cron error:', err);
  }
});

async function start() {
  await connectDb(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
