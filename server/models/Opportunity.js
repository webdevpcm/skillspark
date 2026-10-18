import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['job', 'internship', 'project'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  niceToHave: [{
    type: String,
    trim: true
  }],
  levels: [{
    type: String,
    enum: ['Student', 'Fresher', 'Junior', 'Mid']
  }],
  location: {
    type: String,
    default: ''
  },
  remote: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

OpportunitySchema.index({ status: 1, requiredSkills: 1 });
OpportunitySchema.index({ owner: 1 });
OpportunitySchema.index({ type: 1 });

const Opportunity = mongoose.model('Opportunity', OpportunitySchema);
export default Opportunity;
