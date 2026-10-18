import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  problem: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  skillsNeeded: [{
    type: String,
    trim: true
  }],
  stage: {
    type: String,
    enum: ['Idea', 'Building', 'Launched'],
    default: 'Idea'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interested: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

IdeaSchema.index({ owner: 1 });
IdeaSchema.index({ skillsNeeded: 1 });

const Idea = mongoose.model('Idea', IdeaSchema);
export default Idea;
