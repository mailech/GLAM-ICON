import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const EventBookingModal = ({ event, isOpen, onClose, onConfirm, user }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        paymentMethod: 'card', // card, upi
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
    });
    const [files, setFiles] = useState({
        profilePhoto: null,
        birthCertificate: null,
        video: null
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

    const uploadFiles = async () => {
        const data = new FormData();
        if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);
        if (files.birthCertificate) data.append('birthCertificate', files.birthCertificate);
        if (files.video) data.append('video', files.video);

        if (!files.profilePhoto && !files.birthCertificate && !files.video) return {};

        try {
            setUploading(true);
            const res = await api.post('/api/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            return res.data.data;
        } catch (err) {
            console.error('Upload failed', err);
            setUploading(false);
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            alert(`File upload failed: ${errorMsg}`);
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
            email: formData.email
        };

        // 3. Simulate Payment
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 4. Confirm Booking
        onConfirm(registrationData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="bg-dark-800 p-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white">Secure Your Spot</h3>
                        <p className="text-xs text-secondary-400 uppercase tracking-widest">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-dark-800 sticky top-[80px] z-10">
                    <div
                        className="h-full bg-secondary-500 transition-all duration-500"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    ></div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
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

                                    {/* File Uploads */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h5 className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Registration Documents</h5>

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
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Audition Video</label>
                                            <input
                                                type="file" name="video" onChange={handleFileChange} accept="video/*"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-gray-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary-600 file:text-white hover:file:bg-secondary-500"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="px-6 py-3 bg-white text-dark-900 font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Payment Method</h4>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'card' ? 'border-secondary-500 bg-secondary-900/20 text-white' : 'border-white/10 bg-dark-800 text-gray-400'}`}
                                        >
                                            <span className="text-2xl">💳</span>
                                            <span className="text-xs font-bold uppercase">Card</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${formData.paymentMethod === 'upi' ? 'border-secondary-500 bg-secondary-900/20 text-white' : 'border-white/10 bg-dark-800 text-gray-400'}`}
                                        >
                                            <span className="text-2xl">📱</span>
                                            <span className="text-xs font-bold uppercase">UPI</span>
                                        </button>
                                    </div>

                                    {formData.paymentMethod === 'card' ? (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500 uppercase font-bold">Card Number</label>
                                                <input
                                                    type="text" placeholder="0000 0000 0000 0000"
                                                    className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-gray-500 uppercase font-bold">Expiry</label>
                                                    <input
                                                        type="text" placeholder="MM/YY"
                                                        className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-gray-500 uppercase font-bold">CVV</label>
                                                    <input
                                                        type="password" placeholder="123"
                                                        className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">UPI ID</label>
                                            <input
                                                type="text" placeholder="username@oksbi"
                                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-secondary-500 outline-none text-sm"
                                            />
                                        </div>
                                    )}

                                    <div className="bg-white/5 p-4 rounded-lg mt-4 border border-white/5">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-white">₹{event.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Tax</span>
                                            <span className="text-white">₹{(event.price * 0.18).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-lg">
                                            <span className="text-white">Total</span>
                                            <span className="text-secondary-400">₹{(event.price * 1.18).toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="px-8 py-3 bg-secondary-600 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-secondary-500 transition shadow-lg shadow-secondary-900/20 disabled:opacity-50"
                                    >
                                        {loading ? (uploading ? 'Uploading...' : 'Processing...') : `Pay ₹${(event.price * 1.18).toFixed(0)}`}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
};

export default EventBookingModal;
