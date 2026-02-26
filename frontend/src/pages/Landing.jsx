import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    ArrowRight,
    Briefcase,
    Users,
    Zap,
    Search,
    FileText,
    Cpu,
    Star,
    ChevronRight,
    Globe,
    ShieldCheck
} from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import aiMatching from '../assets/ai-matching.png';
import recruiterView from '../assets/recruiter-view.png';

import logo from '../logo-centennial.png';

const StatCard = ({ value, label, index }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            controls.start({ opacity: 1, scale: 1 });
        }
    }, [controls, inView]);

    const boxColors = [
        'bg-primary-500 text-white',
        'bg-accent-blue text-white',
        'bg-slate-900 text-white'
    ];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className={`flex flex-col items-center p-8 rounded-3xl shadow-premium ${boxColors[index % 3]} transform transition-transform hover:scale-105 duration-300`}
        >
            <div className="text-4xl md:text-5xl font-black mb-2">{value}</div>
            <div className="text-white/80 font-bold uppercase tracking-widest text-[10px] text-center">{label}</div>
        </motion.div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay }}
        whileHover={{ translateY: -8 }}
        className="glass p-8 rounded-3xl group"
    >
        <div className="w-14 h-14 bg-primary-100 rounded-2xl mb-8 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-glow">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

