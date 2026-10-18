import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User, { calculateProfileCompletion } from '../models/User.js';
import Skill from '../models/Skill.js';
import { skillsData } from './skillsData.js';
import { usersSeedData, DEMO_PASSWORD } from './seedData.js';

dotenv.config();

export async function runSeed() {
  console.log('🌱 Starting SkillSpark database seeding (Stage 1)...');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({})
  ]);

  console.log(`📦 Seeding ${skillsData.length} skills with learning resources...`);
  const insertedSkills = await Skill.insertMany(skillsData);
  console.log(`✅ ${insertedSkills.length} skills seeded successfully.`);

  console.log(`👤 Seeding initial users with demo password: ${DEMO_PASSWORD}...`);
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
  console.log(`✅ ${savedUsers.length} users created.`);
  console.log('🎉 Stage 1 Seed completed successfully!');
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js')) {
  runSeed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
