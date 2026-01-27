import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Toggle Theme"
        >
            <div className="relative w-10 h-5 bg-white/10 rounded-full border border-white/10 shadow-inner flex items-center px-0.5">
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={`w-4 h-4 rounded-full shadow-md ${theme === 'dark' ? 'bg-dark-900 translate-x-5' : 'bg-secondary-500 translate-x-0'}`}
                >
                    <div className="w-full h-full flex items-center justify-center text-[10px]">
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </div>
                </motion.div>
            </div>
        </button>
    );
};

export default ThemeToggle;
