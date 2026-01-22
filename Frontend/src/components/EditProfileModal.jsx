import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EditProfileModal = ({ user, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        instagram: user?.socialLinks?.instagram || '',
        linkedin: user?.socialLinks?.linkedin || '',
        portfolio: user?.socialLinks?.portfolio || '',
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: formData.name,
                bio: formData.bio,
                phone: formData.phone,
                gender: formData.gender,
                socialLinks: {
                    instagram: formData.instagram,
                    linkedin: formData.linkedin,
                    portfolio: formData.portfolio
                }
            };

            const res = await axios.patch('/api/users/updateMe', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onUpdate(res.data.data.user);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-900 z-10">
                    <h2 className="text-2xl font-display font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Phone Number</label>
                            <input
                                type="text" name="phone" value={formData.phone} onChange={handleChange}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Bio</label>
                        <textarea
                            name="bio" value={formData.bio} onChange={handleChange} rows="3"
                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none transition resize-none"
                            placeholder="Tell us a bit about your glam journey..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Gender</label>
                        <select
                            name="gender" value={formData.gender} onChange={handleChange}
                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none transition appearance-none"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-sm font-bold text-secondary-500 mb-4 uppercase tracking-wider">Social Presence</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text" name="instagram" placeholder="Instagram Username" value={formData.instagram} onChange={handleChange}
                                className="bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-sm"
                            />
                            <input
                                type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange}
                                className="bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-sm"
                            />
                            <input
                                type="text" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange}
                                className="bg-dark-800 border border-white/10 rounded-lg p-3 text-white text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfileModal;
