const crypto = require('crypto');
const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

// HOC onboarding: add a student and return a self-registration link
router.post('/', async (req, res) => {
  const { name, matric_number, course_id } = req.body;
  if (!name || !matric_number || !course_id) {
    return res.status(400).json({ message: 'name, matric_number, course_id are required' });
  }

  const registrationToken = createToken();
  const registrationTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const student = await Student.create({
    name,
    matricNumber: String(matric_number).trim().toUpperCase(),
    courseId: course_id,
    registrationToken,
    registrationTokenExpiresAt,
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const selfRegisterUrl = `${clientUrl}/register-face?token=${registrationToken}`;

  return res.status(201).json({ student, selfRegisterUrl });
});

// Public: register face using token (self-registration)
router.post('/register-face', async (req, res) => {
  const { token, face_descriptor } = req.body;
  if (!token || !Array.isArray(face_descriptor)) {
    return res.status(400).json({ message: 'token and face_descriptor are required' });
  }

  const student = await Student.findOne({ registrationToken: token });
  if (!student) {
    return res.status(404).json({ message: 'Invalid registration token' });
  }

  if (student.registrationTokenExpiresAt && student.registrationTokenExpiresAt < new Date()) {
    return res.status(410).json({ message: 'Registration token expired' });
  }

  student.faceDescriptor = face_descriptor.map(Number);
  student.faceRegistered = true;
  student.registrationToken = undefined;
  student.registrationTokenExpiresAt = undefined;
  await student.save();

  return res.json({ message: 'Face registered successfully', studentId: student._id });
});

module.exports = router;
