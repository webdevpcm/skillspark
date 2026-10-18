import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import User, { calculateProfileCompletion } from '../models/User.js';
import Skill from '../models/Skill.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Idea from '../models/Idea.js';
import TeamRequest from '../models/TeamRequest.js';
import MentorRequest from '../models/MentorRequest.js';
import Shortlist from '../models/Shortlist.js';

import { skillsData } from './skillsData.js';
import { usersSeedData, opportunitiesSeedData, ideasSeedData, DEMO_PASSWORD } from './seedData.js';

dotenv.config();

export async function runSeed() {
  console.log('🌱 Starting SkillSpark database seeding...');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Opportunity.deleteMany({}),
    Application.deleteMany({}),
    Idea.deleteMany({}),
    TeamRequest.deleteMany({}),
    MentorRequest.deleteMany({}),
    Shortlist.deleteMany({})
  ]);

  // 1. Seed Skills
  console.log(`📦 Seeding ${skillsData.length} skills with learning resources...`);
  const insertedSkills = await Skill.insertMany(skillsData);
  console.log(`✅ ${insertedSkills.length} skills seeded successfully.`);

  // 2. Seed Users
  console.log(`👤 Seeding ${usersSeedData.length} users with demo password: ${DEMO_PASSWORD}...`);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  const userDocs = usersSeedData.map(userData => {
    const user = new User({
      ...userData,
      passwordHash
    });
    user.profileCompletion = calculateProfileCompletion(user);
    return user;
  });

  const savedUsers = await User.insertMany(userDocs);
  console.log(`✅ ${savedUsers.length} users created (seekers, entrepreneurs, startups, mentors, recruiters).`);

  // Group users by role for easy referencing
  const usersByRole = {
    seeker: savedUsers.filter(u => u.role === 'seeker'),
    entrepreneur: savedUsers.filter(u => u.role === 'entrepreneur'),
    startup: savedUsers.filter(u => u.role === 'startup'),
    mentor: savedUsers.filter(u => u.role === 'mentor'),
    recruiter: savedUsers.filter(u => u.role === 'recruiter')
  };

  // 3. Seed Opportunities
  console.log(`💼 Seeding ${opportunitiesSeedData.length} opportunities...`);
  const opportunityDocs = opportunitiesSeedData.map(oppData => {
    const ownerList = usersByRole[oppData.ownerRole];
    const owner = ownerList[oppData.ownerIndex] || ownerList[0];

    const { ownerRole, ownerIndex, ...rest } = oppData;
    return new Opportunity({
      ...rest,
      status: rest.status || 'open',
      owner: owner._id
    });
  });

  const savedOpportunities = await Opportunity.insertMany(opportunityDocs);
  console.log(`✅ ${savedOpportunities.length} opportunities seeded.`);

  // 4. Seed Ideas
  console.log(`💡 Seeding ${ideasSeedData.length} startup ideas...`);
  const ideaDocs = ideasSeedData.map((ideaData, idx) => {
    const ownerList = usersByRole[ideaData.ownerRole];
    const owner = ownerList[ideaData.ownerIndex] || ownerList[0];

    // Pick 2-3 interested users
    const interested = [
      usersByRole.seeker[(idx + 1) % usersByRole.seeker.length]._id,
      usersByRole.seeker[(idx + 2) % usersByRole.seeker.length]._id
    ];

    const { ownerRole, ownerIndex, ...rest } = ideaData;
    return new Idea({
      ...rest,
      owner: owner._id,
      interested
    });
  });

  const savedIdeas = await Idea.insertMany(ideaDocs);
  console.log(`✅ ${savedIdeas.length} startup ideas seeded.`);

  // 5. Seed Applications
  console.log('📝 Seeding demo applications...');
  const applicationsData = [
    {
      opportunity: savedOpportunities[0]._id, // Frontend Developer Intern
      applicant: usersByRole.seeker[0]._id, // Alex Rivera
      coverNote: 'Excited about modern React! I built several responsive web applications with state management and clean Tailwind styles.',
      status: 'Reviewing'
    },
    {
      opportunity: savedOpportunities[7]._id, // Open Source React Web App Contributor
      applicant: usersByRole.seeker[0]._id, // Alex Rivera
      coverNote: 'I would love to contribute to open source gaming platforms and build real features for students.',
      status: 'Shortlisted'
    },
    {
      opportunity: savedOpportunities[3]._id, // Cloud Backend Engineer
      applicant: usersByRole.seeker[1]._id, // Maya Patel
      coverNote: 'My Georgia Tech projects heavily involved Django ORM, PostgreSQL query tuning, and Docker deployments.',
      status: 'Accepted'
    },
    {
      opportunity: savedOpportunities[6]._id, // Product Design Intern
      applicant: usersByRole.seeker[2]._id, // Liam Chen
      coverNote: 'Attached is my Behance portfolio. I have spent the last 2 years mastering Figma design tokens and component auto-layouts.',
      status: 'Submitted'
    },
    {
      opportunity: savedOpportunities[4]._id, // Junior Data Analyst
      applicant: usersByRole.seeker[3]._id, // Sophia Zhang
      coverNote: 'Proficient in complex SQL window functions, Pandas exploratory analysis, and building executive Tableau dashboards.',
      status: 'Reviewing'
    },
    {
      opportunity: savedOpportunities[5]._id, // Full Stack Engineer
      applicant: usersByRole.seeker[4]._id, // David Kim
      coverNote: 'Have 3 years building end-to-end MERN stacks with TypeScript. Ready to contribute from day 1.',
      status: 'Reviewing'
    }
  ];

  const savedApps = await Application.insertMany(applicationsData);
  console.log(`✅ ${savedApps.length} applications seeded.`);

  // 6. Seed Team Requests
  console.log('🤝 Seeding team collaboration requests...');
  const teamRequestsData = [
    {
      idea: savedIdeas[2]._id, // Code Review Arcade
      user: usersByRole.seeker[0]._id, // Alex Rivera
      role: 'Frontend Lead',
      status: 'pending'
    },
    {
      idea: savedIdeas[1]._id, // Carbon Offset Protocol
      user: usersByRole.seeker[1]._id, // Maya Patel
      role: 'Backend Data Engineer',
      status: 'accepted'
    },
    {
      idea: savedIdeas[4]._id, // Generative Design Tokens
      user: usersByRole.seeker[2]._id, // Liam Chen
      role: 'Design Systems Lead',
      status: 'accepted'
    },
    {
      idea: savedIdeas[6]._id, // Maya Lin's Biodegradable Mycelium idea
      user: usersByRole.seeker[0]._id, // Alex Rivera
      role: 'Founding Frontend Engineer',
      status: 'pending'
    }
  ];

  const savedTeamRequests = await TeamRequest.insertMany(teamRequestsData);
  console.log(`✅ ${savedTeamRequests.length} team requests seeded.`);

  // 7. Seed Mentor Requests
  console.log('🎓 Seeding mentor connection requests...');
  const mentorRequestsData = [
    {
      mentor: usersByRole.mentor[3]._id, // Sarah Jenkins
      mentee: usersByRole.seeker[0]._id, // Alex Rivera
      message: 'Hi Sarah! I am an aspiring frontend engineer looking to improve my architecture fundamentals and interview confidence.',
      status: 'accepted'
    },
    {
      mentor: usersByRole.mentor[2]._id, // Dr. Anil Mehta
      mentee: usersByRole.seeker[3]._id, // Sophia Zhang
      message: 'Hello Dr. Mehta, I would love your advice on navigating the transition from business analytics to applied machine learning.',
      status: 'pending'
    },
    {
      mentor: usersByRole.mentor[0]._id, // Marcus Vance
      mentee: usersByRole.startup[1]._id, // Carlos Mendez (EcoTrack)
      message: 'Marcus, would greatly appreciate 20 minutes to review our pitch deck ahead of our institutional seed raise.',
      status: 'pending'
    },
    {
      mentor: usersByRole.mentor[1]._id, // Elena Rostova
      mentee: usersByRole.entrepreneur[0]._id, // Maya Lin
      message: 'Hi Elena! We are validating our circular packaging supply chain and would value your guidance on B2B logistics partnerships.',
      status: 'accepted'
    }
  ];

  const savedMentorRequests = await MentorRequest.insertMany(mentorRequestsData);
  console.log(`✅ ${savedMentorRequests.length} mentor requests seeded.`);

  // 8. Seed Recruiter Shortlists
  console.log('⭐ Seeding recruiter shortlists...');
  const shortlistData = [
    {
      recruiter: usersByRole.recruiter[0]._id, // Apex Talent
      candidate: usersByRole.seeker[0]._id, // Alex Rivera
      opportunity: savedOpportunities[0]._id // Frontend Intern
    },
    {
      recruiter: usersByRole.recruiter[0]._id, // Apex Talent
      candidate: usersByRole.seeker[4]._id, // David Kim
      opportunity: null
    },
    {
      recruiter: usersByRole.recruiter[2]._id, // Priya Sharma (ByteWave)
      candidate: usersByRole.seeker[2]._id, // Liam Chen
      opportunity: savedOpportunities[1]._id // Junior UI/UX Designer
    }
  ];

  const savedShortlists = await Shortlist.insertMany(shortlistData);
  console.log(`✅ ${savedShortlists.length} candidate shortlists seeded.`);

  console.log('🎉 Seed completed successfully!');
}

// Auto-run when executed directly from CLI
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      console.log('Seeding finished. Exiting...');
      process.exit(0);
    })
    .catch(async err => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
