import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.scss';
import mediaThumbs from '../pages/MediaThumb';

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

    const NavLink = ({ to, children, mobile = false }) => (
        <Link
            to={to}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={clsx(
                mobile ? styles.mobileLink : styles.navLink,
                isActive(to) && styles.active
            )}
        >
            {children}
        </Link>
    );

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Logo */}
                    <div className={styles.leftSection}>
                        <Link to="/" className={styles.logo}>
                            <div className={styles.logoIcon}>S</div>
                            <span className={styles.logoText}>Smanzy</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className={styles.navDesktop}>
                            <div className={styles.navList}>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/about">About</NavLink>
                                {token && <NavLink to="/profile">Profile</NavLink>}
                                {token && <NavLink to="/media">Media</NavLink>}
                                {token && <NavLink to="/mediathumbs">Media Thumbs</NavLink>}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className={styles.rightSection}>
                        <div className={styles.authList}>
                            <ThemeToggle />
                            {token ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <div className={styles.authList}>
                                    <Link to="/login" className={styles.loginLink}>
                                        Login
                                    </Link>
                                    <Button
                                        onClick={() => navigate('/register')}
                                        size="sm"
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className={styles.mobileBtnWrapper}>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={styles.mobileMenuBtn}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className={styles.mobile}>
                    <div className={styles.mobileContent}>
                        {/* Theme Toggle in Mobile Menu */}
                        <div className={styles.mobileThemeToggle}>
                            <span>Theme</span>
                            <ThemeToggle />
                        </div>
                        <NavLink to="/" mobile>Home</NavLink>
                        <NavLink to="/about" mobile>About</NavLink>
                        {token && (
                            <>
                                <NavLink to="/profile" mobile>Profile</NavLink>
                                <NavLink to="/media" mobile>Media</NavLink>
                                <NavLink to="/mediathumbs" mobile>Media Thumbs</NavLink>
                            </>
                        )}
                        <div className={styles.mobileAuth}>
                            {!token ? (
                                <div className={styles.mobileAuthGrid}>
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
