import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaUserGraduate, FaUserTie, FaEdit, FaTrash } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const Users = () => {
    const { isDarkMode } = useTheme();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.Fullname.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.Fullname.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <FaUserTie className="text-blue-500" />;
            case 'tutor':
                return <FaUserGraduate className="text-purple-500" />;
            default:
                return <FaUser className="text-green-500" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-blue-100 text-blue-800';
            case 'tutor':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-green-100 text-green-800';
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className={`flex items-center px-4 py-2 rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm w-full md:w-64`}>
                        <FaSearch className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`ml-2 w-full bg-transparent border-none focus:outline-none ${
                                isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                            }`}
                        />
                    </div>
                    
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${
                            isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-gray-100'
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="tutor">Tutors</option>
                        <option value="user">Students</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <th className="px-6 py-4 text-left">User</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Joined</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className={`border-b ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                {getRoleIcon(user.role)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium">
                                                    {user.Fullname.firstname} {user.Fullname.lastname}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <button className={`p-2 rounded-lg ${
                                                isDarkMode
                                                    ? 'text-blue-400 hover:bg-gray-700'
                                                    : 'text-blue-600 hover:bg-gray-100'
                                            }`}>
                                                <FaEdit />
                                            </button>
                                            <button className={`p-2 rounded-lg ${
                                                isDarkMode
                                                    ? 'text-red-400 hover:bg-gray-700'
                                                    : 'text-red-600 hover:bg-gray-100'
                                            }`}>
                                                <FaTrash />
                                            </button>
                                        </div>
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

export default Users; 