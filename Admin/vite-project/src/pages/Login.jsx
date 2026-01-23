import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/users/login', formData);
            if (res.data.status === 'success') {
                const user = res.data.data.user;
                if (user.role !== 'admin') {
                    setError('Access Denied: Admin privileges required.');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-dark-800 border border-white/10 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Restricted Access</p>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            className="w-full p-4 bg-dark-900 border border-white/10 rounded-lg text-white outline-none focus:border-secondary-500 transition"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 bg-dark-900 border border-white/10 rounded-lg text-white outline-none focus:border-secondary-500 transition"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-secondary-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-secondary-500 transition disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter Console'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
