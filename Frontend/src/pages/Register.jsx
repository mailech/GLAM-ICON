import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm // Backend expects this
      });
      console.log('Registration successful:', response.data);

      // Save token
      localStorage.setItem('token', response.data.token);

      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
      console.error('Registration error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-dark-900/90"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 border-t border-white/10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Join Glam Icon</h2>
          <div className="h-1 w-16 bg-secondary-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 text-sm font-light">Begin your journey to stardom</p>
        </div>

        {error && <p className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded text-center mb-6 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition text-white placeholder-gray-600"
              placeholder="John Doe"
            />
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength="8"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition text-white"
              />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Confirm</label>
              <input
                type="password"
                name="passwordConfirm"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition text-white"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-secondary-600 hover:bg-secondary-500 rounded-lg shadow-lg shadow-secondary-900/20 font-medium text-white transition mt-2 disabled:opacity-50 tracking-wide uppercase text-sm"
          >
            {loading ? 'Creating...' : 'Get Membership'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already a member?{' '}
          <Link to="/login" className="text-secondary-400 hover:text-secondary-300 font-medium transition">Access Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
