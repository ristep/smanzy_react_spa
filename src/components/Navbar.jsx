import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // TODO: Add real auth state
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                isActive(to)
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
            )}
        >
            {children}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                                S
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Smanzy
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/about">About</NavLink>
                                {token && <NavLink to="/profile">Profile</NavLink>}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {token ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="flex space-x-3">
                                    <Link
                                        to="/login"
                                        className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-slate-950">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">Home</Link>
                        <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">About</Link>
                        {token && (
                            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">Profile</Link>
                        )}
                        {!token && (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
