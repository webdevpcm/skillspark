import User, { calculateProfileCompletion } from '../models/User.js';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, seekerProfile, entrepreneurProfile, startupProfile, mentorProfile, recruiterProfile } = req.body;

    if (name) user.name = name.trim();

    if (user.role === 'seeker' && seekerProfile) {
      user.seekerProfile = {
        ...user.seekerProfile.toObject(),
        ...seekerProfile
      };
    } else if (user.role === 'entrepreneur' && entrepreneurProfile) {
      user.entrepreneurProfile = {
        ...user.entrepreneurProfile.toObject(),
        ...entrepreneurProfile
      };
    } else if (user.role === 'startup' && startupProfile) {
      user.startupProfile = {
        ...user.startupProfile.toObject(),
        ...startupProfile
      };
    } else if (user.role === 'mentor' && mentorProfile) {
      user.mentorProfile = {
        ...user.mentorProfile.toObject(),
        ...mentorProfile
      };
    } else if (user.role === 'recruiter' && recruiterProfile) {
      user.recruiterProfile = {
        ...user.recruiterProfile.toObject(),
        ...recruiterProfile
      };
    }

    user.profileCompletion = calculateProfileCompletion(user);
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion,
        seekerProfile: user.seekerProfile,
        entrepreneurProfile: user.entrepreneurProfile,
        startupProfile: user.startupProfile,
        mentorProfile: user.mentorProfile,
        recruiterProfile: user.recruiterProfile
      }
    });
  } catch (error) {
    next(error);
  }
}
