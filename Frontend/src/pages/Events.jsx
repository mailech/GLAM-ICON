import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventBookingModal from '../components/EventBookingModal';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null); // To pass to modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/api/events');
                if (res.data && res.data.data && Array.isArray(res.data.data.events)) {
                    setEvents(res.data.data.events);
                } else {
                    setError("Invalid data format received from server.");
                }

                // Also fetch user to pre-fill modal if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    const userRes = await axios.get('/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(userRes.data.data.user);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load events.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleOpenBooking = (event) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setSelectedEvent(event);
        setIsBookingModalOpen(true);
    };

    const handleBookingConfirm = async (registrationData) => {
        if (!selectedEvent) return;
        const token = localStorage.getItem('token');

        try {
            await axios.post(`/api/events/${selectedEvent._id}/book`, {
                registrationData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Booking Successful! Check your profile for tickets.');
            setIsBookingModalOpen(false);
            navigate('/profile');
        } catch (err) {
            console.error('Booking failed', err);
            const msg = err.response?.data?.message || 'Booking failed.';
            if (msg.includes('invalid signature') || msg.includes('jwt malformed') || err.response?.status === 401) {
                alert('Your session has expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert(msg);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary-400 font-display text-xl animate-pulse">Loading Exclusive Events...</div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4 px-4 text-center">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold font-display">Unable to Load Events</h2>
            <p className="text-gray-400">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 rounded hover:bg-white/20 transition">Retry</button>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 bg-dark-900">
            <EventBookingModal
                event={selectedEvent}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onConfirm={handleBookingConfirm}
                user={user}
            />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white">Upcoming <span className="text-gold italic">Collections</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light">Select an exclusive event to attend. Use your membership pass for instant access.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="group bg-dark-800 rounded-xl overflow-hidden border border-white/5 hover:border-secondary-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full"
                        >
                            <div className="h-64 overflow-hidden relative shrink-0">
                                <img src={event.imageCover} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90"></div>

                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white border border-white/20">
                                    {new Date(event.startDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-8 relative -mt-12 flex flex-col grow">
                                <div className="bg-dark-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/5 mb-4">
                                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-secondary-400 transition-colors line-clamp-1">{event.title}</h3>
                                    <p className="text-secondary-500 text-xs uppercase tracking-widest font-bold line-clamp-1">{event.location?.address || 'Location TBA'}</p>
                                </div>

                                <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed line-clamp-3 grow">{event.description}</p>

                                <div className="flex items-center justify-between mt-auto gap-4">
                                    <span className="text-white font-display font-bold text-xl">₹{event.price}</span>
                                    <button
                                        onClick={() => handleOpenBooking(event)}
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-600 hover:border-secondary-600 transition-all duration-300"
                                    >
                                        Reserve Seat
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
