import Opportunity from '../models/Opportunity.js';
import Skill from '../models/Skill.js';
import { scoreJob, normalizeSkill } from '../services/matching.js';

export async function getMatches(req, res, next) {
  try {
    const user = req.user;
    const userSkills = user.seekerProfile?.skills || [];

    if (!userSkills || userSkills.length === 0) {
      return res.json({
        success: true,
        matches: [],
        message: 'Add skills to your profile to see tailored opportunity matches'
      });
    }

    // Query open opportunities that have overlap in requiredSkills
    // using index on { status: 1, requiredSkills: 1 }
    // Case-insensitive regex matching for skills overlap
    const skillRegexes = userSkills.map(s => new RegExp(`^${s.trim()}$`, 'i'));

    const opportunities = await Opportunity.find({
      status: 'open',
      requiredSkills: { $in: skillRegexes }
    })
      .populate('owner', 'name email startupProfile recruiterProfile')
      .lean();

    const matches = [];

    for (const job of opportunities) {
      const result = scoreJob(user, job);
      // Drop scores below 30
      if (result.score >= 30) {
        matches.push({
          ...job,
          score: result.score,
          matched: result.matched,
          missing: result.missing,
          reason: result.reason
        });
      }
    }

    // Sort descending by score
    matches.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillGap(req, res, next) {
  try {
    const { opportunityId } = req.params;
    const user = req.user;

    const opportunity = await Opportunity.findById(opportunityId)
      .populate('owner', 'name email startupProfile recruiterProfile')
      .lean();

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const result = scoreJob(user, opportunity);

    // Fetch learning resources for all missing required skills
    const missingSkillsWithLinks = [];
    const allDbSkills = await Skill.find({}).lean();

    for (const missingName of result.missing) {
      const normMissing = normalizeSkill(missingName);
      const skillDoc = allDbSkills.find(s => {
        if (normalizeSkill(s.name) === normMissing) return true;
        if (s.aliases && s.aliases.some(a => normalizeSkill(a) === normMissing)) return true;
        return false;
      });

      if (skillDoc) {
        missingSkillsWithLinks.push({
          name: skillDoc.name,
          category: skillDoc.category,
          learningLinks: skillDoc.learningLinks || []
        });
      } else {
        // Fallback default helpful learning link if custom skill
        missingSkillsWithLinks.push({
          name: missingName,
          category: 'General',
          learningLinks: [
            {
              title: `Learn ${missingName} on freeCodeCamp / MDN`,
              url: `https://www.google.com/search?q=learn+${encodeURIComponent(missingName)}+tutorial`
            }
          ]
        });
      }
    }

    res.json({
      success: true,
      opportunity,
      score: result.score,
      matched: result.matched,
      missing: result.missing,
      missingSkillsWithLinks,
      reason: result.reason
    });
  } catch (error) {
    next(error);
  }
}
