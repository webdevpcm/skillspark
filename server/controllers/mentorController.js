import MentorRequest from '../models/MentorRequest.js';
import User from '../models/User.js';

export async function getMentors(req, res, next) {
  try {
    const { expertise, search } = req.query;
    const query = { role: 'mentor' };

    if (expertise) {
      query['mentorProfile.expertiseAreas'] = { $regex: new RegExp(expertise.trim(), 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'mentorProfile.currentRole': { $regex: search, $options: 'i' } },
        { 'mentorProfile.bio': { $regex: search, $options: 'i' } },
        { 'mentorProfile.expertiseAreas': { $regex: search, $options: 'i' } }
      ];
    }

    const mentors = await User.find(query).select('-passwordHash').sort({ profileCompletion: -1 });

    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMentorRequest(req, res, next) {
  try {
    const { mentorId, message } = req.body;

    if (!mentorId || !message) {
      return res.status(400).json({ success: false, message: 'mentorId and message are required' });
    }

    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    if (mentorId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request mentorship from yourself' });
    }

    const existing = await MentorRequest.findOne({
      mentor: mentorId,
      mentee: req.user._id,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending request with this mentor' });
    }

    const request = new MentorRequest({
      mentor: mentorId,
      mentee: req.user._id,
      message: message.trim(),
      status: 'pending'
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully',
      mentorRequest: request
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyMentorRequests(req, res, next) {
  try {
    // Both mentee and mentor can view their requests
    const query = req.user.role === 'mentor' 
      ? { mentor: req.user._id }
      : { mentee: req.user._id };

    const requests = await MentorRequest.find(query)
      .populate('mentor', 'name email mentorProfile')
      .populate('mentee', 'name email role seekerProfile startupProfile')
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

export async function updateMentorRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be accepted or declined' });
    }

    const request = await MentorRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Mentor request not found' });
    }

    // Only the mentor can accept or decline
    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only the mentor can update this request' });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: `Mentorship request ${status}`,
      mentorRequest: request
    });
  } catch (error) {
    next(error);
  }
}
