import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  aliases: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  learningLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast search
SkillSchema.index({ aliases: 1 });

const Skill = mongoose.model('Skill', SkillSchema);
export default Skill;
