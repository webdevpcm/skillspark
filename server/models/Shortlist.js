import mongoose from 'mongoose';

const ShortlistSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ShortlistSchema.index({ recruiter: 1, candidate: 1, opportunity: 1 }, { unique: true });
ShortlistSchema.index({ recruiter: 1 });

const Shortlist = mongoose.model('Shortlist', ShortlistSchema);
export default Shortlist;
