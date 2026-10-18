import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seeker', 'entrepreneur', 'startup', 'mentor', 'recruiter'],
    required: true
  },
  seekerProfile: {
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    education: {
      college: { type: String, default: '' },
      course: { type: String, default: '' },
      year: { type: String, default: '' }
    },
    experienceLevel: {
      type: String,
      enum: ['Student', 'Fresher', 'Junior', 'Mid', ''],
      default: ''
    },
    availability: {
      type: String,
      enum: ['full-time', 'part-time', ''],
      default: ''
    },
    location: { type: String, default: '' },
    remotePreference: { type: Boolean, default: false },
    portfolioLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      projects: { type: String, default: '' }
    },
    bio: { type: String, default: '' }
  },
  entrepreneurProfile: {
    ventureName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    problem: { type: String, default: '' },
    stage: {
      type: String,
      enum: ['Idea', 'Building', 'MVP', 'Launched', ''],
      default: 'Idea'
    },
    industry: { type: String, default: '' },
    lookingFor: [{ type: String, trim: true }],
    skillsNeeded: [{ type: String, trim: true }],
    location: { type: String, default: '' },
    remote: { type: Boolean, default: true },
    pitchDeckUrl: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  startupProfile: {
    startupName: { type: String, default: '' },
    description: { type: String, default: '' },
    stage: {
      type: String,
      enum: ['Idea', 'Building', 'Launched', ''],
      default: ''
    },
    domain: { type: String, default: '' },
    skillsNeeded: [{ type: String, trim: true }],
    location: { type: String, default: '' },
    remote: { type: Boolean, default: true },
    website: { type: String, default: '' }
  },
  mentorProfile: {
    expertiseAreas: [{ type: String, trim: true }],
    yearsOfExperience: { type: Number, default: 0 },
    experienceType: { type: String, default: '' },
    currentRole: { type: String, default: '' },
    weeklyAvailability: { type: String, default: '' },
    menteePreference: [{ type: String, trim: true }],
    linkedin: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  recruiterProfile: {
    companyName: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    position: { type: String, default: '' },
    hiringAreas: [{ type: String, trim: true }]
  },
  profileCompletion: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Helper function to compute profile completion percentage
export function calculateProfileCompletion(user) {
  let score = 0;
  if (!user || !user.role) return 0;

  if (user.role === 'seeker') {
    const p = user.seekerProfile || {};
    if (p.skills && p.skills.length > 0) score += 20;
    if (p.interests && p.interests.length > 0) score += 10;
    if (p.education && (p.education.college || p.education.course)) score += 15;
    if (p.experienceLevel) score += 15;
    if (p.availability) score += 10;
    if (p.location || p.remotePreference !== undefined) score += 10;
    if (p.portfolioLinks && (p.portfolioLinks.github || p.portfolioLinks.linkedin || p.portfolioLinks.projects)) score += 10;
    if (p.bio && p.bio.trim().length > 0) score += 10;
  } else if (user.role === 'entrepreneur') {
    const p = user.entrepreneurProfile || {};
    if (p.ventureName && p.ventureName.trim().length > 0) score += 20;
    if (p.problem && p.problem.trim().length > 0) score += 20;
    if (p.stage) score += 15;
    if (p.industry && p.industry.trim().length > 0) score += 15;
    if (p.skillsNeeded && p.skillsNeeded.length > 0) score += 15;
    if (p.lookingFor && p.lookingFor.length > 0) score += 5;
    if (p.bio && p.bio.trim().length > 0) score += 10;
  } else if (user.role === 'startup') {
    const p = user.startupProfile || {};
    if (p.startupName && p.startupName.trim().length > 0) score += 20;
    if (p.description && p.description.trim().length > 0) score += 20;
    if (p.stage) score += 15;
    if (p.domain && p.domain.trim().length > 0) score += 15;
    if (p.skillsNeeded && p.skillsNeeded.length > 0) score += 15;
    if (p.location || p.remote !== undefined) score += 5;
    if (p.website && p.website.trim().length > 0) score += 10;
  } else if (user.role === 'mentor') {
    const p = user.mentorProfile || {};
    if (p.expertiseAreas && p.expertiseAreas.length > 0) score += 25;
    if (p.yearsOfExperience || p.currentRole) score += 20;
    if (p.weeklyAvailability) score += 15;
    if (p.menteePreference && p.menteePreference.length > 0) score += 15;
    if (p.linkedin && p.linkedin.trim().length > 0) score += 10;
    if (p.bio && p.bio.trim().length > 0) score += 15;
  } else if (user.role === 'recruiter') {
    const p = user.recruiterProfile || {};
    if (p.companyName && p.companyName.trim().length > 0) score += 30;
    if (p.companyWebsite && p.companyWebsite.trim().length > 0) score += 25;
    if (p.position && p.position.trim().length > 0) score += 25;
    if (p.hiringAreas && p.hiringAreas.length > 0) score += 20;
  }

  return Math.min(score, 100);
}

UserSchema.pre('save', function (next) {
  this.profileCompletion = calculateProfileCompletion(this);
  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
