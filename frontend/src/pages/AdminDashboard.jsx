import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Briefcase, Users, Eye, Edit, Trash2, Loader2, X, MapPin, DollarSign, Clock, GraduationCap, Phone, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        description: '',
        company_name: '',
        location_city: '',
        salary_min: '',
        salary_max: '',
        job_type: 'full-time',
        work_mode: 'onsite',
        status: 'open'
    });
    const [editingJob, setEditingJob] = useState(null);

    const fetchAdminJobs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/jobs/admin/all');
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch admin jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob._id}`, formData);
            } else {
                await api.post('/jobs', formData);
            }
            setShowModal(false);
            setEditingJob(null);
            fetchAdminJobs();
            setFormData({
                job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
                title: '',
                description: '',
                company_name: '',
                location_city: '',
                salary_min: '',
                salary_max: '',
                job_type: 'full-time',
                work_mode: 'onsite',
                status: 'open'
            });
        } catch (err) {
            alert(editingJob ? 'Failed to update job' : 'Failed to post job');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            job_id: job.job_id,
            title: job.title,
            description: job.description,
            company_name: job.company_name,
            location_city: job.location_city,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            job_type: job.job_type,
            work_mode: job.work_mode,
            status: job.status
        });
        setShowModal(true);
    };

    const deleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job listing?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            fetchAdminJobs();
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const [showAppsModal, setShowAppsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchApplications = async (jobId) => {
        setAppsLoading(true);
        setSelectedJobId(jobId);
        setShowAppsModal(true);
        try {
            const { data } = await api.get(`/applications/job/${jobId}`);
            setApplications(data);
            console.log('Fetched applications:', data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setAppsLoading(false);
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            setApplications(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-lg text-slate-500 mt-2">Manage your job listings and track applications</p>
                </div>
                <button
                    onClick={() => {
                        setEditingJob(null);
                        setFormData({
                            job_id: `JOB${Math.floor(1000 + Math.random() * 9000)}`,
                            title: '',
                            description: '',
                            company_name: '',
                            location_city: '',
                            salary_min: '',
                            salary_max: '',
                            job_type: 'full-time',
                            work_mode: 'onsite',
                            status: 'open'
                        });
                        setShowModal(true);
                    }}
                    className="btn-primary py-4 px-8 flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
                >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg font-bold">Post New Job</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Active Listings', value: jobs.filter(j => j.status === 'open').length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Candidates', value: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Time to Hire', value: '12d', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6"
                    >
                        <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading your dashbord...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Job Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Posted On</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 text-left">
                                            <Link to={`/jobs/${job._id}`} className="hover:text-primary-600 transition-colors">
                                                <p className="font-bold text-slate-900">{job.title}</p>
                                            </Link>
                                            <p className="text-sm text-slate-400">{job.job_id}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'open' ? 'bg-green-100 text-green-600' :
                                                job.status === 'closed' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium capitalize">{job.job_type.replace('-', ' ')}</p>
                                            <p className="text-xs text-slate-400 capitalize">{job.work_mode}</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => fetchApplications(job._id)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all shadow-sm flex items-center gap-1"
                                                    title="View Applications"
                                                >
                                                    <Users className="w-5 h-5" />
                                                    <span className="text-xs font-bold">{job.applicationCount || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(job)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                                    title="Edit Job"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => deleteJob(job._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {jobs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-400 text-left">No jobs posted yet. Start by creating your first listing!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Job Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <h2 className="text-2xl font-bold text-slate-900">{editingJob ? 'Edit Job' : 'Post a Job'}</h2>
                                <button onClick={() => {
                                    setShowModal(false);
                                    setEditingJob(null);
                                }} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 text-left">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Job ID</label>
                                        <input className="input-field bg-slate-50" value={formData.job_id} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Job Title</label>
                                        <input name="title" required className="input-field" placeholder="Senior Product Designer" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                                        <input name="company_name" required className="input-field" placeholder="TechFlow Inc." onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-300" />
                                            <input name="location_city" required className="input-field pl-11" placeholder="San Francisco, CA" onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Min Salary ($)</label>
                                        <input name="salary_min" type="number" required className="input-field" placeholder="80000" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Max Salary ($)</label>
                                        <input name="salary_max" type="number" required className="input-field" placeholder="120000" onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Job Type</label>
                                        <select name="job_type" className="input-field appearance-none" onChange={handleChange}>
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Work Mode</label>
                                        <select name="work_mode" value={formData.work_mode} className="input-field appearance-none" onChange={handleChange}>
                                            <option value="onsite">On-site</option>
                                            <option value="remote">Remote</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                {editingJob && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Job Status</label>
                                        <select name="status" value={formData.status} className="input-field appearance-none" onChange={handleChange}>
                                            <option value="open">Open</option>
                                            <option value="closed">Closed</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left">Description</label>
                                    <textarea name="description" required rows="4" className="input-field resize-none" placeholder="Break down the role, requirements, and benefits..." onChange={handleChange}></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-2 shadow-2xl shadow-primary-200"
                                >
                                    {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{editingJob ? 'Update Job Listing' : 'Publish Job Listing'}</span>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Applications Modal */}
            <AnimatePresence>
                {showAppsModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                                <h2 className="text-2xl font-bold text-slate-900">Applicants</h2>
                                <button onClick={() => setShowAppsModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-700">Total Candidacies: {applications.length}</h3>
                                    <button
                                        onClick={() => fetchApplications(selectedJobId)}
                                        className="p-2 bg-white text-primary-600 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-bold"
                                    >
                                        <Loader2 className={`w-4 h-4 ${appsLoading ? 'animate-spin' : ''}`} />
                                        Refresh Data
                                    </button>
                                </div>
                                {appsLoading && applications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((app) => (
                                            <div key={app._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 text-left">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                        {app.user_id?.first_name?.[0]}{app.user_id?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 uppercase tracking-tight">{app.user_id?.first_name} {app.user_id?.last_name}</h3>
                                                        <p className="text-sm text-slate-500">{app.user_id?.email}</p>
                                                        <div className="flex gap-3 mt-2 text-xs font-medium text-slate-400">
                                                            <span>Experience: {app.experience_years || app.user_id?.experience_years} years</span>
                                                            <span>•</span>
                                                            <span>{app.degree || app.user_id?.degree}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between items-end gap-3 min-w-[200px]">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedUser(app.user_id);
                                                                setShowProfileModal(true);
                                                            }}
                                                            className="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100"
                                                        >
                                                            View Full Profile
                                                        </button>
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => updateStatus(app._id, e.target.value)}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none cursor-pointer ${app.status === 'hired' ? 'bg-green-100 text-green-600' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                    'bg-blue-100 text-blue-600'
                                                                }`}
                                                        >
                                                            <option value="applied">Applied</option>
                                                            <option value="shortlisted">Shortlisted</option>
                                                            <option value="interview">Interview</option>
                                                            <option value="hired">Hired</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <a
                                                            href={app.resume_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-primary-600 text-sm font-bold hover:underline flex items-center gap-1"
                                                        >
                                                            <FileText className="w-4 h-4" /> CV
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {applications.length === 0 && (
                                            <div className="text-center py-10 text-slate-400 italic">No one has applied for this job yet.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detailed User Profile Modal */}
            <AnimatePresence>
                {showProfileModal && selectedUser && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-left"
                        >
                            <div className="bg-primary-600 p-8 text-white relative">
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 text-3xl font-bold">
                                        {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedUser.first_name} {selectedUser.last_name}</h2>
                                        <p className="text-primary-100">{selectedUser.email}</p>
                                        <p className="text-sm mt-2 opacity-80 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {selectedUser.location_city || 'Location Not Specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary-600" />
                                        Education
                                    </h3>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">{selectedUser.degree || 'No Degree Listed'}</p>
                                        <p className="text-sm text-slate-600">{selectedUser.university}</p>
                                        {selectedUser.graduation_year && (
                                            <p className="text-xs text-slate-400 mt-1">Class of {selectedUser.graduation_year}</p>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary-600" />
                                        Work Experience
                                    </h3>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">{selectedUser.experience_years} Years of Experience</p>
                                        <p className="text-sm text-slate-600">Current: {selectedUser.current_company || 'Not Specified'}</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary-600" />
                                        Technical Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.skills && selectedUser.skills.length > 0 ? (
                                            selectedUser.skills.map((s, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                                                    {s.skill_name || s}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No skills listed</p>
                                        )}
                                    </div>
                                </section>

                                <div className="pt-4 border-t border-slate-100 flex gap-4">
                                    <a
                                        href={`tel:${selectedUser.phone}`}
                                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 rounded-xl text-sm"
                                    >
                                        <Phone className="w-4 h-4" /> Phone
                                    </a>
                                    <a
                                        href={`mailto:${selectedUser.email}`}
                                        className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all font-bold py-3 flex items-center justify-center gap-2 rounded-xl text-sm"
                                    >
                                        <Mail className="w-4 h-4" /> Email
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
