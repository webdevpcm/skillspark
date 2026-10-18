process.env.NODE_ENV = 'test';
import { test, describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../server.js';
import { connectDB, closeDB } from '../config/db.js';
import { runSeed } from '../seed/seed.js';

let server;
let baseUrl;

describe('SkillSpark End-to-End API Verification', () => {
  before(async () => {
    await connectDB();
    await runSeed();
    server = app.listen(5099);
    baseUrl = 'http://localhost:5099/api';
  });

  after(async () => {
    if (server) server.close();
    await closeDB();
  });

  let seekerToken;
  let entrepreneurToken;
  let startupToken;
  let mentorToken;
  let recruiterToken;
  let createdOpportunityId;

  it('1. Should return health check status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.app, 'SkillSpark');
  });

  it('2. Should login demo users for all 5 roles (seeker, entrepreneur, startup, mentor, recruiter)', async () => {
    // Seeker login
    const seekerRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.rivera@example.com', password: 'Password123!' })
    });
    const seekerData = await seekerRes.json();
    assert.strictEqual(seekerRes.status, 200);
    assert.ok(seekerData.token);
    assert.strictEqual(seekerData.user.role, 'seeker');
    seekerToken = seekerData.token;

    // Entrepreneur login
    const entrepreneurRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'maya.lin@ecopack.io', password: 'Password123!' })
    });
    const entrepreneurData = await entrepreneurRes.json();
    assert.strictEqual(entrepreneurRes.status, 200);
    assert.strictEqual(entrepreneurData.user.role, 'entrepreneur');
    assert.ok(entrepreneurData.user.entrepreneurProfile);
    assert.strictEqual(entrepreneurData.user.entrepreneurProfile.ventureName, 'EcoPack Innovations');
    entrepreneurToken = entrepreneurData.token;

    // Startup login
    const startupRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'founder@nexushealth.io', password: 'Password123!' })
    });
    const startupData = await startupRes.json();
    assert.strictEqual(startupRes.status, 200);
    assert.strictEqual(startupData.user.role, 'startup');
    startupToken = startupData.token;

    // Mentor login
    const mentorRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.jenkins@mentor.com', password: 'Password123!' })
    });
    const mentorData = await mentorRes.json();
    assert.strictEqual(mentorRes.status, 200);
    assert.strictEqual(mentorData.user.role, 'mentor');
    mentorToken = mentorData.token;

    // Recruiter login
    const recruiterRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sgrey@apextalent.com', password: 'Password123!' })
    });
    const recruiterData = await recruiterRes.json();
    assert.strictEqual(recruiterRes.status, 200);
    assert.strictEqual(recruiterData.user.role, 'recruiter');
    recruiterToken = recruiterData.token;
  });

  it('3. Should fetch skills list and categories', async () => {
    const res = await fetch(`${baseUrl}/skills`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.skills.length >= 50);
  });

  it('4. Recruiter or Startup should post an opportunity', async () => {
    const res = await fetch(`${baseUrl}/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${recruiterToken}`
      },
      body: JSON.stringify({
        title: 'Full Stack JavaScript Engineer',
        type: 'job',
        description: 'Building next-generation real-time applications with React and Node.js.',
        requiredSkills: ['React', 'JavaScript', 'Node.js'],
        niceToHave: ['Git'],
        levels: ['Fresher', 'Junior'],
        location: 'San Francisco, CA',
        remote: true
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.opportunity._id);
    createdOpportunityId = data.opportunity._id;
  });

  it('5. Seeker should apply to opportunity, and duplicate application should be blocked', async () => {
    // 1st application
    const res = await fetch(`${baseUrl}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${seekerToken}`
      },
      body: JSON.stringify({
        opportunityId: createdOpportunityId,
        coverNote: 'Excited about the full-stack JavaScript role!'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.application._id);
    const applicationId = data.application._id;

    // 2nd application (duplicate attempt)
    const dupRes = await fetch(`${baseUrl}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${seekerToken}`
      },
      body: JSON.stringify({
        opportunityId: createdOpportunityId,
        coverNote: 'Trying to apply again'
      })
    });
    const dupData = await dupRes.json();
    assert.strictEqual(dupRes.status, 400);
    assert.ok(dupData.message.includes('already applied'));

    // Poster updates application status
    const statusRes = await fetch(`${baseUrl}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${recruiterToken}`
      },
      body: JSON.stringify({ status: 'Shortlisted' })
    });
    const statusData = await statusRes.json();
    assert.strictEqual(statusRes.status, 200);
    assert.strictEqual(statusData.application.status, 'Shortlisted');
  });

  it('6. Seeker smart matches and skill-gap recommendations', async () => {
    const matchesRes = await fetch(`${baseUrl}/matches`, {
      headers: { 'Authorization': `Bearer ${seekerToken}` }
    });
    const matchesData = await matchesRes.json();
    assert.strictEqual(matchesRes.status, 200);
    assert.ok(matchesData.matches.length > 0);
    // Highest score should be >= 90
    assert.ok(matchesData.matches[0].score >= 90);

    // Skill-gap tips endpoint
    const gapRes = await fetch(`${baseUrl}/skill-gap/${createdOpportunityId}`, {
      headers: { 'Authorization': `Bearer ${seekerToken}` }
    });
    const gapData = await gapRes.json();
    assert.strictEqual(gapRes.status, 200);
    assert.ok(gapData.missingSkillsWithLinks !== undefined);
  });

  it('7. Mentor request and status update', async () => {
    // Seeker requests mentorship from Marcus Vance
    const mentorsRes = await fetch(`${baseUrl}/mentors?expertise=Fundraising`);
    const mentorsData = await mentorsRes.json();
    const marcus = mentorsData.mentors.find(m => m.email === 'marcus.vance@mentor.com');

    const reqRes = await fetch(`${baseUrl}/mentors/mentor-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${seekerToken}`
      },
      body: JSON.stringify({
        mentorId: marcus._id,
        message: 'Marcus, would love your advice on career milestones.'
      })
    });
    const reqData = await reqRes.json();
    assert.strictEqual(reqRes.status, 201);
  });

  it('8. AI Job Description parser fallback keyword extraction', async () => {
    const parseRes = await fetch(`${baseUrl}/opportunities/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${recruiterToken}`
      },
      body: JSON.stringify({
        text: 'We are hiring a Frontend Developer Intern. Required skills include React, JavaScript, and HTML. Nice to have Git experience.'
      })
    });
    const parseData = await parseRes.json();
    assert.strictEqual(parseRes.status, 200);
    assert.ok(parseData.parsed.requiredSkills.includes('React'));
    assert.ok(parseData.parsed.requiredSkills.includes('JavaScript'));
    assert.strictEqual(parseData.parsed.experienceLevel, 'Student');
  });

  it('9. Entrepreneur should post pitch, access dashboard with venture metrics', async () => {
    // 1. Post new pitch as entrepreneur
    const ideaRes = await fetch(`${baseUrl}/ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${entrepreneurToken}`
      },
      body: JSON.stringify({
        title: 'Zero Waste Mushroom Packaging Kits',
        problem: 'Local artisans lack small-batch sustainable packaging.',
        solution: 'DIY grow-at-home mycelium packaging molds.',
        skillsNeeded: ['React', 'Node.js', 'UI/UX'],
        stage: 'Idea'
      })
    });
    const ideaData = await ideaRes.json();
    assert.strictEqual(ideaRes.status, 201);
    assert.strictEqual(ideaData.idea.title, 'Zero Waste Mushroom Packaging Kits');

    // 2. Fetch entrepreneur dashboard summary
    const dashRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { 'Authorization': `Bearer ${entrepreneurToken}` }
    });
    const dashData = await dashRes.json();
    assert.strictEqual(dashRes.status, 200);
    assert.strictEqual(dashData.role, 'entrepreneur');
    assert.ok(dashData.stats.activeVentures >= 1);
    assert.ok(dashData.myIdeas.length >= 1);
    assert.ok(dashData.stats.mentorConnections >= 1);
  });
});
