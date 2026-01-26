import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

            const userRes = await axios.get('/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userRes.data.data.user);

            const ticketRes = await axios.get('/api/tickets', {
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
    useEffect(() => {
        if (!loading && user && (!user.dob || !user.phone)) {
            // Only open if it hasn't been opened automatically yet, or rely on user action. 
            // To prevent re-opening after save, we can check if it's the *first* time we noticed it's missing.
            // But simpler: Just remove this aggressive auto-check or make it smarter.
            // Let's rely on a flag or just do it once.
            // Better UX: Show a notification/banner instead of forcing a modal.
            // But for now, fixing the "not going off" issue:
            // The issue is likely that even after update, if one field is missing, it re-opens. 
            // Logic: Check if we just updated? 

            // I will simply Comment out this aggressive auto-opening for now as it causes the "loop" issue if user doesn't fill everything.
            // Users can click the edit button.
            // setIsEditModalOpen(true); 
        }
    }, [loading, user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-secondary-400 font-display text-lg animate-pulse">Loading Profile...</div>;

    const membershipTicket = tickets.find(t => !t.event);
    const eventTickets = tickets.filter(t => t.event);

    return (
        <div className="min-h-screen bg-dark-950 text-gray-200 font-sans pt-24 pb-12 px-4 sm:px-6">
            <EditProfileModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={(updatedUser) => setUser(updatedUser)}
            />

            <TicketDetailsModal
                ticket={selectedTicket}
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
            />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Compact Header Card */}
                <div className="bg-dark-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-gold/50 to-transparent">
                            <img
                                src={user?.photo && user?.photo !== 'default.jpg'
                                    ? (user.photo.startsWith('http') ? user.photo : `/img/users/${user.photo}`)
                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-dark-800 object-cover"
                            />
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute bottom-0 right-0 bg-dark-800 text-gray-300 p-1.5 rounded-full border border-white/10 hover:text-white transition shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1 min-w-0">
                        <h1 className="text-2xl font-display font-bold text-white truncate">{user?.name}</h1>
                        <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest mt-1 mb-3">{user?.role || 'Member'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-gray-500">
                            <span className="bg-dark-800 px-3 py-1 rounded-md border border-white/5">{user?.email}</span>
                            <span className="bg-dark-800 px-3 py-1 rounded-md border border-white/5">Joined {new Date(user?.createdAt).getFullYear()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 border-l border-white/5 pl-6 hidden md:flex">
                        <div className="text-center">
                            <p className="text-xl font-bold text-white">{tickets.length}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Passes</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xl font-bold text-white">0</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Events</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDEBAR: IDENTITY */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-dark-900 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span> Bio
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-light">
                                {user?.bio || "No bio added yet. Tell us about yourself."}
                            </p>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Gender</p>
                                        <p className="text-sm text-white capitalize">{user?.gender || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="text-sm text-white">{user?.phone || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-900 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span> Socials
                            </h3>
                            <div className="space-y-3">
                                {user?.socialLinks?.instagram ? (
                                    <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-xs">
                                        <span className="text-gray-300">Instagram</span>
                                        <span className="text-secondary-400">@{user.socialLinks.instagram}</span>
                                    </a>
                                ) : <div className="text-xs text-gray-600 italic">No Instagram linked</div>}

                                {user?.socialLinks?.portfolio && (
                                    <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-xs">
                                        <span className="text-gray-300">Portfolio</span>
                                        <span className="text-secondary-400">View</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT AREA: WALLET / TABS */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                            {/* Tabs */}
                            <div className="flex border-b border-white/5">
                                <button
                                    onClick={() => setActiveTab('passes')}
                                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'passes' ? 'bg-white/5 text-white border-b-2 border-secondary-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    My Passes
                                </button>
                                <button
                                    onClick={() => setActiveTab('membership')}
                                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'membership' ? 'bg-white/5 text-white border-b-2 border-secondary-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Membership Card
                                </button>
                            </div>

                            <div className="p-6 grow bg-dark-900/50">
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
                                                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-white/5 rounded-xl">
                                                    <p className="text-gray-500 text-sm mb-4">No active event passes.</p>
                                                    <button onClick={() => navigate('/events')} className="px-6 py-2 bg-secondary-600/20 text-secondary-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-600/30 transition">
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
                                                <div className="text-gray-500">Membership card not found.</div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
