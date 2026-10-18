import mongoose from 'mongoose';

const TeamRequestSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
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

TeamRequestSchema.index({ idea: 1, user: 1 });
TeamRequestSchema.index({ user: 1 });

const TeamRequest = mongoose.model('TeamRequest', TeamRequestSchema);
export default TeamRequest;
