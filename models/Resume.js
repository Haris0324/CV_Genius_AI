import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'My Professional Resume',
    },
    content: {
      // We will store the full AI output and structured sections as JSON
      type: Object,
      required: true,
      default: {},
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal'],
      default: 'modern',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
