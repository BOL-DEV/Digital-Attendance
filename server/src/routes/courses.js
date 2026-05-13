const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// MVP: create a course (auth can be added later)
router.post('/', async (req, res) => {
  const { name, code, lecturerId, hocId } = req.body;
  if (!name || !code) {
    return res.status(400).json({ message: 'name and code are required' });
  }

  const course = await Course.create({
    name,
    code,
    lecturerId: lecturerId || undefined,
    hocId: hocId || undefined,
  });

  return res.status(201).json({ course });
});

module.exports = router;
