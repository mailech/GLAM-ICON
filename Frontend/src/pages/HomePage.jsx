
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const textParallax = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    return (
        <div ref={containerRef} className="bg-black text-white overflow-x-hidden font-sans selection:bg-secondary-500 selection:text-black">

            {/* --- HERO SECTION: CINEMATIC RUNWAY --- */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Background Image - The Desert Runway */}
                <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1574950578143-858c6fc58922?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Runway in Nature"
                        className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                </motion.div>

                {/* Content - Bottom Aligned & Elegant */}
                <div className="relative z-20 h-full flex flex-col justify-end items-center pb-24 px-6">
                    <motion.div style={{ y: textParallax }} className="text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-amber-200 font-sans font-bold uppercase tracking-[0.4em] text-xs md:text-sm mb-6 drop-shadow-md"
                        >
                            The Official Platform
                        </motion.p>

                        <h1 className="flex flex-col items-center">
                            <span className="text-6xl sm:text-8xl md:text-[9rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_10px_rgba(251,191,36,0.2)] leading-[0.85]">
                                GLAM ICONIC
                            </span>
                            <span className="text-3xl sm:text-5xl md:text-7xl font-display font-light text-white tracking-[0.3em] md:tracking-[0.5em] mt-4 md:mt-6 drop-shadow-lg">
                                INDIA
                            </span>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12"
                        >
                            <Link to="/register" className="relative group inline-block px-14 py-4 bg-transparent overflow-hidden">
                                <div className="absolute inset-0 border border-amber-300/50 group-hover:border-amber-400 transition-colors duration-300"></div>
                                <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-sm group-hover:bg-amber-500/20 transition-colors duration-300"></div>
                                <div className="absolute inset-0 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-[400ms] ease-out group-hover:w-full opacity-20"></div>
                                <span className="relative text-amber-100 font-bold uppercase tracking-[0.2em] group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-300">
                                    Cast Me
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Date Tag - Bottom Left */}
                <div className="absolute bottom-10 left-6 md:left-12 z-20 hidden md:block">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">Edition 2026</p>
                    <div className="h-[1px] w-12 bg-secondary-500 mt-2"></div>
                </div>
            </section>

            {/* --- INFINITE MARQUEE --- */}
            <div className="py-5 bg-black border-y border-white/10 overflow-hidden relative z-20">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="text-4xl md:text-5xl font-display font-medium uppercase text-white/20 mx-12 flex items-center gap-8">
                            GLAM ICONIC INDIA <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                        </span>
                    ))}
                </div>
            </div>

            {/* --- PROCESS TRIO SECTION --- */}
            <section className="bg-black py-24 md:py-32 px-6 border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <span className="text-secondary-500 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The Journey</span>
                        <h2 className="text-4xl md:text-6xl font-display text-white leading-tight">
                            From <span className="italic font-serif text-gray-500">Raw Talent</span> to <br />
                            Global Icon.
                        </h2>
                    </div>

                    {/* 3-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            {
                                title: "Scouted",
                                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
                                num: "01",
                                desc: "We discover potential in the unlikeliest of places."
                            },
                            {
                                title: "Trained",
                                img: "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1974&auto=format&fit=crop",
                                num: "02",
                                desc: "Rigorous grooming by industry veterans."
                            },
                            {
                                title: "Launched",
                                img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop",
                                num: "03",
                                desc: "The runway is just the beginning of your legacy."
                            },
                        ].map((item, i) => (
                            <div key={i} className="group relative h-[500px] md:h-[600px] overflow-hidden bg-dark-900 border border-white/10 transition-all duration-500 hover:border-secondary-500/50">
                                {/* Image Layer */}
                                <div className="absolute inset-0 z-0">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                                </div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-10">
                                    <div className="flex justify-between items-start">
                                        <span className="text-white/20 font-display text-6xl font-bold leading-none">{item.num}</span>
                                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-white text-xl">↗</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-display text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                                        <div className="h-[1px] w-12 bg-secondary-500 mb-4 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                                        <p className="text-gray-400 font-light text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-1000 transform translate-y-4 group-hover:translate-y-0">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION BANNER --- */}
            <section className="py-24 px-6 bg-black">
                <div className="max-w-[1400px] mx-auto relative rounded-[2rem] overflow-hidden h-[60vh] md:h-[500px] flex items-center justify-center group">

                    {/* Background Image with Zoom Effect */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                            className="w-full h-full object-cover object-center filter brightness-[0.5] transition-transform duration-[2s] group-hover:scale-105"
                            alt="Background"
                        />
                        {/* Vignette Overlay */}
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 opacity-80"></div>
                    </div>

                    {/* Content - Centered & Elegant */}
                    <div className="relative z-10 text-center px-6">
                        <p className="text-secondary-400/80 font-bold tracking-[0.3em] uppercase mb-4 text-xs animate-pulse">Join The Movement</p>

                        <h2 className="text-5xl md:text-7xl font-display font-medium text-white mb-8 drop-shadow-2xl">
                            Make Your Mark.
                        </h2>

                        <p className="text-gray-300 font-light max-w-lg mx-auto mb-10 leading-relaxed text-sm md:text-base">
                            The runway calls for the bold. Step into the spotlight and let the world see what you are made of.
                        </p>

                        <div className="flex justify-center gap-6">
                            <Link to="/register" className="px-10 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-secondary-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                Start Application
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
