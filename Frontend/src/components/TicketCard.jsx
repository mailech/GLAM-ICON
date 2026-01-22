import React from 'react';
import { motion } from 'framer-motion';

const TicketCard = ({ ticket, user }) => {
    if (!ticket) return null;

    const isEventTicket = !!ticket.event;

    // EVENT TICKET LAYOUT
    if (isEventTicket) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-3xl mx-auto drop-shadow-2xl filter"
            >
                <div className="flex flex-col md:flex-row bg-dark-800 rounded-3xl overflow-hidden border border-white/10 relative">

                    {/* Left Section: Visuals */}
                    <div className="md:w-1/3 relative h-48 md:h-auto bg-dark-900 overflow-hidden">
                        <div className="absolute inset-0 bg-secondary-600/20 mix-blend-overlay z-10"></div>
                        <img
                            src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                            alt="Event Cover"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark-900 to-transparent z-20">
                            <span className="inline-block px-3 py-1 bg-secondary-500 text-dark-900 text-xs font-bold uppercase tracking-widest rounded-full">
                                Event Pass
                            </span>
                        </div>
                    </div>

                    {/* Middle Section: Event Details */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-r border-dashed border-white/10 relative">
                        {/* Perforation visual for mobile (bottom) / desktop (right) */}
                        <div className="absolute -right-3 top-[-10px] w-6 h-6 bg-dark-900 rounded-full z-20 hidden md:block"></div>
                        <div className="absolute -right-3 bottom-[-10px] w-6 h-6 bg-dark-900 rounded-full z-20 hidden md:block"></div>

                        <div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">{ticket.event.title || "Exclusive Event"}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-light mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-secondary-500">📅</span>
                                    {ticket.event.startDate ? new Date(ticket.event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Date Postponed"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-secondary-500">📍</span>
                                    {ticket.event.location?.address || ticket.event.location || "Secret Location"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border-2 border-secondary-500/50 p-0.5">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="User" className="w-full h-full rounded-full bg-dark-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Attendee</p>
                                <p className="text-white font-medium">{user?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Stub & QR */}
                    <div className="md:w-64 bg-dark-900/50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-800 to-dark-900">
                        <div className="bg-white p-2 rounded-lg mb-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                alt="QR Code"
                                className="w-24 h-24 mix-blend-multiply"
                            />
                        </div>
                        <p className="font-mono text-secondary-400 text-xs tracking-widest mb-1">{ticket.ticketNumber}</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Scan for Entry</p>

                        <div className="mt-4 pt-4 border-t border-white/10 w-full text-center">
                            <p className="text-2xl font-display font-bold text-white">₹{ticket.price}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admit One</p>
                        </div>
                    </div>

                </div>
            </motion.div>
        );
    }

    // MEMBERSHIP CARD LAYOUT (Enhanced)
    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="relative max-w-sm w-full mx-auto font-sans"
        >
            <div className="bg-dark-900 rounded-2xl overflow-hidden relative min-h-[500px] flex flex-col shadow-2xl border border-gold/30">
                {/* Golden Noise Texture/Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                {/* Header */}
                <div className="bg-gradient-to-b from-dark-800 to-dark-900 p-8 text-center relative z-10 border-b border-white/5">
                    <div className="inline-block px-4 py-1 border border-gold/50 rounded-full text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                        Elite Membership
                    </div>
                    <div className="w-24 h-24 mx-auto rounded-full p-[3px] bg-gradient-to-br from-gold via-white to-gold shadow-lg shadow-gold/20 mb-4">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                            alt="Profile"
                            className="w-full h-full rounded-full bg-dark-900 object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">{user?.name}</h2>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col items-center justify-between relative z-10">

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Member Since</span>
                            <span className="text-xs text-white font-mono">{new Date(user?.createdAt).getFullYear() || '2026'}</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                alt="QR Code"
                                className="w-24 h-24 block mix-blend-multiply"
                            />
                        </div>
                        <p className="mt-4 text-xs font-mono text-gold/80 tracking-widest">{ticket.ticketNumber}</p>
                    </div>

                </div>

                {/* Footer decoration */}
                <div className="h-2 w-full bg-gradient-to-r from-dark-900 via-gold to-dark-900 opacity-50"></div>
            </div>
        </motion.div>
    );
};

export default TicketCard;
