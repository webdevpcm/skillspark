import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverNote: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'],
    default: 'Submitted'
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
ApplicationSchema.index({ opportunity: 1, applicant: 1 }, { unique: true });
ApplicationSchema.index({ applicant: 1 });
ApplicationSchema.index({ opportunity: 1 });

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
