import mongoose from 'mongoose';

const MentorRequestSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MentorRequestSchema.index({ mentor: 1, mentee: 1 });
MentorRequestSchema.index({ mentor: 1, status: 1 });
MentorRequestSchema.index({ mentee: 1 });

const MentorRequest = mongoose.model('MentorRequest', MentorRequestSchema);
export default MentorRequest;
