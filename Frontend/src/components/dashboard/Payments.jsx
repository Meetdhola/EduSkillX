import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaHistory, FaDownload, FaFilter } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const Payments = () => {
    const { isDarkMode } = useTheme();
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [timeRange, setTimeRange] = useState('month');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentStats, setPaymentStats] = useState({
        totalRevenue: 0,
        totalPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role);
        fetchPaymentData();
    }, [timeRange, statusFilter]);

    const fetchPaymentData = async () => {
        try {
            const token = localStorage.getItem('token');
            let endpoint;
            
            switch (userRole) {
                case 'admin':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/admin/payments`;
                    break;
                case 'tutor':
                    endpoint = `${import.meta.env.VITE_BASE_URI}/tutor/payments`;
                    break;
                default:
                    endpoint = `${import.meta.env.VITE_BASE_URI}/student/payments`;
            }
            
            const response = await axios.get(endpoint, {
                params: { timeRange, status: statusFilter },
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data.transactions);
            setPaymentStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching payment data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-100';
            case 'pending':
                return 'text-yellow-500 bg-yellow-100';
            case 'failed':
                return 'text-red-500 bg-red-100';
            default:
                return 'text-gray-500 bg-gray-100';
        }
    };

    const downloadInvoice = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URI}/payments/${transactionId}/invoice`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${transactionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Payments</h1>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <FaFilter className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                                    : 'bg-white border-gray-300'
                            }`}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${
                            isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-gray-100'
                                : 'bg-white border-gray-300'
                        }`}
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <FaCreditCard className="text-blue-500" />
                        </div>
                        <span className="text-green-500">+12%</span>
                    </div>
                    <h3 className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Total Revenue
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        ${paymentStats.totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <FaHistory className="text-green-500" />
                        </div>
                        <span className="text-green-500">+5%</span>
                    </div>
                    <h3 className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Total Payments
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {paymentStats.totalPayments}
                    </p>
                </div>
                <div className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <FaHistory className="text-yellow-500" />
                        </div>
                        <span className="text-yellow-500">+2</span>
                    </div>
                    <h3 className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Pending Payments
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {paymentStats.pendingPayments}
                    </p>
                </div>
                <div className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <FaHistory className="text-red-500" />
                        </div>
                        <span className="text-red-500">-1</span>
                    </div>
                    <h3 className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Failed Payments
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {paymentStats.failedPayments}
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className={`rounded-lg overflow-hidden shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <th className="px-6 py-4 text-left">Transaction ID</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id} className={`border-b ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <td className="px-6 py-4">
                                        {transaction._id.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => downloadInvoice(transaction._id)}
                                            className={`p-2 rounded-lg ${
                                                isDarkMode
                                                    ? 'text-blue-400 hover:bg-gray-700'
                                                    : 'text-blue-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <FaDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments; 