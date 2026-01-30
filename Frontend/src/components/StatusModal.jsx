import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatusModal = ({ isOpen, onClose, type = 'success', title, message, actionLabel, onAction }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative text-center"
            >
                <div className={`h-2 w-full ${isSuccess ? 'bg-secondary-500' : 'bg-red-500'}`}></div>

                <div className="p-8 flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-secondary-500/20 text-secondary-500' : 'bg-red-500/20 text-red-500'}`}>
                        {isSuccess ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 mb-8 font-light leading-relaxed">{message}</p>

                    <button
                        onClick={onAction || onClose}
                        className={`px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg w-full ${isSuccess
                                ? 'bg-secondary-600 text-white hover:bg-secondary-500 shadow-secondary-900/20'
                                : 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/20'
                            }`}
                    >
                        {actionLabel || 'Close'}
                    </button>

                    {!onAction && (
                        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">
                            Dismiss
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StatusModal;
