const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    hocId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    classType: { type: String, enum: ['2hr', '3hr'], required: true },
    durationMinutes: { type: Number, required: true },

    qrToken: { type: String, required: true, unique: true },
    qrExpiresAt: { type: Date, required: true },

    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    closesAt: { type: Date, required: true },
    closedAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

sessionSchema.index({ status: 1, closesAt: 1 });
sessionSchema.index({ courseId: 1 });

module.exports = mongoose.model('Session', sessionSchema);
