const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password_hash: { type: String, required: true },
    location_city: String,
    location_state: String,
    country: String,
    degree: String,
    specialization: String,
    university: String,
    graduation_year: Number,
    experience_years: { type: Number, default: 0 },
    current_company: String,
    current_salary: Number,
    expected_salary: Number,
    resume_url: String,
    linkedin_url: String,
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
