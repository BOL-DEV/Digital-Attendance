const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    signedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ sessionId: 1 });
attendanceSchema.index({ studentId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
