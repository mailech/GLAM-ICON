import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import TicketCard from '../components/TicketCard';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import TicketDetailsModal from '../components/TicketDetailsModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('passes');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null); // For detail modal
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const userRes = await api.get('/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userRes.data.data.user);

            const ticketRes = await api.get('/api/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (ticketRes.data.data.tickets) {
                console.log("Raw Tickets from API:", ticketRes.data.data.tickets);
                const allTickets = ticketRes.data.data.tickets;
                setTickets(allTickets);

                const eventTick = allTickets.filter(t => t.event);
                const memTick = allTickets.find(t => !t.event);
                console.log("Event Tickets:", eventTick);
                console.log("Membership Ticket:", memTick);
            }

        } catch (err) {
            console.error("Profile fetch error:", err);
            setError(err.response?.data?.message || 'Failed to load profile. Please check console.');
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

    // Auto-open edit modal if profile is incomplete (missing DOB or phone) - Run only once on initial load
    // Auto-open edit modal if profile is incomplete
    useEffect(() => {
        if (!loading && user) {
            const isProfileIncomplete = !user.name || !user.dob || !user.phone || !user.gender;
            if (isProfileIncomplete) {
                setIsEditModalOpen(true);
            }
        }
    }, [loading, user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-secondary-400 font-display text-lg animate-pulse">Loading Profile...</div>;

    const membershipTicket = tickets.find(t => !t.event);
    const eventTickets = tickets.filter(t => t.event);

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans pt-20 pb-20 md:pt-24 md:pb-12 px-4 sm:px-6 transition-colors duration-300 overflow-x-hidden">
            <EditProfileModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={(updatedUser) => setUser(updatedUser)}
                forceCompletion={!user?.name || !user?.dob || !user?.phone || !user?.gender}
            />

            <TicketDetailsModal
                ticket={selectedTicket}
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
            />

            {/* NOTIFICATION BANNER: SHORTLISTED */}
            {user?.applicationStatus === 'shortlisted' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto mb-6"
                >
                    <div className="bg-gradient-to-r from-green-900/40 to-dark-900 border border-green-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40 shrink-0">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-white mb-1">Congratulations! You've been Shortlisted.</h3>
                                <p className="text-gray-400 text-sm">You are one step closer to the runway. Please complete your final registration details.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const shortlistedTicket = tickets.find(t => t.applicationStatus === 'shortlisted') || tickets[0];
                                if (shortlistedTicket) {
                                    navigate(`/phase-2-registration?ticketId=${shortlistedTicket._id}`);
                                } else {
                                    alert("No relevant ticket found. Please contact support.");
                                }
                            }}
                            className="relative z-10 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-all shadow-lg hover:shadow-green-500/25 shrink-0"
                        >
                            Fill Registration Form
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Card with Staggered Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-surface via-surface to-secondary-900/5 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group"
                >
                    {/* Decorative shimmer - Animated on Hover */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 group-hover:opacity-75"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                    {/* Profile Photo Area */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative shrink-0"
                    >
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-secondary-400 to-transparent shadow-xl">
                            <img
                                src={user?.photo && user?.photo !== 'default.jpg'
                                    ? (user.photo.startsWith('http') ? user.photo : `/img/users/${user.photo}`)
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-surface-highlight object-cover"
                            />
                        </div>
                        {user.memberId && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-dark-950 text-gold text-[10px] font-bold px-3 py-1 rounded-full border border-gold/30 whitespace-nowrap shadow-lg z-10"
                            >
                                {user.memberId}
                            </motion.div>
                        )}
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute bottom-1 right-1 bg-surface text-text-secondary p-2 rounded-full border border-border hover:text-text-primary transition shadow-lg z-20 hover:scale-110 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                        </button>
                    </motion.div>

                    {/* User Info */}
                    <div className="text-center md:text-left flex-1 min-w-0 flex flex-col items-center md:items-start">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-display font-bold text-text-primary truncate"
                        >
                            {user?.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xs text-secondary-500 font-bold uppercase tracking-[0.2em] mt-2 mb-4"
                        >
                            {user?.role || 'Member'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-text-secondary"
                        >
                            <span className="bg-surface-highlight px-3 py-1.5 rounded-lg border border-border/50 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 opacity-50"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg>
                                {user?.email}
                            </span>
                            <span className="bg-surface-highlight px-3 py-1.5 rounded-lg border border-border/50 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 opacity-50"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>
                                Joined {new Date(user?.createdAt).getFullYear()}
                            </span>
                        </motion.div>
                    </div>

                    {/* Stats - Hidden on Small Mobile, Visible on md+ */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-8 border-l border-white/5 pl-8 hidden md:flex"
                    >
                        <div className="text-center group cursor-default">
                            <p className="text-3xl font-display font-bold text-text-primary group-hover:text-secondary-500 transition-colors">{tickets.length}</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Passes</p>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDEBAR: IDENTITY */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-gradient-to-b from-surface to-surface-highlight shadow-lg rounded-2xl p-6 md:p-8 transition-colors duration-300">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-secondary-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span> Bio
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed font-light">
                                {user?.bio || "No bio added yet. Tell us about yourself."}
                            </p>

                            <div className="mt-8 pt-8 border-t border-dashed border-white/10">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-bold opacity-70">Gender</p>
                                        <p className="text-sm text-text-primary capitalize font-medium">{user?.gender || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-bold opacity-70">Phone</p>
                                        <p className="text-sm text-text-primary font-medium">{user?.phone || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-surface to-surface-highlight shadow-lg rounded-2xl p-6 md:p-8 transition-colors duration-300">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-secondary-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span> Socials
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                                {user?.socialLinks?.instagram ? (
                                    <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-surface-highlight rounded-lg hover:bg-secondary-500/10 transition text-xs border border-transparent hover:border-secondary-500/20 group">
                                        <span className="text-text-secondary group-hover:text-text-primary transition-colors">Instagram</span>
                                        <span className="text-secondary-500">↗</span>
                                    </a>
                                ) : <div className="col-span-2 text-xs text-text-secondary italic mb-2">No Instagram linked</div>}

                                {user?.socialLinks?.twitter && (
                                    <a href={`https://x.com/${user.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-surface-highlight rounded-lg hover:bg-secondary-500/10 transition text-xs border border-transparent hover:border-secondary-500/20 group">
                                        <span className="text-text-secondary group-hover:text-text-primary transition-colors">X (Twitter)</span>
                                        <span className="text-secondary-500">↗</span>
                                    </a>
                                )}

                                {user?.socialLinks?.portfolio && (
                                    <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="col-span-2 md:col-span-1 flex items-center justify-between p-3 bg-surface-highlight rounded-lg hover:bg-secondary-500/10 transition text-xs border border-transparent hover:border-secondary-500/20 group">
                                        <span className="text-text-secondary group-hover:text-text-primary transition-colors">Portfolio</span>
                                        <span className="text-secondary-500">↗</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT AREA: WALLET / TABS */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-surface shadow-xl rounded-2xl overflow-hidden min-h-[500px] flex flex-col transition-colors duration-300 relative">
                            {/* Gradient Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 via-secondary-300 to-secondary-500 opacity-50"></div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/5 bg-surface-highlight/10">
                                <button
                                    onClick={() => setActiveTab('passes')}
                                    className={`flex-1 py-4 md:py-6 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'passes' ? 'bg-surface text-secondary-500 shadow-sm relative' : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'}`}
                                >
                                    {activeTab === 'passes' && <span className="absolute top-0 left-0 right-0 h-[3px] bg-secondary-500"></span>}
                                    My Passes
                                </button>
                                <button
                                    onClick={() => setActiveTab('membership')}
                                    className={`flex-1 py-4 md:py-6 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'membership' ? 'bg-surface text-secondary-500 shadow-sm relative' : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'}`}
                                >
                                    {activeTab === 'membership' && <span className="absolute top-0 left-0 right-0 h-[3px] bg-secondary-500"></span>}
                                    Membership
                                </button>
                            </div>

                            <div className="p-4 md:p-6 grow bg-surface-highlight/30">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'passes' ? (
                                        <motion.div
                                            key="passes"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            {eventTickets.length > 0 ? (
                                                eventTickets.map(ticket => (
                                                    <TicketCard
                                                        key={ticket._id}
                                                        ticket={ticket}
                                                        user={user}
                                                        onClick={() => setSelectedTicket(ticket)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-xl">
                                                    <p className="text-text-secondary text-sm mb-4">No active event passes.</p>
                                                    <button onClick={() => navigate('/events')} className="px-6 py-2 bg-secondary-600/20 text-secondary-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-600/30 transition">
                                                        Browse Events
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="membership"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center h-full py-8"
                                        >
                                            {membershipTicket ? (
                                                <TicketCard ticket={membershipTicket} user={user} />
                                            ) : (
                                                <div className="text-text-secondary">Membership card not found.</div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
