import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartBar, FaFileAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const navItems = [
  { key: 'users', label: 'Users', icon: <FaUsers size={20} /> },
  { key: 'reports', label: 'Reports', icon: <FaChartBar size={20} /> },
  { key: 'content', label: 'Content', icon: <FaFileAlt size={20} /> },
];

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeView, setActiveView] = useState('users');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'course',
    content: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeView]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      let response;
      switch (activeView) {
        case 'users':
          response = await axios.get(`${import.meta.env.VITE_BASE_URI}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data.users);
          break;
        case 'reports':
          response = await axios.get(`${import.meta.env.VITE_BASE_URI}/admin/reports`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setReports(response.data.reports);
          break;
        case 'content':
          response = await axios.get(`${import.meta.env.VITE_BASE_URI}/admin/content`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setContent(response.data.content);
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URI}/admin/content`, newContent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content created successfully');
      setNewContent({ title: '', type: 'course', content: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create content. Please try again.');
    }
  };

  const handleUpdateContent = async (id, updatedContent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URI}/admin/content/${id}`, updatedContent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update content. Please try again.');
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/admin/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete content. Please try again.');
    }
  };

  return (
    <div className={`flex min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
      {/* Sidebar */}
      <aside className={`w-64 min-h-screen bg-white/80 shadow-2xl border-r border-white/30 flex flex-col py-8 px-4`}>
        <div className="mb-10 flex items-center gap-3">
          <span className="font-extrabold text-2xl text-[#0D3B66] tracking-tight drop-shadow-lg">Admin</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-left ${
                activeView === item.key
                  ? 'bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow'
                  : 'text-[#0D3B66] hover:bg-[#F0F4F8]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className={`rounded-2xl p-8 shadow-lg ${isDarkMode ? 'bg-[#14213D] text-[#A9D6E5]' : 'bg-white text-[#0D3B66]'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
            </div>
          ) : (
            <>
              {activeView === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">User Management</h2>
                  <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F9FAFB] dark:bg-[#1B263B] border-b border-[#E5E7EB]">
                          <th className="py-3 px-4 text-left font-semibold">Name</th>
                          <th className="py-3 px-4 text-left font-semibold">Email</th>
                          <th className="py-3 px-4 text-left font-semibold">Role</th>
                          <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id} className="border-b border-[#E5E7EB] hover:bg-[#F0F4F8] dark:hover:bg-[#1B263B]">
                            <td className="py-2 px-4">{user.name}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4 capitalize">{user.role}</td>
                            <td className="py-2 px-4 flex gap-2">
                              <button className="text-blue-500 hover:text-blue-700 p-2 rounded transition">
                                <FaEdit />
                              </button>
                              <button className="text-red-500 hover:text-red-700 p-2 rounded transition">
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeView === 'reports' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Platform Reports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map(report => (
                      <div key={report._id} className={`p-6 rounded-2xl shadow border ${isDarkMode ? 'bg-[#1B263B] border-[#22304A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                        <h3 className="font-bold mb-2">{report.title}</h3>
                        <p className="text-sm mb-2">{report.description}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === 'content' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Content Management</h2>
                  {/* Create Content Form */}
                  <form onSubmit={handleCreateContent} className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      className={`px-4 py-3 rounded-lg w-full md:w-1/3 ${isDarkMode ? 'bg-[#1B263B] text-white' : 'bg-[#F9FAFB] text-[#0D3B66]'}`}
                      required
                    />
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                      className={`px-4 py-3 rounded-lg w-full md:w-1/4 ${isDarkMode ? 'bg-[#1B263B] text-white' : 'bg-[#F9FAFB] text-[#0D3B66]'}`}
                    >
                      <option value="course">Course</option>
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                    </select>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white font-semibold shadow hover:scale-105 transition"
                    >
                      <FaPlus /> Create
                    </button>
                  </form>
                  {/* Content List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map(item => (
                      <div key={item._id} className={`p-6 rounded-2xl shadow border flex flex-col gap-2 ${isDarkMode ? 'bg-[#1B263B] border-[#22304A]' : 'bg-[#F9FAFB] border-[#E5E7EB]'}`}>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <span className="text-xs mb-2 px-2 py-1 rounded bg-[#00CFC1]/10 text-[#00CFC1] w-max">{item.type}</span>
                        <div className="flex justify-end gap-2 mt-auto">
                          <button
                            onClick={() => handleUpdateContent(item._id, item)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item._id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;