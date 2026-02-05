import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => {
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">

                {/* --- Left Column: Info --- */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <div>
                        <span className="text-secondary-500 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
                        <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6">
                            Let's Talk <br /> <span className="text-gray-500 italic font-serif">Fashion.</span>
                        </h1>
                        <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed max-w-md">
                            Whether you're an aspiring model, a designer looking to showcase, or a brand wanting to collaborate, we're here to listen.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Headquarters</h4>
                            <p className="text-gray-400 font-light">
                                123 Fashion Avenue, <br />
                                Bandra West, Mumbai, <br />
                                Maharashtra 400050
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Email Us</h4>
                            <a href="mailto:hello@glamiconic.in" className="text-secondary-400 hover:text-white transition-colors text-xl font-display">hello@glamiconic.in</a>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Follow Us</h4>
                            <div className="flex gap-6">
                                {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                                    <a key={social} href="#" className="text-gray-400 hover:text-secondary-500 transition-colors uppercase text-xs tracking-wider border-b border-transparent hover:border-secondary-500 pb-1">
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- Right Column: Form --- */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-zinc-900/50 p-8 md:p-12 border border-white/5 rounded-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4">
                                ✓
                            </div>
                            <h3 className="text-2xl font-display text-white">Message Sent</h3>
                            <p className="text-gray-400">We'll get back to you shortly.</p>
                            <button onClick={() => setSubmitted(false)} className="text-secondary-400 text-sm hover:text-white transition mt-4 underline">Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border-b border-white/20 p-3 text-white focus:border-secondary-500 outline-none transition-all placeholder-white/10 text-lg"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border-b border-white/20 p-3 text-white focus:border-secondary-500 outline-none transition-all placeholder-white/10 text-lg"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full bg-black/50 border-b border-white/20 p-3 text-white focus:border-secondary-500 outline-none transition-all placeholder-white/10 text-lg resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-secondary-500 hover:text-white transition-all duration-300 mt-4"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default ContactPage;
