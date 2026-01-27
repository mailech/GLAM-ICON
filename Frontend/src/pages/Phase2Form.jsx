import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Phase2Form = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ticketId = searchParams.get('ticketId');

    const [formData, setFormData] = useState({
        bust: '',
        waist: '',
        hips: '',
        height: '',
        weight: '',
        shoeSize: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!ticketId) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
                <div className="text-center p-8 bg-dark-800 rounded-xl border border-red-500/30">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Access</h1>
                    <p className="text-gray-400">Please use the link provided in your email.</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Here we would typically update the user/ticket with new data
            // For now, we'll just simulate a successful submission or use a generic patch
            // In a real scenario, you'd have a specific endpoint e.g., /api/tickets/phase2

            // Simulating API call since backend endpoint for Phase 2 data isn't explicitly built yet
            // extending the Ticket model would be Step 2 of Backend
            // await new Promise(resolve => setTimeout(resolve, 1500));

            // Assuming we send data to update the ticket
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:4005/api/tickets/${ticketId}/phase2`, { ...formData }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSubmitted(true);
        } catch (err) {
            console.error("Submission Error Details:", err);
            if (err.response) {
                console.error("Server Response:", err.response.data);
                alert(`Failed to submit: ${err.response.data.message || err.message}`);
            } else {
                alert("Failed to submit. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary-900/10 z-0"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-lg w-full bg-dark-800 p-10 rounded-2xl border border-secondary-500/30 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-4xl">
                        ✓
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Registration Complete</h2>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        Thank you for submitting your Phase 2 details. Our team will review your measurements and portfolio update.
                        You will receive further instructions shortly.
                    </p>
                    <button onClick={() => navigate('/')} className="px-8 py-3 bg-secondary-600 text-white font-bold uppercase tracking-widest rounded hover:bg-secondary-500 transition">
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center py-20 px-4 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-secondary-900/20 to-transparent pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-dark-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative z-10"
            >
                <div className="h-2 bg-gradient-to-r from-secondary-700 via-secondary-500 to-secondary-700"></div>
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <span className="text-secondary-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Phase 2 Registration</span>
                        <h1 className="text-3xl md:text-4xl font-display font-bold">Model Profile Details</h1>
                        <p className="text-gray-400 mt-2 text-sm">Please provide accurate measurements for your portfolio composite.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Height (cm/ft)</label>
                                <input required name="height" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 175cm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weight (kg)</label>
                                <input required name="weight" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 55kg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bust (inches)</label>
                                <input required name="bust" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 34" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waist (inches)</label>
                                <input required name="waist" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 26" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hips (inches)</label>
                                <input required name="hips" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 36" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shoe Size</label>
                                <input required name="shoeSize" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="e.g. 7 UK" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Description / Experience</label>
                            <textarea name="description" rows="4" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Tell us briefly about any past modeling experience..."></textarea>
                        </div>

                        <div className="pt-4">
                            <button disabled={loading} type="submit" className="w-full bg-secondary-600 text-white font-bold text-sm uppercase tracking-widest py-4 rounded hover:bg-secondary-500 transition shadow-xl shadow-secondary-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Submitting...' : 'Submit Final Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Phase2Form;
