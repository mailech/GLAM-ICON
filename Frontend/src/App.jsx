import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Events from './pages/Events';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-dark-900">
      {/* Simple Gradient Background - More Human, less chaotic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-dark-950"></div>

      {/* Subtle Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        <p className="text-secondary-500 uppercase tracking-[0.3em] text-sm font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>Welcome to the Future of Fashion</p>

        <h1 className="text-6xl md:text-9xl font-display font-bold mb-8 text-white tracking-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
          GLAM ICON
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Curating the most exclusive fashion events, model hunts, and designer showcases in India.
          <span className="text-white font-medium block mt-2">Join the elite circle.</span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <a href="/register" className="px-10 py-4 bg-secondary-600 text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-secondary-500 transition shadow-xl shadow-secondary-900/30">
            Become a Member
          </a>
          <a href="/events" className="px-10 py-4 border border-white/10 text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition backdrop-blur-sm">
            View Schedule
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
