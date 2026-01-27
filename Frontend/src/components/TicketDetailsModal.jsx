import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TicketDetailsModal = ({ ticket, isOpen, onClose }) => {
    if (!isOpen || !ticket) return null;

    const getMediaUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `http://localhost:4005${cleanPath.startsWith('/uploads') ? cleanPath : `/uploads${cleanPath}`}`;
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-12 pb-4 px-2 md:pt-10 md:pb-10 md:px-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={onClose}>

                    {/* Premium Fixed Close Button (Top Right) */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 z-[1100] bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-secondary-500 transition flex items-center gap-2 group shadow-2xl"
                    >
                        <span>Close</span>
                        <span className="group-hover:rotate-90 transition-transform duration-300">✕</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-dark-900 w-full max-w-4xl rounded-2xl border border-white/10 shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-auto shrink-0 mb-4 md:mb-0"
                    >

                        {/* Left Side: Visuals & Files (Scrollable on mobile naturally with the page) */}
                        <div className="md:w-5/12 bg-dark-800 border-r border-white/5 flex flex-col">
                            {/* Event Image */}
                            <div className="h-48 md:h-64 relative shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
                                <img
                                    src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                                    alt={ticket.event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                                        M-Ticket
                                    </span>
                                </div>
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
                            <div className="p-6 space-y-4 bg-dark-850">
                                <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest border-l-2 border-secondary-500 pl-3">Your Submission</h4>

                                <div className="grid grid-cols-2 gap-3">
                                    {ticket.registrationData?.profilePhoto && (
                                        <div className="group relative rounded-xl overflow-hidden border border-white/10 aspect-square bg-black col-span-2 md:col-span-2">
                                            <img
                                                src={getMediaUrl(ticket.registrationData.profilePhoto)}
                                                alt="Profile"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <a href={getMediaUrl(ticket.registrationData.profilePhoto)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-full hover:scale-105 transition">
                                                    View Full
                                                </a>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-white uppercase tracking-widest backdrop-blur-md">Photo</div>
                                        </div>
                                    )}

                                    {ticket.registrationData?.video && (
                                        <a
                                            href={getMediaUrl(ticket.registrationData.video)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 bg-dark-950 border border-white/10 rounded-xl hover:border-secondary-500 transition group text-center hover:bg-dark-900 flex flex-col justify-center items-center aspect-square"
                                        >
                                            <span className="text-3xl mb-2 block group-hover:scale-110 transition">🎥</span>
                                            <span className="text-[10px] text-secondary-400 font-bold uppercase">Watch Video</span>
                                        </a>
                                    )}
                                    {ticket.registrationData?.birthCertificate && (
                                        <a
                                            href={getMediaUrl(ticket.registrationData.birthCertificate)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 bg-dark-950 border border-white/10 rounded-xl hover:border-blue-500 transition group text-center hover:bg-dark-900 flex flex-col justify-center items-center aspect-square"
                                        >
                                            <span className="text-3xl mb-2 block group-hover:scale-110 transition">📄</span>
                                            <span className="text-[10px] text-blue-400 font-bold uppercase">View Doc</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="md:w-7/12 p-6 md:p-8 flex flex-col bg-dark-900">
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">{ticket.event.title}</h2>
                                <div className="flex flex-col gap-2 text-sm text-gray-400 mt-4">
                                    <span className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                        <span className="text-xl">📅</span>
                                        <span className="font-medium text-gray-300">{ticket.event.startDate ? new Date(ticket.event.startDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Date Postponed"}</span>
                                    </span>
                                    <span className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                        <span className="text-xl">📍</span>
                                        <span className="font-medium text-gray-300 line-clamp-2">{ticket.event.location?.address || "Location TBA"}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="bg-dark-950 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Participant Details</h4>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
                                            <p className="text-secondary-400 font-mono text-sm font-bold tracking-wider">{ticket.ticketNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Price</p>
                                            <p className="text-white font-mono text-sm">₹{ticket.price}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Name</p>
                                            <p className="text-white text-lg font-display font-bold">{ticket.registrationData?.name || ticket.user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Age</p>
                                            <p className="text-white text-sm">{ticket.registrationData?.age || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-white text-sm font-mono">{ticket.registrationData?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {ticket.adminFeedback && (
                                    <div className="bg-gradient-to-br from-secondary-900/20 to-transparent p-4 rounded-xl border border-secondary-500/30">
                                        <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span>💬</span> Judge's Feedback
                                        </h4>
                                        <p className="text-gray-200 text-sm italic border-l-2 border-secondary-500 pl-3">"{ticket.adminFeedback}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-white text-sm font-bold">Entry Pass QR</p>
                                    <p className="text-gray-500 text-[9px] uppercase tracking-widest mt-1">Scan at venue</p>
                                </div>
                                <div className="bg-white p-2 rounded-xl shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                        alt="QR"
                                        className="w-16 h-16 mix-blend-multiply"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TicketDetailsModal;