const Landing = () => {
    return (
        <div className="overflow-x-hidden pt-16">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
                {/* Visual Background - Clear and unobstructed */}
                <div className="absolute top-0 right-[-5%] w-[60%] h-full z-0 pointer-events-none">
                    <img
                        src={heroBg}
                        alt="Network Visual"
                        className="w-full h-full object-contain animate-float opacity-100"
                    />
                </div>

                {/* Glow effects pushed further back */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[150px] z-[-1]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[150px] z-[-1]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-10"
                        >
                            <img src={logo} alt="Centennial Infotech Logo" className="h-28 md:h-36 w-auto drop-shadow-2xl" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-primary-700 text-sm font-bold mb-8 shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                            <span>The Future of Tech Recruitment is Here</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter"
                        >
                            Connect with <br />
                            <span className="text-gradient">Elite Talent</span> <br />
                            Instantly.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium"
                        >
                            AI-driven hiring platform by Centennial Infotech.
                            Skip the noise and find your perfect match in minutes, not months.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Link to="/jobs" className="w-full sm:w-auto btn-premium btn-premium-primary text-lg px-10 group">
                                Explore Careers
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/signup" className="w-full sm:w-auto btn-premium btn-premium-outline text-lg px-10">
                                Hire Top Talent
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Bar - Color Boxes */}
            <section className="py-20 bg-slate-50 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard value="30 Yrs" label="Of Domain Experience" index={0} />
                        <StatCard value="180+" label="Successful Projects" index={1} />
                        <StatCard value="2700+" label="Satisfied Clients" index={2} />
                    </div>
                </div>
            </section>

            {/* AI Features Section */}
            <section className="py-32 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="absolute inset-0 bg-primary-400/20 blur-[100px] rounded-full"></div>
                            <img src={aiMatching} alt="AI Matching" className="relative z-10 w-full rounded-[3rem] shadow-premium" />
                            <div className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl shadow-2xl z-20 animate-float max-w-[240px]">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Cpu className="text-primary-600 w-6 h-6" />
                                    <span className="font-bold text-sm">Smart Analysis</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">AI cross-references 50+ skills and cultural markers for perfect team fit.</p>
                            </div>
                        </motion.div>

                        <div className="lg:w-1/2">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-600 mb-6">Cutting Edge Tech</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Everything you need to <br /><span className="text-gradient">Automate</span> your hiring</h3>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: Zap,
                                        title: "Predictive Matching",
                                        desc: "Our AI doesn't just look at keywords. It analyzes career trajectories and project portfolios."
                                    },
                                    {
                                        icon: Search,
                                        title: "Instant Sourcing",
                                        desc: "Instantly source candidates from our exclusive network of pre-vetted senior developers."
                                    },
                                    {
                                        icon: FileText,
                                        title: "Resume Intelligence",
                                        desc: "Extract meaningful insights from resumes instantly, from tech stack depths to growth potential."
                                    }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="flex items-start space-x-6"
                                    >
                                        <div className="mt-1 flex-shrink-0 w-12 h-12 glass rounded-xl flex items-center justify-center text-primary-600">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* recruiter view section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <FeatureCard
                            icon={Globe}
                            title="Global Outreach"
                            desc="Hire from anywhere. We handle the compliance and localized technical assessment for 50+ countries."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Pre-Vetted Network"
                            desc="Every candidate undergoes a rigorous multi-stage technical and soft-skill verification process."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="AI Screening"
                            desc="Slash your time-to-hire by 70%. Our AI screens initial interviews so you only meet the top 2%."
                            delay={0.3}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center relative"
                    >
                        <div className="p-12 lg:p-20 lg:w-3/5">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-primary-400 text-xs font-bold mb-8">
                                <Users className="w-4 h-4" />
                                <span>Recruiter Dashboard</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Stay in control of your <span className="text-accent-cyan">hiring pipeline</span></h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">Manage thousands of applications with ease. Our dashboard provides real-time insights into candidate engagement and hiring metrics.</p>
                            <Link to="/signup" className="btn-premium btn-premium-primary !bg-white !text-slate-900 shadow-xl group">
                                Start Hiring Now
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="lg:w-2/5 h-full relative border-l border-white/5">
                            <img src={recruiterView} alt="Dashboard View" className="w-full h-full object-cover opacity-80" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-600 mb-6">Wall of Trust</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Loved by teams worldwide</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Alex Rivet",
                                role: "VP of Engineering, CloudScale",
                                text: "Centennial reduced our time-to-hire by 60%. The AI matching is scary accurate.",
                                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                            },
                            {
                                name: "Sarah J. Mills",
                                role: "Talent Acquisition, InnovateHQ",
                                text: "The cleanest UI I've used in HR tech. Candidates love the seamless application flow.",
                                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
                            },
                            {
                                name: "Marcus Thorne",
                                role: "Lead Developer, MetaSync",
                                text: "As a candidate, finding roles that actually match my stack was always a nightmare. This changed everything.",
                                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass p-8 rounded-[2rem]"
                            >
                                <div className="flex items-center space-x-1 text-accent-blue mb-6">
                                    {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-slate-600 font-medium italic mb-8 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center space-x-4">
                                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <div className="font-bold text-slate-900 leading-none">{t.name}</div>
                                        <div className="text-slate-400 text-xs mt-1">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="glass-dark rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group shadow-glow"
                    >
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

                        <div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter"
                            >
                                Ready to build the <br /> <span className="text-accent-cyan">Next Big Thing?</span>
                            </motion.h2>
                            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium">Join 50k+ developers and 500+ companies shaping the future of technology.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/signup" className="w-full sm:w-auto btn-premium btn-premium-primary !px-12 !py-5 text-xl">
                                    Get Started for Free
                                </Link>
                                <Link to="/jobs" className="flex items-center text-white font-bold hover:text-accent-cyan transition-colors">
                                    Explore all openings <ChevronRight className="ml-1 w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div>
                            <div className="flex items-center space-x-2 mb-6 justify-center md:justify-start">
                                <span className="text-2xl font-black tracking-tight text-slate-900">Centennial <span className="text-primary-600">Infotech</span></span>
                            </div>
                            <p className="text-slate-400 max-w-xs font-medium">Empowering the world's best tech teams with intelligent recruitment solutions.</p>
                        </div>

                        <div className="flex flex-wrap gap-12">
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Product</h4>
                                <ul className="text-slate-500 space-y-2 text-sm font-bold">
                                    <li><Link to="/jobs" className="hover:text-primary-600">Find Jobs</Link></li>
                                    <li><Link to="/signup" className="hover:text-primary-600">Hire Talent</Link></li>
                                    <li><a href="#" className="hover:text-primary-600">AI Screening</a></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Contact Us</h4>
                                <ul className="text-slate-500 space-y-3 text-sm font-bold">
                                    <li className="flex items-center group">
                                        <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-600 group-hover:text-white transition-all">
                                            <span className="text-xs">WA</span>
                                        </div>
                                        <a href="https://wa.me/918146511568" className="hover:text-primary-600 transition-colors">+91 81465 11568</a>
                                    </li>
                                    <li className="flex items-center group">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <span className="text-xs">@</span>
                                        </div>
                                        <a href="mailto:support@centennialinfotech.com" className="hover:text-primary-600 transition-colors">support@centennialinfotech.com</a>
                                    </li>
                                    <li className="flex items-center group">
                                        <div className="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <span className="text-xs">PH</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <a href="tel:+9101723596492" className="hover:text-primary-600 transition-colors">+91-01723596492</a>
                                            <a href="tel:+918146511568" className="hover:text-primary-600 transition-colors">+91-81465 11568</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-bold gap-4">
                        <p>© 2026 Centennial Infotech. Built with ❤️ in the future.</p>
                        <div className="flex items-center space-x-6 uppercase tracking-widest">
                            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Discord</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
