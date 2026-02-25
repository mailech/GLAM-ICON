import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const EventBookingModal = ({ event, isOpen, onClose, onConfirm, user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dob: '',
        age: ''
    });
    const [files, setFiles] = useState({
        profilePhoto: null,
        birthCertificate: null,
        video: null,
        walkingVideo: null
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    if (!isOpen || !event) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const uploadToCloudinary = async (file) => {
        const cloudName = 'dttb9lvfl'; // Your Cloudinary Cloud Name
        const uploadPreset = 'glam_test'; // NEW Preset

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || 'Upload failed');
            }

            const data = await res.json();
            return data.secure_url;
        } catch (err) {
            console.error("Cloudinary Upload Error:", err);
            throw err;
        }
    };

    const uploadFiles = async () => {
        try {
            setUploading(true);

            const uploadPromises = [];
            const fileKeys = [];

            if (files.profilePhoto) {
                uploadPromises.push(uploadToCloudinary(files.profilePhoto));
                fileKeys.push('profilePhoto');
            }
            if (files.birthCertificate) {
                uploadPromises.push(uploadToCloudinary(files.birthCertificate));
                fileKeys.push('birthCertificate');
            }
            if (files.video) {
                uploadPromises.push(uploadToCloudinary(files.video));
                fileKeys.push('video');
            }
            if (files.walkingVideo) {
                uploadPromises.push(uploadToCloudinary(files.walkingVideo));
                fileKeys.push('walkingVideo');
            }

            const results = await Promise.all(uploadPromises);

            const urls = {};
            fileKeys.forEach((key, index) => {
                urls[key] = results[index];
            });

            setUploading(false);
            return urls;
        } catch (err) {
            console.error('Upload failed', err);
            setUploading(false);
            alert(`File upload failed: ${err.message}. Please check console.`);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Upload files first
        setLoading(true);
        const uploadedUrls = await uploadFiles();

        if (uploadedUrls === null) {
            setLoading(false);
            return; // Upload failed
        }

        // 2. Prepare Registration Data
        const registrationData = {
            ...uploadedUrls,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            dob: formData.dob,
            doB: formData.dob,
            age: formData.age,
            socialLinks: user?.socialLinks || {} // Include social links from user profile
        };

        // 3. Confirm Booking (No Payment Step)
        onConfirm(registrationData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md sm:p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-dark-900 border-x border-white/10 sm:border sm:rounded-2xl w-full max-w-lg shadow-2xl relative h-full sm:h-auto sm:max-h-[90vh] flex flex-col"
            >
                {/* Header - Fixed at top */}
                <div className="bg-dark-800 p-4 border-b border-white/10 flex justify-between items-center shrink-0 z-50">
                    <div>
                        <h3 className="text-lg font-display font-bold text-white">Secure Your Spot</h3>
                        <p className="text-xs text-secondary-400 uppercase tracking-widest truncate max-w-[250px]">{event.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white sm:hidden"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Attendee Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Name</label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange} required
                                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Phone</label>
                                        <input
                                            type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Email (Ticket Delivery)</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleChange} required readOnly
                                        className="w-full bg-dark-800/50 border border-white/5 rounded-lg p-3 text-gray-400 outline-none text-sm cursor-not-allowed"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob || ''}
                                            onChange={(e) => {
                                                const dob = e.target.value;
                                                let age = '';
                                                if (dob) {
                                                    const birthDate = new Date(dob);
                                                    const today = new Date();
                                                    age = today.getFullYear() - birthDate.getFullYear();
                                                    const m = today.getMonth() - birthDate.getMonth();
                                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                        age--;
                                                    }
                                                }
                                                setFormData({ ...formData, dob, age });
                                            }}
                                            required
                                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Age (Auto-calc)</label>
                                        <input
                                            type="text"
                                            name="age"
                                            value={formData.age || ''}
                                            readOnly
                                            className="w-full bg-dark-800/50 border border-white/5 rounded-lg p-3 text-gray-400 outline-none text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h5 className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Registration Documents</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Profile Photo</label>
                                            <input
                                                type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-gray-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary-600 file:text-white hover:file:bg-secondary-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Birth Certificate</label>
                                            <input
                                                type="file" name="birthCertificate" onChange={handleFileChange} accept="image/*,application/pdf"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-gray-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary-600 file:text-white hover:file:bg-secondary-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Intro Video (Introduction)</label>
                                            <input
                                                type="file" name="video" onChange={handleFileChange} accept="video/*"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-gray-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary-600 file:text-white hover:file:bg-secondary-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Walking Video (Ramp Walk)</label>
                                            <input
                                                type="file" name="walkingVideo" onChange={handleFileChange} accept="video/*"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-gray-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary-600 file:text-white hover:file:bg-secondary-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="pt-6 border-t border-white/10 flex gap-4 pb-8 sm:pb-0">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                                    className="flex-1 px-4 py-4 sm:py-3 bg-dark-800 text-gray-400 hover:text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg hover:bg-dark-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="flex-[2] px-8 py-4 sm:py-3 bg-secondary-600 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg hover:bg-secondary-500 transition shadow-lg shadow-secondary-900/20 disabled:opacity-50"
                                >
                                    {loading ? (uploading ? 'Uploading...' : 'Processing...') : 'Complete'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div >
    );
};

export default EventBookingModal;
