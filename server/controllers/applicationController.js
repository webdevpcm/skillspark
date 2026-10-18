import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';

export async function applyToOpportunity(req, res, next) {
  try {
    const { opportunityId, coverNote } = req.body;

    if (!opportunityId) {
      return res.status(400).json({ success: false, message: 'opportunityId is required' });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This opportunity is closed for applications' });
    }

    // Check if applicant already applied
    const existing = await Application.findOne({
      opportunity: opportunityId,
      applicant: req.user._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this opportunity'
      });
    }

    const application = new Application({
      opportunity: opportunityId,
      applicant: req.user._id,
      coverNote: (coverNote || '').trim(),
      status: 'Submitted'
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this opportunity' });
    }
    next(error);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'opportunity',
        populate: { path: 'owner', select: 'name email startupProfile recruiterProfile' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
}

export async function getOpportunityApplications(req, res, next) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Check ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this opportunity' });
    }

    const applications = await Application.find({ opportunity: req.params.id })
      .populate('applicant', 'name email seekerProfile profileCompletion')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      opportunityTitle: opportunity.title,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowed.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('opportunity');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check ownership of the opportunity
    if (application.opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this opportunity' });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    next(error);
  }
}
