import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Phase2Form = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ticketId = searchParams.get('ticketId');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        parentsName: '',
        parentsNumber: '',
        gender: '',
        city: '',
        state: '',
        pincode: '',
        bust: '',
        waist: '',
        hips: '',
        height: '',
        weight: '',
        shoeSize: '',
        description: '',
    });

    // Fetch generic user data to prefill and load Razorpay
    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:4005/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = res.data.data.user || res.data.data.data;
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    gender: user.gender || ''
                }));
            } catch (err) {
                console.error("Failed to fetch user data for prefill", err);
            }
        };

        const loadRazorpay = () => {
            if (document.getElementById('razorpay-sdk')) return; // Prevent duplicate
            const script = document.createElement('script');
            script.id = 'razorpay-sdk';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => console.log('Razorpay SDK loaded');
            script.onerror = () => console.error('Razorpay SDK failed to load');
            document.body.appendChild(script);
        };

        fetchUserData();
        loadRazorpay();
    }, []);
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
            console.log("Starting handleSubmit...");
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expired. Please log in again.");
                setLoading(false);
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };

            console.log("Fetching Order from Backend...");
            // 1. Create Razorpay Order
            const orderRes = await axios.post('http://localhost:4005/api/tickets/create-order', {}, config);
            console.log("Order Response received:", orderRes.data);

            if (!orderRes.data || !orderRes.data.order) {
                throw new Error("Invalid order response from server");
            }

            const { amount, id: order_id, currency, is_mock } = orderRes.data.order;

            if (!amount || !order_id) {
                throw new Error("Missing amount or order_id in response");
            }

            // Mock Payment Logic/Simulation
            if (is_mock) {
                if (window.confirm("Simulator Mode: Server is using Mock Keys. Simulate successful payment?")) {
                    try {
                        await axios.patch(`http://localhost:4005/api/tickets/${ticketId}/phase2`, {
                            ...formData,
                            paymentId: "pay_mock_" + Date.now(),
                            paymentStatus: 'completed',
                            amount: amount / 100
                        }, config);
                        setSubmitted(true);
                    } catch (err) {
                        alert("Mock submission failed: " + err.message);
                    } finally {
                        setLoading(false);
                    }
                    return;
                } else {
                    setLoading(false);
                    return;
                }
            }

            const options = {
                key: "rzp_test_1234567890", // Dev Key
                amount: amount.toString(),
                currency: currency,
                name: "Glam Icon India",
                description: "Phase 2 Registration",
                order_id: order_id,
                handler: async function (response) {
                    console.log("Payment Success callback:", response);
                    try {
                        // 2. On Payment Success, Submit Phase 2 Data
                        await axios.patch(`http://localhost:4005/api/tickets/${ticketId}/phase2`, {
                            ...formData,
                            paymentId: response.razorpay_payment_id,
                            paymentStatus: 'completed',
                            amount: amount / 100
                        }, config);

                        console.log("Phase 2 Data Submitted Successfully");
                        setSubmitted(true);
                    } catch (err) {
                        console.error("Critical: Payment succeeded but backend update failed", err);
                        alert("Payment successful! However, we could not update your profile immediately. Please contact support with Payment ID: " + response.razorpay_payment_id);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#D4AF37"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            // Open Razorpay
            if (!window.Razorpay) {
                alert("Payment SDK failed to load. Please check your connection.");
                setLoading(false);
                return;
            }

            console.log("Initializing Razorpay with options:", options);
            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response) {
                console.error("Razorpay Payment Failed:", response.error);
                alert("Payment Transaction Failed: " + response.error.description);
                setLoading(false);
            });

            rzp1.open();

        } catch (err) {
            console.error("handleSubmit Global Catch:", err);
            const msg = err.response?.data?.message || err.message || "An unknown error occurred.";
            alert(`Error initiating payment: ${msg}`);
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
                        {/* Personal Details Section */}
                        <div className="mb-8">
                            <h3 className="text-secondary-400 text-sm font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email ID</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="email@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="+91 9999999999" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                    <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition">
                                        <option value="">Select Gender</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent's / Guardian's Name</label>
                                    <input required name="parentsName" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Father or Mother's Name" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent's / Guardian's Phone Number</label>
                                    <input required name="parentsNumber" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="+91 8888888888" />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="mb-8">
                            <h3 className="text-secondary-400 text-sm font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                                    <textarea required name="address" rows="2" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition resize-none" placeholder="House No, Street, Area"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                                    <input required name="city" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Mumbai" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                                    <input required name="state" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Maharashtra" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
                                    <input required name="pincode" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="400001" />
                                </div>
                            </div>
                        </div>



                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Description / Experience</label>
                            <textarea name="description" rows="4" onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition" placeholder="Tell us briefly about any past modeling experience..."></textarea>
                        </div>

                        <div className="pt-4">
                            <button disabled={loading} type="submit" className="w-full bg-secondary-600 text-white font-bold text-sm uppercase tracking-widest py-4 rounded hover:bg-secondary-500 transition shadow-xl shadow-secondary-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Processing...' : 'Pay & Register (₹1000)'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Phase2Form;
