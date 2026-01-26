import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TicketCard = ({ ticket, user, onClick }) => {
    if (!ticket) return null;
    const [isFlipped, setIsFlipped] = useState(false);

    const isEventTicket = !!ticket.event;

    // --- 3D TILT LOGIC ---
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleFlip = (e) => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
    }

    // Image URL Helper
    const getPhotoUrl = (path) => {
        if (!path) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
        if (path.startsWith('http')) return path;
        return `/img/users/${path}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="perspective-1000 w-full max-w-[320px] mx-auto font-sans h-[500px]"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={isEventTicket ? onClick : handleFlip} // Event: open modal on click? User said "same type of card", maybe flip too? Let's make clicking the "Flip Button" flip it, and clicking card open modal? Or click card to flip? User requirement: "QR on back". Usually card flip is interaction.
                // Let's make the card FLIP on click for the QR code view as requested.
                // But for events we usually want "Details". 
                // Let's add a "Flip" button in the corner, or just click to flip. For Events, we need to open details modal.
                // I will add a small button to Flip, or make the whole card flip.
                // If I click to flip, how do I view details?
                // I'll make the whole card flip on click. And maybe a button "View Details" on the back?
                // Actually, for Membership card, flipping is the primary interaction.
                // For Event card, `onClick` passed from parent usually opens `TicketDetailsModal`.
                // I'll wrap the logic: Click = Flip. Inside Back of card = Button to "View Details" (for events).
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{
                    rotateX: isEventTicket ? 0 : rotateX,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full cursor-pointer"
            >
                {/* --- FRONT OF CARD --- */}
                <div
                    className="absolute inset-0 bg-dark-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    {/* Background & Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-black z-0" />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full bg-dark-900">
                        {/* Header Image / Badge */}
                        <div className="h-1/3 relative overflow-hidden bg-dark-950">
                            {isEventTicket ? (
                                <img src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} alt="Event" className="w-full h-full object-cover opacity-90" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-b from-secondary-900/40 to-dark-900 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-gold via-white to-gold shadow-lg shadow-gold/20 z-10">
                                        <img src={getPhotoUrl(user?.photo)} alt="User" className="w-full h-full rounded-full object-cover bg-dark-900" />
                                    </div>
                                </div>
                            )}

                            {!isEventTicket && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 border border-gold/50 rounded-full text-gold text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm z-20">
                                    Elite Member
                                </div>
                            )}
                        </div>

                        {/* Body Details */}
                        <div className="flex-1 p-5 flex flex-col items-center text-center bg-dark-900">
                            {isEventTicket ? (
                                <>
                                    <h3 className="text-xl font-display font-bold text-white mb-1 line-clamp-2">{ticket.event.title}</h3>
                                    <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-4">Official Event Pass</p>

                                    <div className="w-full space-y-3 mt-2 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span className="text-gray-500 text-xs uppercase">Date</span>
                                            <span className="text-white text-xs font-bold">{new Date(ticket.event.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-xs uppercase">Status</span>
                                            <span className={`text-xs font-bold uppercase ${ticket.applicationStatus === 'shortlisted' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {ticket.applicationStatus || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-display font-bold text-white mb-1">{user?.name}</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">{user?.role || 'Member'}</p>

                                    <div className="w-full space-y-2 text-left bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Email</span>
                                            <span className="text-white text-[10px] truncate max-w-[140px] font-mono">{user?.email}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">DOB</span>
                                            <span className="text-white text-[10px] font-mono">{user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Gender</span>
                                            <span className="text-white text-[10px] capitalize font-mono">{user?.gender || 'N/A'}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-3 text-center border-t border-white/10 bg-dark-800">
                            <span className="text-[10px] text-secondary-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                                <span>↻</span> Click Card to Flip
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- BACK OF CARD (QR CODE) --- */}
                <div
                    className="absolute inset-0 bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 border-gold"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: 1 // Ensure stacking context
                    }}
                >
                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-dark-900 to-transparent opacity-10"></div>

                    <h3 className="text-dark-900 font-display font-bold text-xl mb-1 uppercase tracking-widest">
                        {isEventTicket ? "Entry Pass" : "Identity"}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Scan for Verification</p>

                    <div className="bg-white p-3 rounded-xl border-2 border-dark-900 shadow-2xl mb-6">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qrCode}`}
                            alt="QR Code"
                            className="w-48 h-48 block mix-blend-multiply"
                        />
                    </div>

                    <div className="font-mono text-dark-900 bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold tracking-[0.2em] border border-gray-300">
                        {ticket.ticketNumber}
                    </div>

                    {isEventTicket && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onClick(); }}
                            className="mt-6 px-6 py-2 bg-dark-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-secondary-600 transition shadow-lg"
                        >
                            Open Details
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TicketCard;
