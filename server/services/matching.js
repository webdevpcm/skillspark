/**
 * SkillSpark Matching Engine
 * 
 * Rules:
 * - 70 points: matched required skills / total required skills
 * - 20 points: matched nice-to-have skills / total nice-to-have (0 if none listed)
 * - 10 points: user's experience level is included in job.levels
 * Round to a whole number from 0 to 100.
 */

// Helper to normalize skill strings for reliable case-insensitive matching
export function normalizeSkill(skill) {
  if (!skill) return '';
  return skill.toString().trim().toLowerCase();
}

/**
 * Score a job against a user's profile
 * @param {Object} user User object or seeker profile (must have skills, experienceLevel)
 * @param {Object} job Opportunity object (requiredSkills, niceToHave, levels)
 * @returns {Object} { score, matched, missing, reason }
 */
export function scoreJob(user, job) {
  // Extract user skills and level safely from user or user.seekerProfile
  const userSkills = (user?.seekerProfile?.skills || user?.skills || []).map(normalizeSkill);
  const userLevel = user?.seekerProfile?.experienceLevel || user?.experienceLevel || '';

  const required = job?.requiredSkills || [];
  const niceToHave = job?.niceToHave || [];
  const levels = job?.levels || [];

  // Match required skills
  const matchedRequired = [];
  const missingRequired = [];

  for (const req of required) {
    const norm = normalizeSkill(req);
    if (userSkills.includes(norm)) {
      matchedRequired.push(req);
    } else {
      missingRequired.push(req);
    }
  }

  // Match nice-to-have skills
  const matchedNice = [];
  const missingNice = [];

  for (const nice of niceToHave) {
    const norm = normalizeSkill(nice);
    if (userSkills.includes(norm)) {
      matchedNice.push(nice);
    } else {
      missingNice.push(nice);
    }
  }

  // Calculate points
  let requiredScore = 0;
  if (required.length > 0) {
    requiredScore = (matchedRequired.length / required.length) * 70;
  }

  let niceScore = 0;
  if (niceToHave.length > 0) {
    niceScore = (matchedNice.length / niceToHave.length) * 20;
  }

  let levelScore = 0;
  if (userLevel && levels.length > 0 && levels.map(l => l.toLowerCase()).includes(userLevel.toLowerCase())) {
    levelScore = 10;
  }

  const rawScore = requiredScore + niceScore + levelScore;
  const score = Math.round(rawScore);

  const matched = [...matchedRequired, ...matchedNice];
  const missing = [...missingRequired];

  let reason = '';
  if (required.length > 0) {
    reason = `${matchedRequired.length} of ${required.length} required skills match`;
  } else {
    reason = 'No specific required skills listed';
  }

  if (levelScore > 0) {
    reason += ', level matches';
  }
  if (matchedNice.length > 0) {
    reason += `, ${matchedNice.length} bonus skill${matchedNice.length > 1 ? 's' : ''}`;
  }

  return {
    score,
    matched,
    missing,
    reason
  };
}

/**
 * Score a person (seeker, startup member) against an idea's skillsNeeded
 * @param {Object} person User object
 * @param {Object} idea Idea object
 */
export function scorePersonForIdea(person, idea) {
  const jobEquivalent = {
    requiredSkills: idea.skillsNeeded || [],
    niceToHave: [],
    levels: []
  };

  const result = scoreJob(person, jobEquivalent);
  // Scale result to 100 since idea doesn't have niceToHave or level requirements
  let score = 0;
  if (jobEquivalent.requiredSkills.length > 0) {
    score = Math.round((result.matched.length / jobEquivalent.requiredSkills.length) * 100);
  }

  return {
    score,
    matched: result.matched,
    missing: result.missing,
    reason: `${result.matched.length} of ${jobEquivalent.requiredSkills.length} needed skills match`
  };
}
