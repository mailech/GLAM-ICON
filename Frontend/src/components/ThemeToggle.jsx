import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="group relative w-14 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner transition-all hover:bg-white/10 focus:outline-none overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className={`absolute inset-0 flex items-center justify-between px-2 cursor-pointer transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
                {/* Stars Background for Dark Mode */}
                <span className="text-[8px]">✨</span>
            </div>

            <motion.div
                className="w-full h-full flex items-center px-1"
                animate={{
                    justifyContent: isDark ? 'flex-end' : 'flex-start'
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`
                        w-6 h-6 rounded-full shadow-lg flex items-center justify-center relative z-10
                        ${isDark ? 'bg-zinc-800 text-amber-300 border border-white/10' : 'bg-gradient-to-tr from-amber-300 to-amber-500 text-white'}
                    `}
                >
                    <motion.div
                        key={isDark ? 'moon' : 'sun'}
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white drop-shadow-sm">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                            </svg>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
