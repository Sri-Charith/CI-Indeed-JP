const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/User
exports.applyToJob = async (req, res) => {
    try {
        const { job_id, resume_url, cover_letter } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(job_id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.status !== 'open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }

        // Check for existing application
        const alreadyApplied = await Application.findOne({
            job_id,
            user_id: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job_id,
            user_id: req.user._id,
            resume_url,
            cover_letter
        });

        res.status(201).json(application);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate application detected' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private/User
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user_id: req.user._id })
            .populate({
                path: 'job_id',
                select: 'title company_name location_city status'
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a specific job (for Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
exports.getJobApplications = async (req, res) => {
    try {
        // Optional: Verify if this admin owns the job
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const applications = await Application.find({ job_id: req.params.jobId })
            .populate('user_id', 'first_name last_name email phone location_city degree specialization experience_years')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'interview', 'hired'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id);

        if (application) {
            application.status = status;
            const updatedApplication = await application.save();
            res.json(updatedApplication);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get details of a specific application
// @route   GET /api/applications/:id
// @access  Private (User or Admin)
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job_id')
            .populate('user_id', '-password_hash');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Authorization check: either the user who applied or an admin can view
        if (req.role !== 'admin' && application.user_id._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
