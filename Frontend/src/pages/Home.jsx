import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const ctaImages = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-b8d2175943bc?q=80&w=1976&auto=format&fit=crop"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % ctaImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div ref={containerRef} className="bg-dark-950 text-white overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-dark-950/70 to-dark-950 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1574950578143-858c6fc58922?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Runway Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </motion.div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="mb-6 flex items-center justify-center gap-4">
                            <span className="h-[1px] w-12 bg-secondary-500"></span>
                            <span className="text-secondary-400 uppercase tracking-[0.4em] text-xs md:text-sm font-bold glow-text">The Official Platform</span>
                            <span className="h-[1px] w-12 bg-secondary-500"></span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-7xl md:text-9xl font-display font-bold leading-none tracking-tight mb-8 drop-shadow-2xl">
                            GLAM ICONIC <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-secondary-300 via-secondary-500 to-secondary-700 drop-shadow-sm filter">INDIA</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
                            The definitive stage for India's next generation of supermodels and visionary designers.
                            <span className="block mt-2 text-white font-medium">Your journey to stardom begins here.</span>
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <Link to="/register" className="group relative px-8 py-4 bg-secondary-600 text-white font-bold text-sm uppercase tracking-widest overflow-hidden rounded-sm transition-all hover:bg-secondary-500 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] border border-transparent">
                                <span className="relative z-10 flex items-center gap-2">
                                    Register for 2026
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </span>
                            </Link>
                            <Link to="/events" className="group px-8 py-4 border border-white/30 text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-dark-950 transition-all rounded-sm backdrop-blur-md bg-white/5">
                                Explore Events
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                >
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll to Explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-secondary-500 to-transparent"></div>
                </motion.div>
            </section>

            {/* --- MARQUEE SECTION --- */}
            <div className="bg-secondary-950 border-y border-white/5 py-8 overflow-hidden relative z-20">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex whitespace-nowrap gap-20 text-4xl md:text-6xl font-display font-bold text-white/20 select-none items-center"
                >
                    <span className="text-stroke-sm hover:text-white transition-colors duration-300">FASHION WEEK 2026</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                    <span className="text-stroke-sm hover:text-white transition-colors duration-300">MODEL HUNT</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                    <span className="text-stroke-sm hover:text-white transition-colors duration-300">DESIGNER SHOWCASE</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                    <span className="text-secondary-500 glow-text">GLAM ICONIC INDIA</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                    <span className="text-stroke-sm hover:text-white transition-colors duration-300">FASHION WEEK 2026</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                    <span className="text-stroke-sm hover:text-white transition-colors duration-300">MODEL HUNT</span>
                    <span className="text-secondary-500 text-2xl">✦</span>
                </motion.div>
            </div>

            {/* --- FEATURES GRID --- */}
            <section className="py-24 px-6 bg-dark-900 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "For Models",
                                desc: "Launch your career on the grandest stage. Get discovered by top agencies and brands.",
                                icon: "✨",
                                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
                            },
                            {
                                title: "For Designers",
                                desc: "Showcase your collection to the elite fashion world. Let your creativity reign supreme.",
                                icon: "🧵",
                                img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                            },
                            {
                                title: "For Sponsors",
                                desc: "Partner with India's fastest growing fashion property and reach a premium audience.",
                                icon: "🤝",
                                img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[450px] overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-secondary-500/50 transition-all duration-500 shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-dark-800">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {/* Gradient Overlay for Text Visibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent opacity-80" />
                                </div>

                                <div className="absolute bottom-0 left-0 p-10 w-full transform transition-all duration-500">
                                    <div className="text-4xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">{item.icon}</div>
                                    <h3 className="text-4xl font-display font-bold text-white mb-4 group-hover:text-secondary-400 transition-colors">{item.title}</h3>
                                    <p className="text-gray-300 text-lg font-light leading-relaxed max-w-sm mb-6 opacity-90">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-secondary-500 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <span>Learn More</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 border-y border-white/5 bg-dark-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Designers", value: "50+" },
                            { label: "Models", value: "200+" },
                            { label: "Cities", value: "12" },
                            { label: "Reach", value: "5M+" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <h4 className="text-5xl md:text-6xl font-display font-bold text-white mb-2">{stat.value}</h4>
                                <p className="text-xs uppercase tracking-widest text-secondary-500 font-bold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-24 px-6 bg-dark-950 flex items-center justify-center">
                <div className="max-w-6xl w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-dark-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 grid grid-cols-1 md:grid-cols-5 relative group"
                    >
                        {/* LEFT: Image Section (2 cols) */}
                        <div className="md:col-span-2 relative min-h-[450px] overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={ctaImages[currentImageIndex]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    alt="Fashion Model"
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                />
                            </AnimatePresence>

                            {/* Standard Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-40"></div>

                            {/* Inner Frame Decoration */}
                            <div className="absolute inset-4 border border-white/30 z-20 pointer-events-none transition-all duration-700 group-hover:inset-6 group-hover:border-secondary-400"></div>

                            {/* EST Tag */}
                            <div className="absolute left-8 bottom-8 z-30">
                                <span className="bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/20">
                                    EST. 2026
                                </span>
                            </div>
                        </div>

                        {/* RIGHT: Content Section (3 cols) */}
                        <div className="md:col-span-3 p-10 md:p-16 flex flex-col justify-center text-left relative overflow-hidden bg-gradient-to-br from-dark-900 to-black">

                            {/* Giant Background Symbol (Watermark) */}
                            <div className="absolute -bottom-10 -right-10 text-[250px] font-display font-bold text-white/5 leading-none select-none pointer-events-none rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105">
                                Gi
                            </div>

                            {/* Subtle Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="w-12 h-[1px] bg-secondary-500"></span>
                                    <p className="text-secondary-500 font-serif italic text-lg">An Exclusive Invitation</p>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                                    Join the Elite Circle of <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Indian Fashion.</span>
                                </h2>

                                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg font-light border-l-2 border-white/10 pl-6">
                                    The runway is calling. Whether you aspire to be the face of the next big brand or design the collection that defines a generation, it starts here.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Link to="/register" className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-secondary-500 hover:text-white hover:scale-105 shadow-xl relative z-20">
                                        Begin Application
                                    </Link>
                                    <Link to="/events" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group/link relative z-20">
                                        View Calendar
                                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Home;
