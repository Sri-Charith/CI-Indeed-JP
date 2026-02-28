import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    Loader2,
    ArrowLeft,
    Globe,
    Clock,
    ShieldCheck,
    Building2,
    Users,
    CheckCircle2,
    Send,
    X,
    FileText,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Application state
    const [showModal, setShowModal] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        resume_url: '',
        cover_letter: '',
        degree: '',
        branch: '',
        university: '',
        experience_years: '',
        current_company: ''
    });
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState('');

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApplyClick = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (role !== 'user') {
            alert('Only job seekers can apply for jobs.');
            return;
        }

        // Pre-fill form with profile data
        try {
            const { data } = await api.get('/auth/user/profile');
            setApplicationForm(prev => ({
                ...prev,
                resume_url: data.resume_url || '',
                degree: data.degree || '',
                branch: data.branch || '',
                university: data.university || '',
                experience_years: data.experience_years || '',
                current_company: data.current_company || ''
            }));
        } catch (err) {
            console.error('Could not fetch profile for pre-fill', err);
        }

        setShowModal(true);
        setApplyError('');
        setApplySuccess('');
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        setApplying(true);
        setApplyError('');
        try {
            await api.post('/applications', {
                job_id: job._id,
                ...applicationForm
            });
            setApplySuccess('Application submitted successfully!');
            setTimeout(() => {
                setShowModal(false);
                setApplicationForm({
                    resume_url: '',
                    cover_letter: '',
                    degree: '',
                    branch: '',
                    university: '',
                    experience_years: '',
                    current_company: ''
                });
            }, 2000);
        } catch (err) {
            setApplyError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Job Excellence...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-premium max-w-md border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <X className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Oops! Job Not Found</h2>
                    <p className="text-slate-500 mb-8 font-medium">{error || "The job listing you're looking for might have been removed or expired."}</p>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="btn-premium btn-premium-primary w-full"
                    >
                        Browse Other Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Listings
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-8 md:p-12 rounded-[3rem] shadow-premium relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${job.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <Building2 className="w-12 h-12 text-primary-600" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-2">
                                        {job.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        <p className="text-primary-600 font-black text-lg">{job.company_name}</p>
                                        <span className="text-slate-300 hidden md:inline">•</span>
                                        <p className="text-slate-500 font-bold flex items-center capitalize">
                                            <Briefcase className="w-4 h-4 mr-2" />
                                            {job.job_type.replace('-', ' ')}
                                        </p>
                                        <span className="text-slate-300 hidden md:inline">•</span>
                                        <p className="text-slate-400 text-sm font-medium flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Posted {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                                <FileText className="w-6 h-6 mr-3 text-primary-600" />
                                Job Overview
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                    {job.description}
                                </p>
                            </div>

                            {job.requirements && (
                                <div className="mt-12 pt-12 border-t border-slate-100">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                                        <CheckCircle2 className="w-6 h-6 mr-3 text-primary-600" />
                                        Requirements
                                    </h3>
                                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                        {job.requirements}
                                    </p>
                                </div>
                            )}

                            {job.responsibilities && (
                                <div className="mt-12 pt-12 border-t border-slate-100">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                                        <Zap className="w-6 h-6 mr-3 text-primary-600" />
                                        Responsibilities
                                    </h3>
                                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                        {job.responsibilities}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar / Info Panel */}
                    <div className="space-y-8">
                        {/* Compensation & Location Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100"
                        >
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 text-left">Key Highlights</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-left">Annual Compensation</p>
                                        <p className="text-2xl font-black text-slate-900">
                                            ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-left">Primary Location</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            {job.location_city}, {job.country}
                                        </p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {job.work_mode}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-left">Minimum Experience</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            {job.experience_required} Year{job.experience_required !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 text-left">Total Openings</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            {job.openings_count} Position{job.openings_count !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleApplyClick}
                                disabled={job.status !== 'open'}
                                className={`w-full btn-premium ${job.status === 'open' ? 'btn-premium-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} py-5 mt-10 shadow-xl shadow-primary-200`}
                            >
                                {job.status === 'open' ? 'Apply Now' : 'Application Closed'}
                            </button>
                        </motion.div>

                        {/* Company Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-left">Hiring Company</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                    <Building2 className="w-6 h-6 text-accent-cyan" />
                                </div>
                                <div>
                                    <p className="font-black text-xl leading-none">{job.company_name}</p>
                                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Centennial Partner</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex items-center text-sm text-slate-300 font-medium">
                                    <ShieldCheck className="w-4 h-4 mr-3 text-accent-cyan" />
                                    Verified Employer
                                </div>
                                <div className="flex items-center text-sm text-slate-300 font-medium text-left">
                                    <Globe className="w-4 h-4 mr-3 text-accent-cyan" />
                                    Global Recruitment via Centennial
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Application Modal (Same as Jobs.jsx) */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Apply to Position</h2>
                                    <p className="text-primary-600 font-bold text-sm uppercase">{job.title}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleApplicationSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                                {applyError && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center">
                                        <X className="w-4 h-4 mr-2" />
                                        {applyError}
                                    </div>
                                )}
                                {applySuccess && (
                                    <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-medium flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        {applySuccess}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-left">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Highest Degree</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Master in CS"
                                            value={applicationForm.degree}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, degree: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Branch / Dept</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="e.g. Computer Science"
                                            value={applicationForm.branch}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, branch: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">University</label>
                                        <input
                                            required
                                            className="input-field text-left py-2 px-3"
                                            placeholder="University Name"
                                            value={applicationForm.university}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, university: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Years of Experience</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-field text-left py-2 px-3"
                                            placeholder="0"
                                            value={applicationForm.experience_years}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, experience_years: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-left md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current/Last Company</label>
                                        <input
                                            className="input-field text-left py-2 px-3"
                                            placeholder="Company Name"
                                            value={applicationForm.current_company}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, current_company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Resume URL</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            className="input-field pl-11 py-2 px-3 text-left"
                                            placeholder="https://link-to-your-resume.pdf"
                                            value={applicationForm.resume_url}
                                            onChange={(e) => setApplicationForm({ ...applicationForm, resume_url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cover Letter (Optional)</label>
                                    <textarea
                                        rows="3"
                                        className="input-field resize-none py-2 px-3 text-left"
                                        placeholder="Why should we hire you?"
                                        value={applicationForm.cover_letter}
                                        onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={applying || applySuccess}
                                    className="w-full btn-premium btn-premium-primary py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
                                >
                                    {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <span>Submit Application</span>
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetail;
