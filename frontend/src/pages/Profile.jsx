import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, Building, GraduationCap, Calendar, Save, Loader2, CheckCircle, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location_city: '',
        degree: '',
        specialization: '',
        university: '',
        graduation_year: '',
        experience_years: 0,
        current_company: '',
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/user/profile');
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/auth/user/profile', profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
                <div className="bg-primary-600 p-8 md:p-12 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 text-4xl font-bold">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{profile.first_name} {profile.last_name}</h1>
                            <p className="text-primary-100 mt-1">{profile.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-sm font-medium">
                                <span className="px-3 py-1 bg-white/10 rounded-full">Job Seeker</span>
                                {profile.location_city && (
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {profile.location_city}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 md:p-12 space-y-10 text-left">
                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    )}

                    {/* Basic Info */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-600" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                <input name="first_name" value={profile.first_name} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                                <input name="last_name" value={profile.last_name} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-5 h-5 text-slate-300" />
                                    <input name="phone" value={profile.phone} onChange={handleChange} className="input-field pl-11" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location (City)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-300" />
                                    <input name="location_city" value={profile.location_city} onChange={handleChange} className="input-field pl-11" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-primary-600" />
                            Education & Qualifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Degree</label>
                                <input name="degree" value={profile.degree} onChange={handleChange} className="input-field text-left" placeholder="e.g. B.Tech in CSE" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">University / College</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-2.5 w-5 h-5 text-slate-300" />
                                    <input name="university" value={profile.university} onChange={handleChange} className="input-field pl-11 text-left" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Graduation Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-300" />
                                    <input name="graduation_year" type="number" value={profile.graduation_year} onChange={handleChange} className="input-field pl-11 text-left" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Experience & Skills */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-left">
                            <Building className="w-5 h-5 text-primary-600" />
                            Professional Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Years of Experience</label>
                                <input name="experience_years" type="number" value={profile.experience_years} onChange={handleChange} className="input-field text-left" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Current Company</label>
                                <input name="current_company" value={profile.current_company} onChange={handleChange} className="input-field text-left" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Technical Skills</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Array.isArray(profile.skills) && profile.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-bold flex items-center gap-2">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-800">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="input-field max-w-xs text-left"
                                    placeholder="Add a skill (e.g. React)"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full btn-primary py-4 text-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary-200"
                    >
                        {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                <Save className="w-6 h-6" />
                                Save Profile Changes
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
