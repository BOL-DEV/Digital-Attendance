const express = require('express');

const courses = require('./courses');
const students = require('./students');
const sessions = require('./sessions');
const attend = require('./attend');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

router.use('/courses', courses);
router.use('/students', students);
router.use('/sessions', sessions);
router.use('/attend', attend);

module.exports = router;
