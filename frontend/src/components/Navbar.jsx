import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, ArrowUpRight } from 'lucide-react';
import logo from '../logo-centennial.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Jobs', path: '/jobs' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`glass px-6 rounded-2xl transition-all duration-500 ${isScrolled ? 'shadow-premium bg-white/90' : 'bg-white/40 border-transparent'}`}>
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center group space-x-3">
                                <img src={logo} alt="Centennial Talent Solutions" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                                <span className="text-xl font-black tracking-tight text-slate-900 hidden sm:block">Centennial <span className="text-primary-600">Talent Solutions</span></span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative text-sm font-bold tracking-tight transition-colors duration-300 ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600 rounded-full" />
                                    )}
                                </Link>
                            ))}

                            {token ? (
                                <div className="flex items-center space-x-6">
                                    {role === 'admin' ? (
                                        <Link to="/admin/dashboard" className="text-sm font-bold text-slate-600 hover:text-primary-600">Admin</Link>
                                    ) : (
                                        <>
                                            <Link to="/profile" className="text-sm font-bold text-slate-600 hover:text-primary-600">Profile</Link>
                                            <Link to="/applications" className="text-sm font-bold text-slate-600 hover:text-primary-600">Applications</Link>
                                        </>
                                    )}
                                    <div className="h-4 w-[1px] bg-slate-200" />
                                    <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors group">
                                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary-600 px-4">Login</Link>
                                    <Link to="/signup" className="btn-premium btn-premium-primary !py-2 !px-6 !text-sm group">
                                        Join Now
                                        <ArrowUpRight className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-24 left-4 right-4 z-50">
                    <div className="glass rounded-2xl p-6 space-y-4 shadow-2xl">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-lg font-bold text-slate-600 hover:text-primary-600"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-[1px] bg-slate-100" />
                        {token ? (
                            <>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-base font-bold text-slate-600">Profile</Link>
                                <button onClick={handleLogout} className="text-red-500 font-bold">Logout</button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center p-3 font-bold text-slate-600 border border-slate-200 rounded-xl">Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center p-3 font-bold text-white bg-primary-600 rounded-xl">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
