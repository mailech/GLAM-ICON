import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TicketDetailsModal = ({ ticket, isOpen, onClose }) => {
    if (!isOpen || !ticket) return null;

    const getMediaUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;

        // Handle Backslashes from Windows paths
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

        // Local Fallback
        return `http://localhost:4005${cleanPath.startsWith('/uploads') ? cleanPath : `/uploads${cleanPath}`}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 pb-10 px-4 bg-black/80 backdrop-blur-sm overflow-hidden" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-dark-900 w-full max-w-4xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-white/20 transition"
                        >
                            ✕
                        </button>

                        {/* Left Side: Visuals & Files */}
                        <div className="md:w-5/12 bg-dark-800 border-r border-white/5 flex flex-col md:overflow-y-auto scrollbar-hide">
                            {/* Event Image */}
                            <div className="h-40 relative shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10" />
                                <img
                                    src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                                    alt={ticket.event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-3 left-3 z-20">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${ticket.applicationStatus === 'shortlisted' ? 'bg-green-500 text-dark-900' :
                                        ticket.applicationStatus === 'rejected' ? 'bg-red-500 text-white' :
                                            'bg-yellow-500 text-dark-900'
                                        }`}>
                                        {ticket.applicationStatus || 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Uploaded Files Gallery */}
                            <div className="p-5 space-y-3">
                                <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-2">Your Submissions</h4>

                                {ticket.registrationData?.profilePhoto && (
                                    <div className="group relative rounded-lg overflow-hidden border border-white/10 h-32 w-full bg-black">
                                        <img
                                            src={getMediaUrl(ticket.registrationData.profilePhoto)}
                                            alt="Profile"
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <a href={getMediaUrl(ticket.registrationData.profilePhoto)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-full">
                                                View Full Size
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {ticket.registrationData?.video && (
                                        <a
                                            href={getMediaUrl(ticket.registrationData.video)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 bg-dark-950 border border-white/10 rounded-xl hover:border-secondary-500 transition group text-center"
                                        >
                                            <span className="text-2xl mb-2 block group-hover:scale-110 transition">🎥</span>
                                            <span className="text-xs text-secondary-400 font-bold uppercase">Watch Video</span>
                                        </a>
                                    )}
                                    {ticket.registrationData?.birthCertificate && (
                                        <a
                                            href={getMediaUrl(ticket.registrationData.birthCertificate)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 bg-dark-950 border border-white/10 rounded-xl hover:border-secondary-500 transition group text-center"
                                        >
                                            <span className="text-2xl mb-2 block group-hover:scale-110 transition">📄</span>
                                            <span className="text-xs text-blue-400 font-bold uppercase">View Doc</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="md:w-7/12 p-6 flex flex-col bg-dark-900 md:overflow-y-auto scrollbar-hide">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{ticket.event.title}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <span className="text-secondary-500">📅</span>
                                        {ticket.event.startDate ? new Date(ticket.event.startDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Date Postponed"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-secondary-500">📍</span>
                                        <span className="truncate max-w-[250px]">{ticket.event.location?.address || "Location TBA"}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Ticket Details</h4>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Ticket ID</p>
                                            <p className="text-white font-mono text-sm">{ticket.ticketNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
                                            <p className="text-white font-mono text-sm">₹{ticket.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Attendee</p>
                                            <p className="text-white text-sm truncate">{ticket.registrationData?.name || ticket.user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Age</p>
                                            <p className="text-white text-sm">{ticket.registrationData?.age || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                                            <p className="text-white text-sm">{ticket.registrationData?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                                            <p className="text-white text-sm truncate" title={ticket.registrationData?.email}>{ticket.registrationData?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {ticket.adminFeedback && (
                                    <div className="bg-secondary-900/10 p-4 rounded-xl border border-secondary-500/20">
                                        <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-2">Admin Feedback</h4>
                                        <p className="text-gray-300 text-sm italic">"{ticket.adminFeedback}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-white text-sm font-bold">Official Entry Pass</p>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">Please show this QR code at the venue entrance.</p>
                                </div>
                                <div className="bg-white p-2 rounded-xl shrink-0">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                        alt="QR"
                                        className="w-20 h-20 mix-blend-multiply"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TicketDetailsModal;
