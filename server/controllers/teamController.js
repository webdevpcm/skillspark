import TeamRequest from '../models/TeamRequest.js';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import { scorePersonForIdea } from '../services/matching.js';

export async function getRankedPeople(req, res, next) {
  try {
    const { ideaId, skill, level } = req.query;

    let idea = null;
    if (ideaId) {
      idea = await Idea.findById(ideaId);
    }

    // Find seekers and startups with skills
    const query = {
      role: { $in: ['seeker', 'startup', 'entrepreneur'] },
      _id: { $ne: req.user._id } // exclude current user
    };

    if (level) {
      query['seekerProfile.experienceLevel'] = level;
    }

    if (skill) {
      query['seekerProfile.skills'] = { $regex: new RegExp(`^${skill.trim()}$`, 'i') };
    }

    const people = await User.find(query).select('-passwordHash').lean();

    let ranked = [];

    if (idea && idea.skillsNeeded && idea.skillsNeeded.length > 0) {
      for (const person of people) {
        const ranking = scorePersonForIdea(person, idea);
        ranked.push({
          ...person,
          score: ranking.score,
          matched: ranking.matched,
          missing: ranking.missing,
          reason: ranking.reason
        });
      }
      // Sort by score descending
      ranked.sort((a, b) => b.score - a.score);
    } else {
      ranked = people.map(p => ({
        ...p,
        score: p.profileCompletion || 0,
        matched: p.seekerProfile?.skills || [],
        missing: [],
        reason: `${(p.seekerProfile?.skills || []).length} skills listed`
      })).sort((a, b) => (b.profileCompletion || 0) - (a.profileCompletion || 0));
    }

    res.json({
      success: true,
      count: ranked.length,
      people: ranked
    });
  } catch (error) {
    next(error);
  }
}

export async function sendTeamRequest(req, res, next) {
  try {
    const { ideaId, userId, role } = req.body;

    if (!ideaId || !userId || !role) {
      return res.status(400).json({ success: false, message: 'ideaId, userId, and role are required' });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    // Check if duplicate pending request
    const existing = await TeamRequest.findOne({
      idea: ideaId,
      user: userId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'A pending team request already exists for this user' });
    }

    const teamRequest = new TeamRequest({
      idea: ideaId,
      user: userId,
      role: role.trim(),
      status: 'pending'
    });

    await teamRequest.save();

    res.status(201).json({
      success: true,
      message: 'Team invitation sent successfully',
      teamRequest
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyTeamRequests(req, res, next) {
  try {
    // User could be the invited user OR the owner of the idea
    const myIdeas = await Idea.find({ owner: req.user._id }).select('_id');
    const myIdeaIds = myIdeas.map(i => i._id);

    const requests = await TeamRequest.find({
      $or: [
        { user: req.user._id },
        { idea: { $in: myIdeaIds } }
      ]
    })
      .populate('idea')
      .populate('user', 'name email role seekerProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeamRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be accepted or declined' });
    }

    const request = await TeamRequest.findById(req.params.id).populate('idea');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Team request not found' });
    }

    const isRecipient = request.user.toString() === req.user._id.toString();
    const isIdeaOwner = request.idea?.owner?.toString() === req.user._id.toString();

    if (!isRecipient && !isIdeaOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify this request' });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      teamRequest: request
    });
  } catch (error) {
    next(error);
  }
}
