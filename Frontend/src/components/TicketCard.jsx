import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TicketCard = ({ ticket, user, onClick }) => {
    if (!ticket) return null;

    const isEventTicket = !!ticket.event;

    // --- 3D TILT LOGIC FOR MEMBERSHIP CARD ---
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
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

    // EVENT TICKET LAYOUT (Compact)
    if (isEventTicket) {
        return (
            <motion.div
                layoutId={`ticket-${ticket._id}`}
                onClick={onClick}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full drop-shadow-xl filter cursor-pointer group"
            >
                <div className="flex flex-col sm:flex-row bg-dark-800 rounded-2xl overflow-hidden border border-white/10 relative h-auto sm:h-48">

                    {/* Left Section: Visuals */}
                    <div className="sm:w-32 lg:w-40 relative h-32 sm:h-full bg-dark-900 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-secondary-600/20 mix-blend-overlay z-10"></div>
                        <img
                            src={ticket.event.imageCover || ticket.event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                            alt="Event"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Middle Section: Event Details */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between border-r border-dashed border-white/5 relative bg-dark-800">
                        {/* Perforation holes */}
                        <div className="absolute -right-2 top-[-6px] w-4 h-4 bg-dark-900 rounded-full z-20 hidden sm:block"></div>
                        <div className="absolute -right-2 bottom-[-6px] w-4 h-4 bg-dark-900 rounded-full z-20 hidden sm:block"></div>

                        <div>
                            <h2 className="text-lg sm:text-xl font-display font-bold text-white mb-1 leading-tight line-clamp-1">{ticket.event.title}</h2>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-light mb-2">
                                <span className="flex items-center gap-1">
                                    <span className="text-secondary-500">📅</span>
                                    {ticket.event.startDate ? new Date(ticket.event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : "Date Postponed"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-secondary-500">📍</span>
                                    <span className="truncate max-w-[150px]">{ticket.event.location?.address || "Location TBA"}</span>
                                </span>
                            </div>
                        </div>

                        {/* Status Display */}
                        <div className="mt-3 bg-dark-900/50 p-2 rounded border border-white/5">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Status</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${ticket.applicationStatus === 'shortlisted' ? 'text-green-400' :
                                    ticket.applicationStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                    }`}>
                                    {ticket.applicationStatus || 'Pending'}
                                </span>
                            </div>
                            {ticket.applicationStatus === 'shortlisted' && (
                                <div className="text-[10px] text-green-400/80 leading-tight">
                                    Congratulations! You've been shortlisted.
                                </div>
                            )}
                        </div>

                        {/* Registration Details Display */}
                        <div className="mt-3 bg-dark-900/50 p-2 rounded border border-white/5 space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-gray-500">
                                <span className="uppercase tracking-wider">Registration Data</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {ticket.registrationData?.age && (
                                    <div className="text-[10px] text-gray-400">
                                        <span className="text-gray-600 block text-[8px] uppercase">Age</span>
                                        {ticket.registrationData.age}
                                    </div>
                                )}
                                {ticket.registrationData?.phone && (
                                    <div className="text-[10px] text-gray-400">
                                        <span className="text-gray-600 block text-[8px] uppercase">Phone</span>
                                        {ticket.registrationData.phone}
                                    </div>
                                )}
                            </div>
                            {ticket.registrationData?.profilePhoto && (
                                <div className="mt-1 pt-1 border-t border-white/5">
                                    <a
                                        href={`http://localhost:4005${ticket.registrationData.profilePhoto}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-secondary-500 hover:text-secondary-400 flex items-center gap-1"
                                    >
                                        <span>📷</span> View Submitted Photo
                                    </a>
                                </div>
                            )}
                            {ticket.registrationData?.birthCertificate && (
                                <div className="mt-1">
                                    <a
                                        href={`http://localhost:4005${ticket.registrationData.birthCertificate}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <span>📄</span> View Birth Certificate
                                    </a>
                                </div>
                            )}
                            {ticket.registrationData?.video && (
                                <div className="mt-1">
                                    <a
                                        href={`http://localhost:4005${ticket.registrationData.video}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                    >
                                        <span>🎥</span> Watch Audition Video
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/5">
                            <div className="w-6 h-6 rounded-full border border-secondary-500/50 p-0.5 shrink-0">
                                <img src={user?.photo && user?.photo !== 'default.jpg' ? `/img/users/${user.photo}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="User" className="w-full h-full rounded-full bg-dark-700 object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Attendee</p>
                                <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Stub & QR */}
                    <div className="sm:w-40 bg-dark-900/50 p-4 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-white/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-800 to-dark-900">
                        <div className="bg-white p-1.5 rounded-md mb-2">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                alt="QR"
                                className="w-16 h-16 mix-blend-multiply"
                            />
                        </div>
                        <p className="font-mono text-secondary-400 text-[10px] tracking-widest mb-0.5">{ticket.ticketNumber.slice(-6)}</p>

                        <div className="mt-2 text-center">
                            <p className="text-lg font-display font-bold text-white">₹{ticket.price}</p>
                        </div>
                    </div>
                </div>
            </motion.div >
        );
    }

    // MEMBERSHIP CARD LAYOUT (Animated Holographic 3D)
    return (
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="perspective-1000 w-full max-w-[300px] mx-auto font-sans"
            style={{ perspective: "1000px" }} // Ensure 3D perspective
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full aspect-[1/1.6] rounded-xl cursor-default"
            >
                {/* Visual Card Container */}
                <div className="absolute inset-0 bg-dark-900 rounded-xl overflow-hidden shadow-2xl border border-gold/30 flex flex-col backface-hidden">
                    {/* Holographic Sheen Overlay */}
                    <motion.div
                        className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                        style={{
                            x: useTransform(x, [-0.5, 0.5], ["100%", "-100%"]),
                            y: useTransform(y, [-0.5, 0.5], ["100%", "-100%"]),
                            opacity: useTransform(mouseXSpring, [-0.5, 0, 0.5], [0, 0.3, 0]),
                        }}
                    />

                    {/* Golden Noise Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

                    {/* Reflected Light sheen on edges */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 z-30"></div>

                    {/* Header */}
                    <div className="bg-gradient-to-b from-dark-800 to-dark-900 p-6 text-center relative z-10 border-b border-white/5">
                        <div className="inline-block px-3 py-0.5 border border-gold/50 rounded-full text-gold text-[8px] font-bold tracking-[0.2em] uppercase mb-3 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                            Elite Member
                        </div>
                        <motion.div
                            className="w-20 h-20 mx-auto rounded-full p-[2px] bg-gradient-to-br from-gold via-white to-gold shadow-lg shadow-gold/20 mb-3"
                            style={{ translateZ: "20px" }} // Pop out effect
                        >
                            <img
                                src={user?.photo && user?.photo !== 'default.jpg' ? `/img/users/${user.photo}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-dark-900 object-cover"
                            />
                        </motion.div>
                        <motion.h2 style={{ translateZ: "10px" }} className="text-lg font-display font-bold text-white tracking-wide truncate px-2">{user?.name}</motion.h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{user?.role || 'Member'}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-between relative z-10">
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Status</span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Since</span>
                                <span className="text-[10px] text-white font-mono">{new Date(user?.createdAt).getFullYear() || '2026'}</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <motion.div style={{ translateZ: "15px" }} className="bg-white p-1.5 rounded-lg inline-block shadow-lg">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                    alt="QR"
                                    className="w-16 h-16 block mix-blend-multiply"
                                />
                            </motion.div>
                            <p className="mt-2 text-[10px] font-mono text-gold/80 tracking-widest">{ticket.ticketNumber}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TicketCard;
