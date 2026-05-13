const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    matricNumber: { type: String, required: true, trim: true, uppercase: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    faceDescriptor: { type: [Number], default: undefined },
    faceRegistered: { type: Boolean, default: false },

    registrationToken: { type: String, index: true },
    registrationTokenExpiresAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

studentSchema.index({ matricNumber: 1 }, { unique: true });
studentSchema.index({ courseId: 1 });

module.exports = mongoose.model('Student', studentSchema);
