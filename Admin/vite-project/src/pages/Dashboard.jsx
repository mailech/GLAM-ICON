import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [page]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await api.get('/api/tickets/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setStats(res.data.data.stats);
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    }

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const res = await api.get(`/api/tickets/admin/all?sort=-createdAt&page=${page}&limit=20`, {
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
            await api.patch(`/api/tickets/${ticketId}`, {
                status,
                feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(tickets.map(t =>
                t._id === ticketId ? { ...t, applicationStatus: status, adminFeedback: feedback } : t
            ));
            fetchStats();
        } catch (err) {
            alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
        }
    };

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const normalizedUrl = url.replace(/\\/g, '/');
        const cleanUrl = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        if (cleanUrl.includes('cloudinary')) return url; // Should have been http already
        if (cleanUrl.startsWith('/uploads/')) return `${baseUrl}${cleanUrl}`;
        return `${baseUrl}/uploads${cleanUrl}`;
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading && tickets.length === 0) return <div className="text-white text-center pt-20">Loading Admin Dashboard...</div>;

    const StatsCard = ({ title, value, color, icon }) => (
        <div className="bg-dark-800 p-6 rounded-xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className={`text-4xl font-display font-bold ${color}`}>{value}</h3>
            </div>
            <div className={`text-2xl opacity-20 group-hover:opacity-100 transition-opacity ${color}`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-900 text-white p-4 md:p-6 relative">
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
                                    <source src={getMediaUrl(selectedMedia.url)} />
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display font-bold">Admin Portal</h1>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Glam Iconic India</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-start sm:items-center">
                        {/* Stats Summary - Mini */}
                        <div className="flex gap-6 md:mr-8 md:border-r border-white/10 md:pr-8 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-left md:text-right">
                                <span className="block text-xl md:text-2xl font-bold text-white">{stats.total}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Total</span>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const response = await axios.get('/api/tickets/admin/export', {
                                            headers: { Authorization: `Bearer ${token}` },
                                            responseType: 'blob',
                                        });
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', 'participants.xlsx');
                                        document.body.appendChild(link);
                                        link.click();
                                    } catch (err) {
                                        console.error("Export failed", err);
                                        alert("Failed to export Excel file.");
                                    }
                                }}
                                className="sm:hidden px-4 py-2 bg-green-600/20 text-green-500 border border-green-600/50 rounded text-xs font-bold uppercase tracking-widest hover:bg-green-600/40 transition"
                            >
                                Export
                            </button>
                            <button
                                onClick={handleLogout}
                                className="sm:hidden px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            {['all', 'pending', 'shortlisted', 'rejected', 'completed'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`whitespace-nowrap px-4 py-2 rounded uppercase text-xs font-bold tracking-wider transition ${filter === f ? 'bg-secondary-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('token');
                                    const response = await axios.get('/api/tickets/admin/export', {
                                        headers: { Authorization: `Bearer ${token}` },
                                        responseType: 'blob',
                                    });
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', 'participants.xlsx');
                                    document.body.appendChild(link);
                                    link.click();
                                } catch (err) {
                                    console.error("Export failed", err);
                                    alert("Failed to export Excel file.");
                                }
                            }}
                            className="hidden sm:block px-4 py-2 bg-green-600 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-green-500 transition ml-2"
                        >
                            Export Excel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:block px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* --- ANALYTICS CARDS --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatsCard title="Total" value={stats.total} color="text-white" icon="📋" />
                    <StatsCard title="Pending" value={stats.pending} color="text-yellow-400" icon="⏳" />
                    <StatsCard title="Shortlisted" value={stats.shortlisted} color="text-green-400" icon="✨" />
                    <StatsCard title="Rejected" value={stats.rejected} color="text-red-400" icon="🚫" />
                </div>

                {/* Mobile Card View (Visible only on small screens) */}
                <div className="md:hidden flex flex-col gap-4">
                    {filteredTickets.map(ticket => (
                        <div key={ticket._id} className="bg-dark-800 p-5 rounded-xl border border-white/5 relative shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-mono text-secondary-400 block mb-1">{ticket.ticketNumber}</span>
                                    <h3 className="font-bold text-lg text-white">{ticket.user?.name || 'Unknown'}</h3>
                                    <p className="text-xs text-gray-400">{ticket.event?.title}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.applicationStatus === 'shortlisted' ? 'bg-green-500/20 text-green-400' :
                                    ticket.applicationStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {ticket.applicationStatus || 'Pending'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4 bg-dark-900/50 p-3 rounded-lg">
                                {ticket.registrationData?.age && <div>Age: <span className="text-white">{ticket.registrationData.age}</span></div>}
                                {ticket.registrationData?.height && <div>Height: <span className="text-white">{ticket.registrationData.height}</span></div>}
                                <div className="col-span-2 truncate">{ticket.user?.email}</div>
                                {ticket.registrationData?.phone && <div className="col-span-2">{ticket.registrationData?.phone}</div>}
                            </div>

                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {ticket.registrationData?.profilePhoto && (
                                    <button onClick={() => setSelectedMedia({ type: 'image', url: ticket.registrationData.profilePhoto })} className="px-4 py-2 bg-dark-700/50 text-white border border-white/10 rounded text-xs font-medium hover:bg-dark-600 flex-shrink-0 flex items-center gap-2">
                                        <span>📷</span> Photo
                                    </button>
                                )}
                                {ticket.registrationData?.video && (
                                    <button onClick={() => setSelectedMedia({ type: 'video', url: ticket.registrationData.video })} className="px-4 py-2 bg-dark-700/50 text-white border border-white/10 rounded text-xs font-medium hover:bg-dark-600 flex-shrink-0 flex items-center gap-2">
                                        <span>🎥</span> Video
                                    </button>
                                )}
                                {ticket.registrationData?.birthCertificate && (
                                    <button onClick={() => setSelectedMedia({ type: 'image', url: ticket.registrationData.birthCertificate })} className="px-4 py-2 bg-dark-700/50 text-white border border-white/10 rounded text-xs font-medium hover:bg-dark-600 flex-shrink-0 flex items-center gap-2">
                                        <span>📄</span> Cert
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => updateStatus(ticket._id, 'shortlisted')}
                                    className="py-3 bg-green-600 text-white rounded text-xs font-bold uppercase hover:bg-green-500 shadow-lg shadow-green-900/20"
                                >
                                    Shortlist
                                </button>
                                <button
                                    onClick={() => updateStatus(ticket._id, 'rejected')}
                                    className="py-3 bg-red-600/20 border border-red-600/50 text-red-500 rounded text-xs font-bold uppercase hover:bg-red-600/30"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View (Hidden on mobile) */}
                <div className="hidden md:block bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
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
