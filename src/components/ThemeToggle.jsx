import { Sun, Moon, Coffee } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const getNextTheme = () => {
        if (theme === 'light') return 'dark';
        if (theme === 'dark') return 'coffee';
        return 'light';
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group"
            aria-label={`Switch to ${getNextTheme()} mode`}
            title={`Switch to ${getNextTheme()} mode`}
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 transition-all duration-300 ${theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }`}
                    size={20}
                />
                <Moon
                    className={`absolute inset-0 transition-all duration-300 ${theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                        }`}
                    size={20}
                />
                <Coffee
                    className={`absolute inset-0 transition-all duration-300 ${theme === 'coffee'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }`}
                    size={20}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
