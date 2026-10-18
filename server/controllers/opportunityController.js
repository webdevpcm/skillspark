import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import { parseJobDescription } from '../services/aiParser.js';

export async function createOpportunity(req, res, next) {
  try {
    const { title, type, description, requiredSkills, niceToHave, levels, location, remote, deadline } = req.body;

    const opportunity = new Opportunity({
      title: title.trim(),
      type,
      description: description.trim(),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      niceToHave: Array.isArray(niceToHave) ? niceToHave : [],
      levels: Array.isArray(levels) ? levels : [],
      location: location || '',
      remote: Boolean(remote),
      deadline: deadline ? new Date(deadline) : null,
      status: 'open',
      owner: req.user._id
    });

    await opportunity.save();

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully',
      opportunity
    });
  } catch (error) {
    next(error);
  }
}

export async function getOpportunities(req, res, next) {
  try {
    const { q, type, skills, location, remote, level, status = 'open' } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (remote === 'true') {
      query.remote = true;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (level) {
      query.levels = level;
    }

    if (skills) {
      const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsList.length > 0) {
        query.requiredSkills = { $in: skillsList };
      }
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { requiredSkills: { $regex: q, $options: 'i' } }
      ];
    }

    const opportunities = await Opportunity.find(query)
      .populate('owner', 'name email role startupProfile recruiterProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    next(error);
  }
}

export async function getOpportunityById(req, res, next) {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('owner', 'name email role startupProfile recruiterProfile');

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOpportunity(req, res, next) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this opportunity' });
    }

    const { title, type, description, requiredSkills, niceToHave, levels, location, remote, deadline, status } = req.body;

    if (title) opportunity.title = title.trim();
    if (type) opportunity.type = type;
    if (description) opportunity.description = description.trim();
    if (requiredSkills) opportunity.requiredSkills = requiredSkills;
    if (niceToHave) opportunity.niceToHave = niceToHave;
    if (levels) opportunity.levels = levels;
    if (location !== undefined) opportunity.location = location;
    if (remote !== undefined) opportunity.remote = Boolean(remote);
    if (deadline !== undefined) opportunity.deadline = deadline ? new Date(deadline) : null;
    if (status) opportunity.status = status;

    await opportunity.save();

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      opportunity
    });
  } catch (error) {
    next(error);
  }
}

export async function closeOpportunity(req, res, next) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this opportunity' });
    }

    opportunity.status = 'closed';
    await opportunity.save();

    res.json({
      success: true,
      message: 'Opportunity closed successfully',
      opportunity
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOpportunities(req, res, next) {
  try {
    const opportunities = await Opportunity.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();

    // Attach application counts for each opportunity
    const oppIds = opportunities.map(o => o._id);
    const applications = await Application.find({ opportunity: { $in: oppIds } })
      .populate('applicant', 'name email seekerProfile')
      .sort({ createdAt: -1 })
      .lean();

    const oppWithApps = opportunities.map(opp => {
      const oppApps = applications.filter(a => a.opportunity.toString() === opp._id.toString());
      return {
        ...opp,
        applicationCount: oppApps.length,
        applications: oppApps
      };
    });

    res.json({
      success: true,
      opportunities: oppWithApps
    });
  } catch (error) {
    next(error);
  }
}

export async function parseOpportunity(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, message: 'Text content is required' });
    }

    const parsed = await parseJobDescription(text);

    res.json({
      success: true,
      parsed
    });
  } catch (error) {
    next(error);
  }
}
