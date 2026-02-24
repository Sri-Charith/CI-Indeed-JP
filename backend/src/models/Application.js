const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume_url: {
        type: String,
        required: true // Snapshot copy as requested
    },
    cover_letter: String,
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'rejected', 'interview', 'hired'],
        default: 'applied'
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate applications for the same job by the same user
applicationSchema.index({ job_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
