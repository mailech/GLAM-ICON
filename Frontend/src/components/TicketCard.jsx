import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TicketCard = ({ ticket, user, onClick }) => {
    if (!ticket) return null;
    const [isFlipped, setIsFlipped] = useState(false);
    const isEventTicket = !!ticket.event;

    // --- UTILS ---
    const getPhotoUrl = (path) => {
        if (!path) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
        if (path.startsWith('http')) return path;
        return `/img/users/${path}`;
    };

    const handleFlip = (e) => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
    };

    // --- EVENT TICKET COMPONENT (Responsive: Vertical Mobile / Horizontal Desktop) ---
    if (isEventTicket) {
        return (
            <div className="w-full relative perspective-1000 group cursor-pointer" onClick={handleFlip}>
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full relative"
                >
                    {/* --- FRONT SIDE --- */}
                    <div className="backface-hidden w-full relative" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>

                        {/* MOBILE VIEW (Premium Dark/Gold Style) */}
                        <div className="md:hidden w-full bg-dark-900/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative">
                            {/* Glowing Gold Accent Top */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-600 via-secondary-300 to-secondary-600"></div>

                            {/* Top Image Section */}
                            <div className="h-56 relative overflow-hidden group-hover:h-60 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
                                <img
                                    src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                                    alt="Event"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-white/10">
                                        M-Ticket
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20 pr-4">
                                    <h2 className="text-2xl font-display font-bold text-white leading-tight mb-1 text-shadow-lg">{ticket.event.title}</h2>
                                    <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span>📅 {new Date(ticket.event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/50"></span>
                                        <span>📍 {ticket.event.location?.address ? ticket.event.location.address.split(',')[0] : 'Mumbai'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="p-5 relative bg-gradient-to-b from-dark-900 to-dark-950">
                                {/* Decorative perforated line (subtle) */}
                                <div className="absolute -top-4 left-0 w-full h-4 z-20 flex justify-between items-end px-2">
                                    <div className="w-full border-b border-dashed border-white/10"></div>
                                </div>

                                {/* Status & Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                        <p className={`text-xs font-bold uppercase ${ticket.applicationStatus === 'shortlisted' ? 'text-green-400' :
                                                ticket.applicationStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                            }`}>
                                            {ticket.applicationStatus || 'In Review'}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Ticket ID</p>
                                        <p className="text-xs font-mono text-white tracking-wider">{ticket.ticketNumber.slice(-6)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                                        className="w-full py-3 bg-secondary-900/20 border border-secondary-500/30 text-secondary-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-secondary-500 hover:text-white transition flex items-center justify-center gap-2"
                                    >
                                        <span>📂</span> View Submitted Files
                                    </button>

                                    <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                                        <span>Admit One Person</span>
                                        <span className="flex items-center gap-1 text-white opacity-50">
                                            Flip for QR ↻
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP VIEW (Horizontal Luxury Card) */}
                        <div className="hidden md:flex h-48 rounded-xl overflow-hidden shadow-2xl relative">
                            {/* Image Section */}
                            <div className="w-2/5 h-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-10" />
                                <img
                                    src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                                    alt="Event"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest">
                                    {new Date(ticket.event.startDate).getFullYear()} Series
                                </div>
                            </div>

                            {/* Details Section (Dark Luxury) */}
                            <div className="w-3/5 h-full bg-dark-900 relative p-4 flex flex-col justify-between border-l border-white/10">
                                {/* Decorative cutouts */}
                                <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between py-2">
                                    <div className="w-4 h-4 rounded-full bg-dark-950 -ml-2 filter drop-shadow-sm"></div>
                                    <div className="border-l-2 border-dashed border-white/10 h-full mx-auto my-1"></div>
                                    <div className="w-4 h-4 rounded-full bg-dark-950 -ml-2 filter drop-shadow-sm"></div>
                                </div>

                                <div>
                                    <h3 className="text-white font-display uppercase tracking-wider text-[10px] mb-1 opacity-60">Official Event Pass</h3>
                                    <h2 className="text-xl font-display font-bold text-white leading-tight mb-2 line-clamp-2 gradient-text-gold">{ticket.event.title}</h2>
                                    <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
                                        <span>📅 {new Date(ticket.event.startDate).toLocaleDateString()}</span>
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Status</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.applicationStatus === 'shortlisted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {ticket.applicationStatus || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Flip to Scan</p>
                                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center ml-auto">
                                            <span className="text-white text-[10px]">↻</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK SIDE (QR CODE) --- */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl md:rounded-xl overflow-hidden shadow-2xl bg-white text-black flex flex-col md:flex-row"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white relative">
                            {/* Mobile Back Button for Flip */}
                            <button onClick={handleFlip} className="absolute top-4 right-4 text-gray-400 p-2 md:hidden">✕</button>

                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Entry Pass QR</p>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qrCode}`}
                                alt="QR"
                                className="w-40 h-40 md:w-32 md:h-32 mix-blend-multiply mb-4"
                            />
                            <p className="font-mono text-sm font-bold tracking-[0.2em] text-gray-800">{ticket.ticketNumber}</p>
                            <p className="text-[10px] text-green-600 font-bold uppercase mt-2 bg-green-50 px-3 py-1 rounded-full">
                                {ticket.applicationStatus === 'shortlisted' ? 'Access Granted' : 'Verification Required'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MEMBERSHIP CARD (Vertical Identity) ---
    // UPDATED DESIGN: Cleaner, Solid Matte, Large Photo, No "Dust"
    return (
        <div className="w-[300px] h-[480px] mx-auto relative perspective-1000 group cursor-pointer" onClick={handleFlip}>
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full relative"
            >
                {/* --- FRONT (Redesigned) --- */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-black"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>

                    {/* Background: Subtle gradient instead of dust */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
                    {/* Golden accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"></div>

                    {/* Content Layer */}
                    <div className="relative z-10 w-full h-full p-8 flex flex-col items-center text-center">

                        {/* Brand Logo - Top */}
                        <div className="mb-8 opacity-80">
                            <h2 className="text-gold font-display text-xs tracking-[0.4em] uppercase">Glam Iconic</h2>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">India</p>
                        </div>

                        {/* Profile Photo - Large & Clean */}
                        <div className="relative w-40 h-40 mb-6">
                            {/* Outer Glow Ring */}
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/40 to-transparent blur-sm"></div>
                            <div className="w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-gray-800 relative z-10 shadow-2xl">
                                <img src={getPhotoUrl(user?.photo)} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            {/* Status Indicator */}
                            <div className="absolute bottom-2 right-2 z-20 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-white/10">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse"></div>
                            </div>
                        </div>

                        {/* Name & Role */}
                        <div className="w-full mb-8">
                            <h1 className="text-2xl font-display text-white font-bold leading-tight mb-2 tracking-wide">{user?.name}</h1>
                            <div className="inline-block px-3 py-1 border border-gold/30 rounded-full bg-gold/5 backdrop-blur-sm">
                                <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold">Participant</span>
                            </div>
                        </div>

                        {/* ID Footer */}
                        <div className="mt-auto w-full pt-6 border-t border-white/5 flex justify-between items-center text-gray-500">
                            <div className="text-left">
                                <p className="text-[8px] uppercase tracking-widest mb-0.5">Member ID</p>
                                <p className="text-[10px] font-mono text-gray-300">{user?.memberId || ticket.ticketNumber.slice(0, 15)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] uppercase tracking-widest mb-0.5">Joined</p>
                                <p className="text-[10px] font-mono text-gray-300">{new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BACK (QR) --- */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl bg-[#F5F5F5] flex flex-col items-center justify-center p-8 text-center"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}>

                    <div className="w-full border-b border-gray-300 pb-6 mb-8 flex justify-between items-center opacity-80">
                        <div className="text-left">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Verification</p>
                            <p className="text-black font-display font-bold uppercase tracking-widest text-sm">Valid Identity</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center bg-white">
                            <span className="text-black text-xs font-serif italic">Gi</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-8">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qrCode}`}
                            alt="QR Code"
                            className="w-48 h-48 block mix-blend-multiply"
                        />
                    </div>

                    <div className="w-full bg-white border border-gray-200 p-3 rounded-lg font-mono text-xs text-black tracking-[0.2em] mb-2 shadow-sm">
                        {user?.memberId || ticket.ticketNumber}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TicketCard;
