import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Phone, Lock, Sparkles, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../logo-centennial.png';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';
    const [role, setRole] = useState(initialRole); // 'user' (Job Seeker) or 'admin' (Recruiter)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = role === 'admin' ? '/auth/admin/signup' : '/auth/user/signup';

            // For admin, we need 'name' field, so merge first and last name
            const payload = role === 'admin'
                ? { name: `${formData.first_name} ${formData.last_name}`, email: formData.email, password: formData.password }
                : formData;

            const { data } = await api.post(endpoint, payload);

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', data.name);

            navigate(role === 'admin' ? '/admin/dashboard' : '/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 flex flex-col items-center">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full relative z-10"
            >
                <div className="grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100">
                    {/* Left Panel: Brand & Motivation */}
                    <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-blue text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-cyan rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <Link to="/">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-12 border border-white/20">
                                    <Sparkles className="w-10 h-10 text-accent-cyan" />
                                </div>
                            </Link>
                            <h2 className="text-5xl font-black mb-6 leading-[1.1] tracking-tighter">
                                {role === 'user' ? 'Launch your career to new heights' : 'Build a world-class engineering team'}
                            </h2>
                            <p className="text-white/80 text-lg mb-12 leading-relaxed font-medium">
                                {role === 'user'
                                    ? "Join Centennial Talent Solutions' elite network of tech professionals and get hired by global innovators."
                                    : "Connect with pre-vetted senior talent and streamline your entire hiring pipeline with AI."}
                            </p>

                            <div className="space-y-6">
                                {(role === 'user'
                                    ? ["Personalized AI job matching", "Direct outreach from top firms", "Real-time application tracking"]
                                    : ["Access to pre-vetted talent", "Smart applicant ranking", "Automated interview scheduling"]
                                ).map((text, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="w-6 h-6 bg-accent-cyan text-primary-900 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-white/90">{text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                            <p className="text-white/60 text-sm font-bold uppercase tracking-widest leading-none">Powered by</p>
                            <span className="text-xl font-black text-white mt-2 block">Centennial <span className="text-accent-cyan">Talent Solutions</span></span>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="p-8 md:p-16">
                        <div className="mb-10 flex flex-col items-center lg:items-start">
                            <Link to="/" className="lg:hidden mb-8">
                                <img src={logo} alt="Centennial Talent Solutions" className="h-14 w-auto drop-shadow-lg" />
                            </Link>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 mt-2 font-medium">Enter your details to get started</p>
                        </div>

                        <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl mb-10 border border-slate-200/50">
                            <button
                                onClick={() => setRole('user')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'user' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Job Seeker
                            </button>
                            <button
                                onClick={() => setRole('admin')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'admin' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Recruiter
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-bold">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">First Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            name="first_name"
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="Jane"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Last Name</label>
                                    <input
                                        name="last_name"
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                        placeholder="Doe"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                        placeholder="jane@example.com"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 ${role === 'user' ? 'md:grid-cols-2' : ''} gap-6`}>
                                {role === 'user' && (
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                name="phone"
                                                required
                                                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                                placeholder="+91..."
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                            placeholder="••••••••"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium btn-premium-primary py-5 mt-4 group"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Start My Journey</span>}
                            </button>
                        </form>

                        <p className="mt-10 text-center text-slate-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-black hover:text-accent-blue transition-colors underline decoration-2 underline-offset-4">Log in</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;

