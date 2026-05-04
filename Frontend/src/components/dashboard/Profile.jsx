import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarker, FaGraduationCap, FaBriefcase, FaPhone, FaGlobe, FaCertificate, FaAward, FaExclamationCircle, FaEdit } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../utils/roleUtils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { isDarkMode } = useTheme();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [points, setPoints] = useState(0);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    
    const [formData, setFormData] = useState({
        Fullname: {
            firstname: '',
            lastname: ''
        },
        email: '',
        bio: '',
        location: '',
        phone: '',
        education: '',
        occupation: '',
        website: '',
        interests: [],
        joinDate: ''
    });

    const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const user = getCurrentUser();
            if (!user || !token) {
                toast.error('User session expired. Please login again.');
                return;
            }
            const response = await axios.get(`${API_URL}/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.user);
            setAvatarPreview(response.data.user.avatar || '');
            setFormData({
                Fullname: response.data.user.Fullname || { firstname: '', lastname: '' },
                email: response.data.user.email || '',
                bio: response.data.user.bio || '',
                location: response.data.user.location || '',
                phone: response.data.user.phone || '',
                education: response.data.user.education || '',
                occupation: response.data.user.occupation || '',
                website: response.data.user.website || '',
                interests: response.data.user.interests || [],
                joinDate: new Date(response.data.user.createdAt).toLocaleDateString()
            });
            try {
                const certificatesResponse = await axios.get(`${API_URL}/api/users/${user.id}/certificates`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCertificates(certificatesResponse.data.certificates || []);
                const pointsResponse = await axios.get(`${API_URL}api/users/${user._id}/points`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPoints(pointsResponse.data.points || 0);
            } catch (error) {
                console.error('Error fetching additional user data:', error);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firstname' || name === 'lastname') {
            setFormData(prev => ({
                ...prev,
                Fullname: {
                    ...prev.Fullname,
                    [name]: value
                }
            }));
        } else if (name === 'interests') {
            const interestsArray = value.split(',').map(interest => interest.trim());
            setFormData(prev => ({
                ...prev,
                [name]: interestsArray
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
        uploadAvatar(file);
    };

    const uploadAvatar = async (file) => {
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const token = localStorage.getItem('token');
            toast.info('Uploading profile picture...');
            await axios.post(`${API_URL}/api/users/avatar`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Invalid file. Please try another image.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update profile picture. Please try again later.');
            }
            if (userData?.avatar) {
                setAvatarPreview(userData.avatar);
            } else {
                setAvatarPreview('');
            }
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!formData.Fullname.firstname || !formData.Fullname.lastname) {
                toast.error('First name and last name are required');
                return;
            }
            toast.info('Saving profile changes...');
            const response = await axios.put(
                `${API_URL}/api/users/update`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData(response.data.user);
            setIsEditing(false);
            toast.success('Profile updated successfully');
            if (response.data.user.avatar) {
                setAvatarPreview(response.data.user.avatar);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Invalid form data. Please check your inputs.');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to update this profile.');
            } else if (error.response?.status === 404) {
                toast.error('User not found. Please refresh the page.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update profile. Please try again later.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#00CFC1]"></div>
            </div>
        );
    }

    if (!userData && !isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px] p-4 text-center">
                <div className="text-3xl mb-4 text-[#FF6B6B]">
                    <FaExclamationCircle />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-[#0D3B66]">
                    Unable to load profile
                </h2>
                <p className="text-sm sm:text-base mb-4 text-gray-500">
                    There was a problem loading your profile data. Please try again.
                </p>
                <button
                    onClick={fetchUserData}
                    className="px-4 py-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-lg hover:scale-105 hover:shadow-lg transition text-sm sm:text-base"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-[Inter] py-10 px-2 sm:px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-extrabold text-[#0D3B66] tracking-tight drop-shadow-lg">
                        Profile
                    </h1>
                    <div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2 rounded-xl font-semibold bg-[#F0F4F8] text-[#0D3B66] shadow hover:bg-[#E5F9F7] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition flex items-center gap-2"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full border-4 border-[#00CFC1] shadow-lg bg-[#F0F4F8] flex items-center justify-center overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="text-5xl text-gray-400" />
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-2 right-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white p-2 rounded-full cursor-pointer shadow hover:scale-110 transition">
                                        <input 
                                            id="avatar-upload"
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleAvatarChange}
                                            disabled={uploadingAvatar}
                                        />
                                        {uploadingAvatar ? (
                                            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        ) : (
                                            <FaUser className="w-5 h-5" />
                                        )}
                                    </label>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-[#0D3B66]">
                                    {userData?.Fullname?.firstname || 'User'} {userData?.Fullname?.lastname || ''}
                                </h2>
                                <p className="text-[#00CFC1] font-semibold capitalize">{userData?.role || 'User'}</p>
                                <p className="text-gray-500">{formData.bio}</p>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaMapMarker className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.location || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaGlobe className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.website || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaGraduationCap className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.education || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaBriefcase className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.occupation || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-[#00CFC1]" />
                                <span className="text-gray-700">{formData.joinDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaAward className="text-[#FFC857]" />
                                <span className="text-gray-700">{points} Points</span>
                            </div>
                        </div>
                    </div>
                    <hr className="my-8 border-t border-[#F0F4F8]" />
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.Fullname.firstname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.Fullname.lastname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#0D3B66] mb-1">Interests (comma separated)</label>
                            <input
                                type="text"
                                name="interests"
                                value={formData.interests.join(', ')}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#0D3B66] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
                            />
                        </div>
                    </form>
                </div>

                {certificates.length > 0 && (
                    <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
                        <h2 className="text-xl font-bold text-[#0D3B66] mb-6 flex items-center gap-2">
                            <FaCertificate className="text-[#00CFC1]" /> Certificates
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {certificates.map((cert, index) => (
                                <div 
                                    key={index} 
                                    className="p-4 rounded-xl border border-[#F0F4F8] bg-white shadow hover:shadow-lg transition-all hover:border-[#00CFC1] flex flex-col gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaCertificate className="text-[#00CFC1]" />
                                        <span className="font-semibold text-[#0D3B66]">{cert.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Issued on {new Date(cert.issuedDate).toLocaleDateString()}</span>
                                    <span className="text-xs bg-[#F0F4F8] text-[#007B8A] px-2 py-1 rounded">{cert.courseName}</span>
                                    <button className="text-xs text-[#00CFC1] hover:text-[#007B8A] underline transition self-start mt-2">
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;