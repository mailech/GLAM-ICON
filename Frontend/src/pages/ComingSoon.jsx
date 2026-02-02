
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-4 border border-secondary-500/30 rounded-full text-secondary-500 text-xs font-bold uppercase tracking-[0.3em] mb-8 bg-secondary-500/5 backdrop-blur-sm">
                        Under Construction
                    </span>

                    <h1 className="text-6xl md:text-9xl font-display font-black text-white leading-none tracking-tighter mb-6">
                        COMING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 via-secondary-500 to-secondary-700">SOON</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl font-light mb-12 leading-relaxed">
                        We are crafting something extraordinary. <br className="hidden md:block" />
                        The next chapter of Glam Iconic India is being written.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/" className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-secondary-500 hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Back Home
                        </Link>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Notify Me"
                                className="bg-white/5 border border-white/10 px-6 py-4 w-64 text-white placeholder-white/30 focus:outline-none focus:border-secondary-500 transition-colors"
                            />
                            <button className="absolute right-0 top-0 h-full px-4 text-secondary-500 hover:text-white transition-colors">
                                &rarr;
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-8 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
                Glam Iconic India &copy; 2026
            </div>
        </div>
    );
};

export default ComingSoon;
