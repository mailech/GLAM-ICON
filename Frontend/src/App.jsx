import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Events = lazy(() => import('./pages/Events'));
const Phase2Form = lazy(() => import('./pages/Phase2Form'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="events" element={<Events />} />
            <Route path="phase-2-registration" element={<Phase2Form />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
