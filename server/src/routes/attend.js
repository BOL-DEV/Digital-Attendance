const express = require('express');
const Session = require('../models/Session');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const router = express.Router();

function euclideanDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

// Public: validate QR token
router.get('/:session_id/validate', async (req, res) => {
  const { token } = req.query;
  const session = await Session.findById(req.params.session_id).populate('courseId');

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.status !== 'active' || session.closesAt <= new Date()) {
    return res.status(410).json({ message: 'Session has ended' });
  }

  if (!token || token !== session.qrToken) {
    return res.status(401).json({ message: 'Invalid QR token' });
  }

  if (session.qrExpiresAt <= new Date()) {
    return res.status(401).json({ message: 'QR token expired, rescan the new QR' });
  }

  return res.json({
    session_id: session._id,
    course_name: session.courseId?.name,
    course_code: session.courseId?.code,
    expires_at: session.qrExpiresAt,
  });
});

// Public: sign attendance
router.post('/sign', async (req, res) => {
  const { session_id, token, matric_number, face_descriptor } = req.body;

  if (!session_id || !token || !matric_number || !Array.isArray(face_descriptor)) {
    return res.status(400).json({ message: 'session_id, token, matric_number, face_descriptor are required' });
  }

  const session = await Session.findById(session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.status !== 'active' || session.closesAt <= new Date()) {
    return res.status(410).json({ message: 'Session has ended' });
  }

  if (token !== session.qrToken) {
    return res.status(401).json({ message: 'Invalid QR token' });
  }

  if (session.qrExpiresAt <= new Date()) {
    return res.status(401).json({ message: 'QR token expired, rescan the new QR' });
  }

  const matric = String(matric_number).trim().toUpperCase();
  const student = await Student.findOne({ matricNumber: matric, courseId: session.courseId });
  if (!student) {
    return res.status(404).json({ message: 'Student not found for this course' });
  }

  if (!student.faceRegistered || !Array.isArray(student.faceDescriptor)) {
    return res.status(412).json({ message: 'Face not registered. Use your self-registration link first.' });
  }

  const incoming = face_descriptor.map(Number);
  const saved = student.faceDescriptor;
  const distance = euclideanDistance(incoming, saved);
  const THRESHOLD = 0.55;

  if (distance > THRESHOLD) {
    return res.status(401).json({ message: 'Face verification failed. Try again.' });
  }

  try {
    const record = await Attendance.create({ sessionId: session._id, studentId: student._id });

    const io = req.app.get('io');
    io?.to(`session_${session._id}`).emit('student_signed', {
      name: student.name,
      matric_number: student.matricNumber,
      signed_at: record.signedAt,
    });

    return res.json({ message: 'Signed successfully' });
  } catch (err) {
    // duplicate sign
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'You already signed for this session' });
    }
    throw err;
  }
});

module.exports = router;
