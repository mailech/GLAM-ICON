

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const textParallax = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    // Auto-cycle state for mobile poster deck
    const [activeCard, setActiveCard] = useState(0);
    const cardData = [
        {
            title: "SCOUTED",
            img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
            num: "01",
            desc: "UNLEASH POTENTIAL",
            color: "from-purple-900/60"
        },
        {
            title: "TRAINED",
            img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
            num: "02",
            desc: "FORGED BY ICONS",
            color: "from-amber-900/60"
        },
        {
            title: "LAUNCHED",
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2083&auto=format&fit=crop",
            num: "03",
            desc: "GLOBAL STAGE",
            color: "from-blue-900/60"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % cardData.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

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
                <div className="relative z-20 h-full flex flex-col justify-end items-center pb-32 md:pb-24 px-4 md:px-6">
                    <motion.div style={{ y: textParallax }} className="text-center w-full">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-amber-200 font-sans font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-sm mb-4 md:mb-6 drop-shadow-md"
                        >
                            The Official Platform
                        </motion.p>

                        <h1 className="flex flex-col items-center">
                            <span className="text-5xl sm:text-8xl md:text-[9rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_10px_rgba(251,191,36,0.2)] leading-none md:leading-[0.85]">
                                GLAM ICONIC
                            </span>
                            <span className="text-2xl sm:text-5xl md:text-7xl font-display font-light text-white tracking-[0.4em] md:tracking-[0.5em] mt-3 md:mt-6 drop-shadow-lg ml-2 md:ml-4">
                                INDIA
                            </span>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="mt-10 md:mt-12"
                        >
                            <Link to="/register" className="relative group inline-block px-10 md:px-14 py-3 md:py-4 bg-transparent overflow-hidden">
                                <div className="absolute inset-0 border border-amber-300/50 group-hover:border-amber-400 transition-colors duration-300"></div>
                                <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-sm group-hover:bg-amber-500/20 transition-colors duration-300"></div>
                                <div className="absolute inset-0 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-[400ms] ease-out group-hover:w-full opacity-20"></div>
                                <span className="relative text-amber-100 font-bold uppercase tracking-[0.2em] text-xs md:text-base group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-300">
                                    Cast Me
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Date Tag - Bottom Left (Hidden on Mobile for cleaner look) */}
                <div className="absolute bottom-10 left-6 md:left-12 z-20 hidden md:block">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">Edition 2026</p>
                    <div className="h-[1px] w-12 bg-secondary-500 mt-2"></div>
                </div>
            </section>

            {/* --- INFINITE MARQUEE --- */}
            <div className="py-4 md:py-5 bg-black border-y border-white/10 overflow-hidden relative z-20">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="text-2xl md:text-5xl font-display font-medium uppercase text-white/20 mx-6 md:mx-12 flex items-center gap-4 md:gap-8">
                            GLAM ICONIC INDIA <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary-500"></span>
                        </span>
                    ))}
                </div>
            </div>

            {/* --- PROCESS TRIO SECTION --- */}
            <section className="bg-black py-16 md:py-32 px-4 md:px-6 border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12 md:mb-20">
                        <span className="text-secondary-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The Journey</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-6xl font-display text-white leading-tight"
                        >
                            From <span className="italic font-serif text-gray-500">Raw Talent</span> to <br />
                            Global Icon.
                        </motion.h2>
                    </div>

                    {/* Desktop: Grid View */}
                    <div className="hidden md:grid grid-cols-3 gap-12">
                        {[
                            {
                                title: "Scouted",
                                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", // Raw portrait
                                num: "01",
                                desc: "We discover raw potential."
                            },
                            {
                                title: "Trained",
                                img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", // Backstage/Prep
                                num: "02",
                                desc: "Groomed by industry masters."
                            },
                            {
                                title: "Launched",
                                img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2083&auto=format&fit=crop", // Runway/Glam
                                num: "03",
                                desc: "The world becomes your stage."
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="group relative h-[600px] overflow-hidden bg-dark-900 border border-white/10 hover:border-secondary-500/50 transition-colors duration-500"
                            >
                                <div className="absolute inset-0 z-0">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                                </div>
                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-10">
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
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile: Auto-Playing Poster Deck */}
                    <div className="md:hidden pb-12 px-4">
                        <div className="relative h-[65vh] w-full bg-dark-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={activeCard}
                                    className="absolute inset-0 z-10"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, zIndex: -1 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                >
                                    {/* Image Layer */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={cardData[activeCard].img}
                                            alt={cardData[activeCard].title}
                                            className="w-full h-full object-cover filter brightness-[0.8] contrast-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${cardData[activeCard].color} via-transparent to-black/40 opacity-90`} />
                                    </div>

                                    {/* Content Layer */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-8">
                                        <div className="flex justify-between items-start">
                                            <span className="font-display font-bold text-6xl text-white/10">{cardData[activeCard].num}</span>
                                        </div>

                                        <div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <div className="h-0.5 w-12 bg-secondary-500 mb-4"></div>
                                                <h3 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase mb-2 leading-[0.85]">
                                                    {cardData[activeCard].title}
                                                </h3>
                                                <p className="text-secondary-100 text-[10px] font-bold tracking-[0.4em] uppercase">
                                                    {cardData[activeCard].desc}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Indicators */}
                            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                                {cardData.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === activeCard ? 'w-8 bg-secondary-500' : 'w-2 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MODERN REDESIGNED CTA SECTION --- */}
            <section className="relative w-full min-h-[60vh] md:min-h-[70vh] bg-black border-t border-white/10 flex flex-col md:flex-row overflow-hidden">

                {/* Left: Interactive Image Area - Resized & Animated */}
                <div className="w-full md:w-5/12 relative h-[50vh] md:h-auto overflow-hidden group">
                    <div className="w-full h-full relative bg-zinc-900">
                        {/* Skeleton/Placeholder Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black opacity-20 z-0"></div>
                        <div className="absolute inset-0 bg-secondary-900/10 z-10 group-hover:bg-transparent transition-colors duration-700 mix-blend-overlay"></div>
                        <motion.img
                            initial={{ scale: 1.3 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop"
                            alt="High Fashion Model"
                            loading="lazy"
                            className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                        />

                        {/* Floating Label - Animated Entry */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute bottom-8 left-8 z-20 overflow-hidden"
                        >
                            <span className="block text-xs font-bold uppercase tracking-[0.3em] text-white bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10">
                                Scouting Now
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Typography & Action - Wider & Faster Load */}
                <div className="w-full md:w-7/12 bg-zinc-950 flex flex-col justify-center px-8 md:px-24 py-16 md:py-0 relative">
                    {/* Decorative Background Elements */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-[100px] pointer-events-none"
                    ></motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p className="text-secondary-500 font-bold tracking-[0.4em] uppercase text-xs mb-6 flex items-center gap-4">
                            <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: 32 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-[1px] bg-secondary-500"
                            ></motion.span>
                            Be The Next Icon
                        </p>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] mb-8">
                            MAKE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-secondary-600">
                                YOUR MARK
                            </span>.
                        </h2>

                        <p className="text-gray-400 font-light text-sm md:text-lg leading-relaxed max-w-md mb-12 border-l-2 border-white/10 pl-6">
                            The runway calls for the bold. Step into the spotlight and let the world see what you are made of. Your journey to stardom begins with a single click.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <Link to="/register" className="group relative px-10 py-5 bg-white overflow-hidden flex items-center gap-3">
                                {/* Button Hover Fill */}
                                <div className="absolute inset-0 bg-secondary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>

                                <span className="relative z-10 text-black font-black uppercase tracking-[0.2em] text-sm group-hover:text-white transition-colors duration-300">
                                    Start Application
                                </span>
                                <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300 text-xl">→</span>
                            </Link>

                            <Link to="/events" className="px-8 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-white/5 transition-colors">
                                Explore Events
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
