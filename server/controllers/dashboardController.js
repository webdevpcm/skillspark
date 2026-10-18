import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Idea from '../models/Idea.js';
import TeamRequest from '../models/TeamRequest.js';
import MentorRequest from '../models/MentorRequest.js';
import Shortlist from '../models/Shortlist.js';
import { scoreJob } from '../services/matching.js';

export async function getDashboardSummary(req, res, next) {
  try {
    const user = req.user;
    const role = user.role;

    if (role === 'seeker') {
      // 1. Applications
      const applications = await Application.find({ applicant: user._id })
        .populate({
          path: 'opportunity',
          populate: { path: 'owner', select: 'name email startupProfile recruiterProfile entrepreneurProfile' }
        })
        .sort({ createdAt: -1 });

      const submittedCount = applications.filter(a => a.status === 'Submitted').length;
      const reviewingCount = applications.filter(a => a.status === 'Reviewing' || a.status === 'Shortlisted').length;
      const acceptedCount = applications.filter(a => a.status === 'Accepted').length;

      // 2. Recommendations
      const userSkills = user.seekerProfile?.skills || [];
      let recommendations = [];

      if (userSkills.length > 0) {
        const skillRegexes = userSkills.map(s => new RegExp(`^${s.trim()}$`, 'i'));
        const openJobs = await Opportunity.find({
          status: 'open',
          requiredSkills: { $in: skillRegexes }
        })
          .populate('owner', 'name email startupProfile recruiterProfile entrepreneurProfile')
          .lean();

        for (const job of openJobs) {
          const resScore = scoreJob(user, job);
          if (resScore.score >= 30) {
            recommendations.push({
              ...job,
              score: resScore.score,
              matched: resScore.matched,
              missing: resScore.missing,
              reason: resScore.reason
            });
          }
        }
        recommendations.sort((a, b) => b.score - a.score);
        recommendations = recommendations.slice(0, 4);
      }

      // 3. Mentorship requests
      const mentorRequests = await MentorRequest.find({ mentee: user._id })
        .populate('mentor', 'name email mentorProfile')
        .sort({ createdAt: -1 })
        .limit(3);

      return res.json({
        success: true,
        role: 'seeker',
        profileCompletion: user.profileCompletion,
        stats: {
          totalApplications: applications.length,
          submittedCount,
          reviewingCount,
          acceptedCount
        },
        recentApplications: applications.slice(0, 5),
        recommendations,
        mentorRequests
      });
    }

    if (role === 'startup') {
      const myOpportunities = await Opportunity.find({ owner: user._id }).lean();
      const oppIds = myOpportunities.map(o => o._id);

      const applications = await Application.find({ opportunity: { $in: oppIds } })
        .populate('applicant', 'name email seekerProfile profileCompletion')
        .populate('opportunity', 'title type')
        .sort({ createdAt: -1 });

      const myIdeas = await Idea.find({ owner: user._id }).lean();
      const myIdeaIds = myIdeas.map(i => i._id);

      const teamRequests = await TeamRequest.find({
        $or: [
          { idea: { $in: myIdeaIds } },
          { user: user._id }
        ]
      })
        .populate('idea', 'title stage')
        .populate('user', 'name email seekerProfile')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        role: 'startup',
        profileCompletion: user.profileCompletion,
        stats: {
          postedOpportunities: myOpportunities.length,
          totalApplicants: applications.length,
          activeIdeas: myIdeas.length,
          pendingTeamRequests: teamRequests.filter(r => r.status === 'pending').length
        },
        recentApplicants: applications.slice(0, 5),
        myOpportunities: myOpportunities.slice(0, 5),
        myIdeas: myIdeas.slice(0, 4),
        teamRequests: teamRequests.slice(0, 4)
      });
    }

    if (role === 'mentor') {
      const requests = await MentorRequest.find({ mentor: user._id })
        .populate('mentee', 'name email role seekerProfile startupProfile entrepreneurProfile profileCompletion')
        .sort({ createdAt: -1 });

      const pendingRequests = requests.filter(r => r.status === 'pending');
      const activeMentees = requests.filter(r => r.status === 'accepted');

      return res.json({
        success: true,
        role: 'mentor',
        profileCompletion: user.profileCompletion,
        stats: {
          totalRequests: requests.length,
          pendingRequestsCount: pendingRequests.length,
          activeMenteesCount: activeMentees.length
        },
        pendingRequests: pendingRequests.slice(0, 6),
        activeMentees: activeMentees.slice(0, 6)
      });
    }

    if (role === 'entrepreneur') {
      const myIdeas = await Idea.find({ owner: user._id })
        .populate('interested', 'name email seekerProfile profileCompletion')
        .sort({ createdAt: -1 })
        .lean();
      const myIdeaIds = myIdeas.map(i => i._id);

      const teamRequests = await TeamRequest.find({
        $or: [
          { idea: { $in: myIdeaIds } },
          { user: user._id }
        ]
      })
        .populate('idea', 'title stage')
        .populate('user', 'name email seekerProfile')
        .sort({ createdAt: -1 });

      const myOpportunities = await Opportunity.find({ owner: user._id }).lean();
      const oppIds = myOpportunities.map(o => o._id);

      const applications = await Application.find({ opportunity: { $in: oppIds } })
        .populate('applicant', 'name email seekerProfile profileCompletion')
        .populate('opportunity', 'title type')
        .sort({ createdAt: -1 });

      const mentorRequests = await MentorRequest.find({ mentee: user._id })
        .populate('mentor', 'name email mentorProfile')
        .sort({ createdAt: -1 })
        .limit(4);

      const totalInterestedCount = myIdeas.reduce((sum, idea) => sum + (idea.interested?.length || 0), 0);

      return res.json({
        success: true,
        role: 'entrepreneur',
        profileCompletion: user.profileCompletion,
        stats: {
          activeVentures: myIdeas.length,
          interestedBuildersCount: totalInterestedCount,
          pendingTeamRequests: teamRequests.filter(r => r.status === 'pending').length,
          mentorConnections: mentorRequests.filter(m => m.status === 'accepted').length,
          postedOpportunities: myOpportunities.length,
          totalApplicants: applications.length
        },
        myIdeas: myIdeas.slice(0, 5),
        teamRequests: teamRequests.slice(0, 5),
        myOpportunities: myOpportunities.slice(0, 5),
        recentApplicants: applications.slice(0, 5),
        mentorRequests
      });
    }

    if (role === 'recruiter') {
      const myOpportunities = await Opportunity.find({ owner: user._id }).lean();
      const oppIds = myOpportunities.map(o => o._id);

      const applications = await Application.find({ opportunity: { $in: oppIds } })
        .populate('applicant', 'name email seekerProfile profileCompletion')
        .populate('opportunity', 'title type')
        .sort({ createdAt: -1 });

      const shortlists = await Shortlist.find({ recruiter: user._id })
        .populate('candidate', 'name email seekerProfile profileCompletion')
        .populate('opportunity', 'title')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        role: 'recruiter',
        profileCompletion: user.profileCompletion,
        stats: {
          activeJobs: myOpportunities.filter(o => o.status === 'open').length,
          totalApplicants: applications.length,
          shortlistedCandidates: shortlists.length
        },
        recentApplicants: applications.slice(0, 6),
        myOpportunities: myOpportunities.slice(0, 5),
        shortlists: shortlists.slice(0, 5)
      });
    }

    // Default fallback
    res.json({
      success: true,
      role,
      profileCompletion: user.profileCompletion,
      stats: {}
    });
  } catch (error) {
    next(error);
  }
}
