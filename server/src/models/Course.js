const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hocId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

courseSchema.index({ code: 1 });

module.exports = mongoose.model('Course', courseSchema);
