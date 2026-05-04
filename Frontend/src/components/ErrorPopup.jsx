import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';

const ErrorPopup = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-100 dark:border-red-900 overflow-hidden z-50"
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <BiErrorCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Error
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {error}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={onClose}
                                className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                            >
                                <span className="sr-only">Close</span>
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-1 bg-red-500 dark:bg-red-600"
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ErrorPopup; 