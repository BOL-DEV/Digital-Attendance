const crypto = require('crypto');
const express = require('express');
const QRCode = require('qrcode');

const Course = require('../models/Course');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const router = express.Router();

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function buildQrImage({ sessionId, token }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const signUrl = `${clientUrl}/sign/${sessionId}?token=${token}`;
  const qrImage = await QRCode.toDataURL(signUrl);
  return { qrImage, signUrl };
}

// Create a session (MVP: no auth yet)
router.post('/', async (req, res) => {
  const { course_id, hoc_id, class_type } = req.body;
  if (!course_id || !class_type) {
    return res.status(400).json({ message: 'course_id and class_type are required' });
  }

  const course = await Course.findById(course_id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const durationMinutes = class_type === '3hr' ? 120 : 90;
  const now = new Date();

  const qrToken = createToken();
  const qrExpiresAt = new Date(now.getTime() + 45 * 1000);
  const closesAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  const session = await Session.create({
    courseId: course._id,
    hocId: hoc_id || undefined,
    classType: class_type,
    durationMinutes,
    qrToken,
    qrExpiresAt,
    closesAt,
    status: 'active',
  });

  const { qrImage } = await buildQrImage({ sessionId: session._id, token: qrToken });

  return res.status(201).json({
    session,
    qrImage,
  });
});

// Get session + attendance list
router.get('/:id', async (req, res) => {
  const session = await Session.findById(req.params.id).populate('courseId');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const rows = await Attendance.find({ sessionId: session._id })
    .sort({ signedAt: -1 })
    .populate('studentId');

  const attendance = rows.map((r) => ({
    name: r.studentId?.name,
    matric_number: r.studentId?.matricNumber,
    signed_at: r.signedAt,
  }));

  return res.json({
    session: {
      id: session._id,
      course_name: session.courseId?.name,
      course_code: session.courseId?.code,
      class_type: session.classType,
      closes_at: session.closesAt,
      status: session.status,
    },
    attendance,
  });
});

// Refresh QR token (every 45s)
router.get('/:id/qr', async (req, res) => {
  const session = await Session.findById(req.params.id).populate('courseId');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.status !== 'active') {
    return res.status(410).json({ message: 'Session closed' });
  }

  if (session.closesAt <= new Date()) {
    session.status = 'closed';
    session.closedAt = new Date();
    await session.save();
    return res.status(410).json({ message: 'Session ended' });
  }

  session.qrToken = createToken();
  session.qrExpiresAt = new Date(Date.now() + 45 * 1000);
  await session.save();

  const { qrImage } = await buildQrImage({ sessionId: session._id, token: session.qrToken });
  return res.json({ qrImage });
});

// Close session manually
router.put('/:id/close', async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.status === 'closed') {
    return res.json({ message: 'Session already closed' });
  }

  session.status = 'closed';
  session.closedAt = new Date();
  await session.save();

  const io = req.app.get('io');
  io?.to(`session_${session._id}`).emit('session_closed', { session_id: session._id });

  return res.json({ message: 'Session closed' });
});

module.exports = router;
