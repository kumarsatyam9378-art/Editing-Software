const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['draft', 'rendering', 'published'], default: 'draft' },
    composition: { type: Object, required: true },
    exportSettings: {
      resolution: { type: String, default: '3840x2160' },
      fps: { type: Number, default: 30 },
      codec: { type: String, default: 'h264' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
