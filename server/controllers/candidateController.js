import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Shortlist from '../models/Shortlist.js';
import { scoreJob } from '../services/matching.js';

export async function searchCandidates(req, res, next) {
  try {
    const { skills, level, opportunityId, search } = req.query;

    const query = { role: 'seeker' };

    if (level) {
      query['seekerProfile.experienceLevel'] = level;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => new RegExp(`^${s.trim()}$`, 'i'));
      query['seekerProfile.skills'] = { $in: skillsArray };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'seekerProfile.bio': { $regex: search, $options: 'i' } },
        { 'seekerProfile.education.course': { $regex: search, $options: 'i' } },
        { 'seekerProfile.skills': { $regex: search, $options: 'i' } }
      ];
    }

    const candidates = await User.find(query).select('-passwordHash').lean();

    let rankedCandidates = [];

    if (opportunityId) {
      const opp = await Opportunity.findById(opportunityId).lean();
      if (opp) {
        for (const candidate of candidates) {
          const scoreResult = scoreJob(candidate, opp);
          rankedCandidates.push({
            ...candidate,
            score: scoreResult.score,
            matched: scoreResult.matched,
            missing: scoreResult.missing,
            reason: scoreResult.reason
          });
        }
        rankedCandidates.sort((a, b) => b.score - a.score);
      } else {
        rankedCandidates = candidates;
      }
    } else {
      rankedCandidates = candidates.map(c => ({
        ...c,
        score: c.profileCompletion || 0,
        matched: c.seekerProfile?.skills || [],
        missing: [],
        reason: `${c.seekerProfile?.experienceLevel || 'Candidate'} with ${(c.seekerProfile?.skills || []).length} skills`
      })).sort((a, b) => (b.profileCompletion || 0) - (a.profileCompletion || 0));
    }

    res.json({
      success: true,
      count: rankedCandidates.length,
      candidates: rankedCandidates
    });
  } catch (error) {
    next(error);
  }
}

export async function addToShortlist(req, res, next) {
  try {
    const { candidateId, opportunityId } = req.body;

    if (!candidateId) {
      return res.status(400).json({ success: false, message: 'candidateId is required' });
    }

    const candidate = await User.findOne({ _id: candidateId, role: 'seeker' });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate seeker not found' });
    }

    // Check existing
    const existing = await Shortlist.findOne({
      recruiter: req.user._id,
      candidate: candidateId,
      opportunity: opportunityId || null
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Candidate already shortlisted' });
    }

    const shortlist = new Shortlist({
      recruiter: req.user._id,
      candidate: candidateId,
      opportunity: opportunityId || null
    });

    await shortlist.save();

    res.status(201).json({
      success: true,
      message: 'Candidate added to shortlist',
      shortlist
    });
  } catch (error) {
    next(error);
  }
}

export async function getShortlist(req, res, next) {
  try {
    const list = await Shortlist.find({ recruiter: req.user._id })
      .populate('candidate', 'name email seekerProfile profileCompletion')
      .populate('opportunity', 'title type location remote status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: list.length,
      shortlist: list
    });
  } catch (error) {
    next(error);
  }
}
