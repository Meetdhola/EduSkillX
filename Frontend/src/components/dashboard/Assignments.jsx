import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const Assignments = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = user?.role === 'tutor' ? '/api/assignments/tutor' : '/api/assignments/student';
            
            const response = await fetch(`${import.meta.env.VITE_BASE_URI || 'http://localhost:4000'}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAssignments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setError('Failed to load assignments');
            setLoading(false);
        }
    };

    const handleSubmit = async (assignmentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URI || 'http://localhost:4000'}/api/assignments/${assignmentId}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            fetchAssignments();
        } catch (error) {
            console.error('Error submitting assignment:', error);
            setError('Failed to submit assignment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                    {user?.role === 'tutor' && (
                        <button
                            onClick={() => navigate('/assignments/create')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <FaPlus className="mr-2" />
                            Create Assignment
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        {assignments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No assignments found.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {assignments.map(assignment => (
                                    <div
                                        key={assignment._id}
                                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                                                <p className="text-gray-600 mb-4">{assignment.description}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                    <span>Points: {assignment.points}</span>
                                                </div>
                                            </div>
                                            {user?.role === 'tutor' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/assignments/${assignment._id}/edit`)}
                                                        className="p-2 text-blue-600 hover:text-blue-700"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(assignment._id)}
                                                        className="p-2 text-red-600 hover:text-red-700"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {user?.role === 'student' && !assignment.submitted && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleSubmit(assignment._id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                >
                                                    Submit Assignment
                                                </button>
                                            </div>
                                        )}

                                        {assignment.submitted && (
                                            <div className="mt-4 flex items-center">
                                                <FaCheck className="text-green-500 mr-2" />
                                                <span className="text-green-600">Submitted</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assignments; 