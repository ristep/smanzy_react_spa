import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const token = localStorage.getItem('token');

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive(to)
                    ? "text-blue-400 bg-blue-500/10 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
            )}
        >
            {children}
        </Link>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                                S
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400 tracking-tight">
                                Smanzy
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/about">About</NavLink>
                                {token && <NavLink to="/profile">Profile</NavLink>}
                                {token && <NavLink to="/media">Media</NavLink>}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {token ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                // className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Button
                                        onClick={() => navigate('/register')}
                                        size="sm"
                                        className="rounded-full px-5"
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            About
                        </Link>
                        {token && (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/media"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Media
                                </Link>
                            </>
                        )}
                        <div className="pt-4 border-t border-white/5 mt-4">
                            {!token ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                                    >
                                        Register
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="danger"
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
