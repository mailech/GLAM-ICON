import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TicketCard from '../components/TicketCard';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch user data directly from the /me endpoint
            const userRes = await axios.get('/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userRes.data.data.user);

            // Fetch tickets using filter
            const ticketRes = await axios.get('/api/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (ticketRes.data.data.tickets) {
                setTickets(ticketRes.data.data.tickets);
            }

        } catch (err) {
            console.error("Profile fetch error:", err);
            // Handle specific errors like 401 later
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary-400 font-display text-xl animate-pulse">Loading Your Experience...</div>;

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 bg-dark-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-dark-900">
            <EditProfileModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={(updatedUser) => setUser(updatedUser)}
            />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div>
                        <p className="text-secondary-400 uppercase tracking-widest text-sm mb-2 font-medium">The Exclusive Circle</p>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                            Welcome, <br />
                            <span className="text-gold italic">{user?.name?.split(' ')[0] || 'Member'}</span>
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-400 text-lg leading-relaxed font-light max-w-lg">
                            {user?.bio || "You have successfully secured your place among the icons. Your digital pass is your key to exclusive fashion weeks, model hunts, and designer galas."}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                            {user?.gender && <span className="px-3 py-1 bg-white/5 rounded border border-white/5">{user.gender}</span>}
                            {user?.role && <span className="px-3 py-1 bg-white/5 rounded border border-white/5">{user.role}</span>}
                        </div>

                        {user?.socialLinks && (
                            <div className="flex gap-4 pt-2">
                                {user.socialLinks.instagram && <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary-500 transition">Instagram</a>}
                                {user.socialLinks.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary-500 transition">LinkedIn</a>}
                                {user.socialLinks.portfolio && <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary-500 transition">Portfolio</a>}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 pt-6">
                        <button className="px-10 py-4 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-500 transition shadow-lg shadow-secondary-900/20 uppercase tracking-wider text-sm">
                            Explore Events
                        </button>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-10 py-4 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-dark-800 transition uppercase tracking-wider text-sm hover:text-white"
                        >
                            Edit Profile
                        </button>
                    </div>
                </motion.div>

                <div className="relative perspective-1000 space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-display font-bold text-white">Your Exclusive Passes</h3>
                        <span className="text-secondary-500 text-sm font-bold uppercase tracking-widest">{tickets.length} Active</span>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-secondary-500/10 blur-[100px] rounded-full -z-10"></div>

                    {tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="text-right mb-2 text-xs text-secondary-500 font-bold uppercase tracking-wider">
                                    {ticket.event ? 'Event Pass' : 'Membership'}
                                </div>
                                <TicketCard ticket={ticket} user={user} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass p-12 rounded-2xl text-center border border-dashed border-gray-700">
                            <p className="text-gray-400 font-light">No tickets found. Please register for events to generate your pass.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
