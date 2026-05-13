require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const pool = require('./models/db');
const routes = require('./routes/index');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in controllers
app.set('io', io);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // larger limit for face descriptors
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ──────────────────────────────────────────
// SOCKET.IO - Real-time events
// ──────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // HOC joins their session room to receive live attendance updates
  socket.on('join_session', (session_id) => {
    socket.join(`session_${session_id}`);
    console.log(`HOC joined session room: session_${session_id}`);
  });

  socket.on('leave_session', (session_id) => {
    socket.leave(`session_${session_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ──────────────────────────────────────────
// CRON JOB - Auto-close expired sessions every minute
// ──────────────────────────────────────────
cron.schedule('* * * * *', async () => {
  try {
    const result = await pool.query(
      `UPDATE sessions 
       SET status = 'closed', closed_at = NOW()
       WHERE status = 'active' AND closes_at <= NOW()
       RETURNING id, course_id`
    );

    if (result.rows.length > 0) {
      result.rows.forEach((session) => {
        io.to(`session_${session.id}`).emit('session_closed', {
          session_id: session.id,
          message: 'Session has automatically closed.',
        });
        console.log(`⏱️ Auto-closed session: ${session.id}`);
      });
    }
  } catch (err) {
    console.error('Cron error:', err);
  }
});

// ──────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
