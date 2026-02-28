import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../logo-centennial.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/user/login';
            const { data } = await api.post(endpoint, { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', data.name);

            navigate(role === 'admin' ? '/admin/dashboard' : '/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 flex flex-col items-center">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-8">
                        <img src={logo} alt="Centennial Talent Solutions" className="h-20 w-auto drop-shadow-xl" />
                    </Link>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-3 font-medium">Log in to your account with Centennial Talent Solutions</p>
                </div>

                <div className="glass shadow-premium rounded-[2.5rem] p-10 relative overflow-hidden">
                    {/* Subtle Gradient Accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-blue"></div>

                    <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl mb-8 border border-slate-200/50">
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
                            className="mb-6 flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                    <Mail className="w-5 h-5 " />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-primary-600 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all duration-300 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-premium btn-premium-primary py-4 group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="flex items-center space-x-2">
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-slate-500 font-medium">
                            First time here?{' '}
                            <Link to="/signup" className="text-primary-600 font-black hover:text-accent-blue transition-colors underline decoration-2 underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
