import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/api/users/login', formData);
            console.log('Login successful:', res.data);

            // Save token
            localStorage.setItem('token', res.data.token);

            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
            console.error('Login error:', err);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            setLoading(true);
            const { credential } = credentialResponse;
            const res = await api.post('/api/users/google', { token: credential });
            localStorage.setItem('token', res.data.token);
            navigate('/profile');
        } catch (err) {
            console.error("Google login failed", err);
            setError("Google Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-dark-900/90"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 border-t border-white/10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-display font-bold mb-2 text-white">Welcome Back</h2>
                    <div className="h-1 w-16 bg-secondary-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4 text-sm font-light">Enter your credentials to access your account</p>
                </div>

                <div className="mb-8 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError("Google Login Failed")}
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                        size="large"
                    />
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">OR</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {error && <p className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded text-center mb-6 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition text-white placeholder-gray-600"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition text-white placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-4 bg-secondary-600 hover:bg-secondary-500 rounded-lg shadow-lg shadow-secondary-900/20 font-medium text-white transition disabled:opacity-50 tracking-wide uppercase text-sm"
                    >
                        {loading ? 'Please wait...' : 'Sign In'}
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    New to Glam Icon?{' '}
                    <Link to="/register" className="text-secondary-400 hover:text-secondary-300 font-medium transition">Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
