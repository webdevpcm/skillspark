import Idea from '../models/Idea.js';

export async function createIdea(req, res, next) {
  try {
    const { title, problem, solution, skillsNeeded, stage } = req.body;

    const idea = new Idea({
      title: title.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      skillsNeeded: Array.isArray(skillsNeeded) ? skillsNeeded : [],
      stage: stage || 'Idea',
      owner: req.user._id,
      interested: []
    });

    await idea.save();

    res.status(201).json({
      success: true,
      message: 'Idea posted successfully',
      idea
    });
  } catch (error) {
    next(error);
  }
}

export async function getIdeas(req, res, next) {
  try {
    const { stage, search } = req.query;
    const query = {};

    if (stage) {
      query.stage = stage;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problem: { $regex: search, $options: 'i' } },
        { solution: { $regex: search, $options: 'i' } },
        { skillsNeeded: { $regex: search, $options: 'i' } }
      ];
    }

    const ideas = await Idea.find(query)
      .populate('owner', 'name email role startupProfile seekerProfile')
      .populate('interested', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ideas.length,
      ideas
    });
  } catch (error) {
    next(error);
  }
}

export async function getIdeaById(req, res, next) {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('owner', 'name email role startupProfile seekerProfile')
      .populate('interested', 'name email role seekerProfile');

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    res.json({
      success: true,
      idea
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleInterest(req, res, next) {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = idea.interested.findIndex(id => id.toString() === userIdStr);

    let isInterested = false;
    if (existingIndex > -1) {
      // Remove interest
      idea.interested.splice(existingIndex, 1);
      isInterested = false;
    } else {
      // Add interest
      idea.interested.push(req.user._id);
      isInterested = true;
    }

    await idea.save();

    res.json({
      success: true,
      isInterested,
      interestedCount: idea.interested.length,
      message: isInterested ? 'Expressed interest in idea' : 'Withdrew interest from idea'
    });
  } catch (error) {
    next(error);
  }
}
