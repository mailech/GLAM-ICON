import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, shortlisted, rejected
    const [page, setPage] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState(null); // { type: 'image' | 'video', url: '' }

    useEffect(() => {
        fetchTickets();
    }, [page]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // If no token, redirect to login (handled by parent or axios interceptor usually, but here manual check)
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const res = await axios.get(`/api/tickets/admin/all?sort=-createdAt&page=${page}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.data && res.data.data.data) {
                setTickets(res.data.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch tickets", err);
            if (err.response && err.response.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (ticketId, status) => {
        const feedback = prompt("Enter feedback for the user (optional):", "Review completed.");
        if (feedback === null) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/tickets/${ticketId}`, {
                status,
                feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistic update
            setTickets(tickets.map(t =>
                t._id === ticketId ? { ...t, applicationStatus: status, adminFeedback: feedback } : t
            ));
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update status");
        }
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        return (t.applicationStatus || 'pending') === filter;
    });

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Clean up any double slashes just in case
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        if (cleanUrl.startsWith('/uploads/')) return `http://localhost:4005${cleanUrl}`;
        return `http://localhost:4005/uploads${cleanUrl}`;
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading && tickets.length === 0) return <div className="text-white text-center pt-20">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-dark-900 text-white p-6 relative">
            {/* Media Viewer Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedMedia(null)}>
                    <div className="relative max-w-4xl w-full bg-dark-800 rounded-xl overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-white/20 transition"
                        >
                            ✕
                        </button>

                        <div className="flex justify-center items-center bg-black min-h-[50vh] max-h-[80vh]">
                            {selectedMedia.type === 'video' ? (
                                <video controls autoPlay className="max-w-full max-h-[80vh]">
                                    <source src={getMediaUrl(selectedMedia.url)} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={getMediaUrl(selectedMedia.url)}
                                    alt="Detail"
                                    className="max-w-full max-h-[80vh] object-contain"
                                />
                            )}
                        </div>
                        <div className="p-4 bg-dark-900 border-t border-white/5 text-center">
                            <a
                                href={getMediaUrl(selectedMedia.url)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-secondary-400 text-xs font-bold uppercase tracking-widest hover:text-white"
                            >
                                Open Original in New Tab
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Glam Icon India</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            {['all', 'pending', 'shortlisted', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded uppercase text-xs font-bold tracking-wider transition ${filter === f ? 'bg-secondary-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">ID</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">User</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Event</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Details</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Files</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTickets.map(ticket => (
                                    <tr key={ticket._id} className="hover:bg-white/5 transition">
                                        <td className="p-4 font-mono text-xs text-secondary-400">{ticket.ticketNumber}</td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold">{ticket.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{ticket.user?.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm truncate max-w-[150px]">{ticket.event?.title || 'Unknown Event'}</div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {ticket.registrationData?.phone && <div>Phone: {ticket.registrationData.phone}</div>}
                                            {ticket.registrationData?.age && <div>Age: {ticket.registrationData.age}</div>}
                                            {ticket.registrationData?.height && <div>Height: {ticket.registrationData.height}</div>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-2 text-xs">
                                                {ticket.registrationData?.profilePhoto && (
                                                    <button
                                                        onClick={() => setSelectedMedia({ type: 'image', url: ticket.registrationData.profilePhoto })}
                                                        className="text-left text-blue-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        <span>📷</span> Photo
                                                    </button>
                                                )}
                                                {ticket.registrationData?.birthCertificate && (
                                                    <button
                                                        onClick={() => setSelectedMedia({ type: 'image', url: ticket.registrationData.birthCertificate })}
                                                        className="text-left text-blue-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        <span>📄</span> Birth Cert
                                                    </button>
                                                )}
                                                {ticket.registrationData?.video && (
                                                    <button
                                                        onClick={() => setSelectedMedia({ type: 'video', url: ticket.registrationData.video })}
                                                        className="text-left text-blue-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        <span>🎥</span> Play Video
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ticket.applicationStatus === 'shortlisted' ? 'bg-green-500/20 text-green-400' :
                                                ticket.applicationStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {ticket.applicationStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(ticket._id, 'shortlisted')}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold uppercase hover:bg-green-500"
                                                >
                                                    Shortlist
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(ticket._id, 'rejected')}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold uppercase hover:bg-red-500"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 flex justify-between items-center border-t border-white/5 bg-dark-800">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white/5 rounded text-xs uppercase disabled:opacity-50 hover:bg-white/10"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-500">Page {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white/5 rounded text-xs uppercase hover:bg-white/10"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
