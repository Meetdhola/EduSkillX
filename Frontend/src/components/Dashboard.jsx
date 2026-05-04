import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaHome, FaBook, FaList, FaUsers, FaTrophy, FaClock, FaStar, FaUserGraduate, FaCog, FaChartBar, FaUser, FaRobot, FaUserShield, FaRoad, FaExchangeAlt, FaBars, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RiVipDiamondFill } from 'react-icons/ri';
import { BsVr } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Settings from './dashboard/Settings';
import Analytics from './dashboard/Analytics';
import Profile from './dashboard/Profile';
import Review from './CustomerReview.jsx';
import EduSkillXBarter from './EduSkillXBarter';
import { getCurrentUser, isAdmin, isInstructor, isStudent } from '../utils/roleUtils';
import EmailReminder from './EmailReminder.jsx';
import { HiOutlineSearch, HiOutlineLightBulb, HiOutlineBell } from 'react-icons/hi';
import { MdEvent } from 'react-icons/md';

const motivationalTips = [
  "Consistency beats intensity. Study a little every day!",
  "Take short breaks to boost your focus.",
  "Teach someone else to truly master a topic.",
  "Set a daily learning goal and stick to it.",
  "Celebrate small wins to stay motivated!"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [apiError, setApiError] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * motivationalTips.length));
  
  // Use the role utilities instead of directly accessing localStorage
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  const userIsInstructor = isInstructor();
  const userIsStudent = isStudent();

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  // Mock data for development
  const mockDashboardData = {
    userProfile: {
      Fullname: {
        firstname: "Meet",
        lastname: "Dhola"
      },
      bio: "Learning enthusiast and tech lover",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    leaderboard: [
      { _id: 1, Fullname: { firstname: "Alice", lastname: "Johnson" }, points: 1250 },
      { _id: 2, Fullname: { firstname: "Bob", lastname: "Smith" }, points: 980 },
      { _id: 3, Fullname: { firstname: "Carol", lastname: "Williams" }, points: 750 }
    ]
  };

  const mockActivities = [
    { _id: 1, type: "course_completed", title: "Completed React Fundamentals", timestamp: new Date().toISOString() },
    { _id: 2, type: "achievement_earned", title: "Earned 'Quick Learner' badge", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { _id: 3, type: "course_started", title: "Started Advanced JavaScript", timestamp: new Date(Date.now() - 172800000).toISOString() }
  ];

  const mockAchievements = [
    { _id: 1, title: "Quick Learner", description: "Completed 5 courses in a week", icon: "🏆" },
    { _id: 2, title: "Social Butterfly", description: "Participated in 10 discussions", icon: "🦋" },
    { _id: 3, title: "Night Owl", description: "Studied for 5 hours after midnight", icon: "🦉" }
  ];

  const mockStats = {
    totalCourses: 12,
    completedCourses: 5,
    totalPoints: 1250,
    streak: 7
  };

  const mockNotifications = [
    { _id: 1, message: "New course available: Advanced React Patterns", read: false, timestamp: new Date().toISOString() },
    { _id: 2, message: "Your assignment has been graded", read: false, timestamp: new Date(Date.now() - 3600000).toISOString() }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Get user role from token
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    } catch (error) {
      console.error('Error decoding token:', error);
      setUserRole('user'); // Default to user role if token decoding fails
    }
    
    fetchDashboardData();
    fetchCourses();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Check if we're in development mode or if the API is not ready
      const isDevMode = import.meta.env.MODE === 'development';
      
      if (isDevMode) {
        // Use mock data in development mode
        console.log('Using mock data for dashboard');
        setDashboardData(mockDashboardData);
        setActivities(mockActivities);
        setAchievements(mockAchievements);
        setStats(mockStats);
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }

      // Try to fetch from API, but handle 404 errors gracefully
      try {
        const overviewRes = await axios.get(`${API_URL}/dashboard/overview`, { headers });
        setDashboardData(overviewRes.data);
      } catch (error) {
        console.warn('Could not fetch dashboard overview, using mock data');
        setDashboardData(mockDashboardData);
      }

      try {
        const activitiesRes = await axios.get(`${API_URL}/dashboard/activity`, { headers });
        setActivities(activitiesRes.data);
      } catch (error) {
        console.warn('Could not fetch activities, using mock data');
        setActivities(mockActivities);
      }

      try {
        const achievementsRes = await axios.get(`${API_URL}/dashboard/achievements`, { headers });
        setAchievements(achievementsRes.data);
      } catch (error) {
        console.warn('Could not fetch achievements, using mock data');
        setAchievements(mockAchievements);
      }

      try {
        const statsRes = await axios.get(`${API_URL}/dashboard/stats`, { headers });
        setStats(statsRes.data);
      } catch (error) {
        console.warn('Could not fetch stats, using mock data');
        setStats(mockStats);
      }

      try {
        const notificationsRes = await axios.get(`${API_URL}/dashboard/notifications`, { headers });
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.warn('Could not fetch notifications, using mock data');
        setNotifications(mockNotifications);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as fallback
      setDashboardData(mockDashboardData);
      setActivities(mockActivities);
      setAchievements(mockAchievements);
      setStats(mockStats);
      setNotifications(mockNotifications);
      setApiError(true);
      setLoading(false);
      toast.error('Using demo data due to API connection issues');
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Determine which endpoint to use based on user role
      let endpoint = '/api/courses';
      if (userIsInstructor) {
        endpoint = '/api/courses/instructor/courses';
      } else if (userIsStudent) {
        endpoint = '/api/courses/user/courses';
      }
      
      console.log(`Fetching courses from: ${API_URL}${endpoint}`);
      
      const response = await axios.get(`${API_URL}${endpoint}`, { headers });
      
      // Check if the response has the expected structure
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        console.error('Unexpected API response format:', response.data);
        // Use mock courses as fallback
        setCourses(mockCourses);
        toast.warning('Using demo courses due to API response format issues');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access these courses.');
        setCourses(mockCourses);
      } else {
        toast.warning('Using demo courses due to API connection issues');
        setCourses(mockCourses);
      }
    }
  };

  // Mock courses for development
  const mockCourses = [
    {
      _id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React and its core concepts",
      category: "Web Development",
      type: "standard",
      duration: 120,
      difficulty: "beginner",
      price: 49.99,
      progress: 75,
      isEnrolled: true,
      isCompleted: false,
      rating: 4.5
    },
    {
      _id: 2,
      title: "Advanced JavaScript",
      description: "Master advanced JavaScript concepts and patterns",
      category: "Programming",
      type: "standard",
      duration: 180,
      difficulty: "intermediate",
      price: 59.99,
      progress: 30,
      isEnrolled: true,
      isCompleted: false,
      rating: 4.2
    },
    {
      _id: 3,
      title: "AR/VR Development",
      description: "Create immersive experiences with AR and VR",
      category: "Extended Reality",
      type: "arvr",
      duration: 240,
      difficulty: "advanced",
      price: 79.99,
      progress: 0,
      isEnrolled: false,
      isCompleted: false,
      rating: 4.8
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/dashboard/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Just update the UI even if the API call fails
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      toast.warning('Notification marked as read locally');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Navigate to the appropriate page based on the view
    if (view === 'courses') {
      navigate('/courses');
    } else if (view === 'Review') {
      navigate('/Review');
    } else if (view === 'community') {
      navigate('/community');
    } else if (view === 'achievements') {
      navigate('/achievements');
    } else if (view === 'roadmap') {
      navigate('/roadmap');
    } else if (view === 'barter') {
      navigate('/barter');
    }else if(view === 'EmailRemainder'){
      navigate('/EmailRemainder');
    }else if(view === 'profile'){
      navigate('/Profile');
    }else if(view === 'AI Chat'){
      navigate('/AIChat');
    }else if(view === 'settings'){
      navigate('/settings');
    }else if(view === 'analytics'){
      navigate('/analytics');
    }else if(view === 'Assignments'){
      navigate('/assignments');
    }
  };

  // --- Sidebar Navigation Items ---
  const navItems = [
    { label: 'Dashboard', icon: <FaHome />, view: 'dashboard' },
    { label: 'Courses', icon: <FaBook />, view: 'courses' },
    { label: 'Progress', icon: <FaChartBar />, view: 'analytics', show: userIsInstructor || userIsAdmin },
    { label: 'Assignments', icon: <FaList />, view: 'assignments', show: false }, // Placeholder
    { label: 'Profile', icon: <FaUser />, view: 'profile' },
    { label: 'Settings', icon: <FaCog />, view: 'settings', show: userIsInstructor || userIsAdmin },
    { label: 'Logout', icon: <FaExchangeAlt />, view: 'logout' }
  ];

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome className="text-lg" /> },
    { name: 'Courses', path: '/courses', icon: <FaBook className="text-lg" /> },
    { name: 'Review', path: '/Review', icon: <FaList className="text-lg" /> },
    { name: 'Community', path: '/community', icon: <FaUsers className="text-lg" /> },
    { name: 'Achievements', path: '/achievements', icon: <FaTrophy className="text-lg" /> },
    { name: 'EmailRemainder', path: '/EmailRemainder', icon: <FaTrophy className="text-lg" /> },
    { name: 'Roadmap', path: '/roadmap', icon: <FaRoad className="text-lg" /> },
    { name: 'Profile', path: '/Profile', icon: <FaUser className="text-lg" /> },
    { name: 'AI Chat', path: '/AIChat', icon: <FaComments className="text-lg" /> },
    { name: 'Settings', path: '/settings', icon: <FaCog className="text-lg" />, show: userIsInstructor || userIsAdmin },
    { name: 'Logout', path: '/logout', icon: <FaExchangeAlt className="text-lg" /> }
  ];

  // Sidebar Button with animated accent bar and glassmorphism
  function SidebarBtn({ icon, label, active, onClick, collapsed }) {
    return (
      <button
        className={`
          group relative flex items-center w-full px-4 py-2 my-1 rounded-xl
          transition-all duration-200 font-medium
          ${active
            ? 'bg-gradient-to-r from-[#00CFC1]/30 to-[#007B8A]/10 text-[#0D3B66] shadow-lg'
            : 'bg-white/60 text-gray-500 hover:bg-[#F9FAFB] hover:text-[#007B8A]'}
          ${collapsed ? 'justify-center px-2' : ''}
          backdrop-blur-md border border-white/40
        `}
        onClick={onClick}
        style={{ minHeight: 48 }}
      >
        {/* Animated accent bar */}
        <span className={`
          absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full
          ${active ? 'bg-gradient-to-b from-[#00CFC1] to-[#007B8A] scale-y-100' : 'scale-y-0'}
          transition-transform duration-300
        `} />
        <span className="z-10">{icon}</span>
        {!collapsed && (
          <span className="ml-4 z-10 tracking-wide">{label}</span>
        )}
        {/* Animated dot for active (mobile/collapsed) */}
        {collapsed && active && (
          <span className="absolute right-2 w-2 h-2 bg-[#00CFC1] rounded-full animate-bounce" />
        )}
      </button>
    );
  }

  // --- Sidebar Component ---
  const Sidebar = () => (
    <aside className={`
      fixed md:static z-20 min-h-screen flex flex-col
      transition-all duration-300
      ${sidebarCollapsed ? 'w-20' : 'w-60'}
      bg-white/70 backdrop-blur-xl shadow-2xl border-r border-white/30
    `}>
      <div className="flex items-center justify-between px-4 py-6">
        <span className="font-extrabold text-2xl text-[#0D3B66] tracking-tight drop-shadow-lg select-none">
          {!sidebarCollapsed && "EduSkillX"}
        </span>
        <button
          className="hidden md:block p-2 rounded-full bg-white/60 hover:bg-[#F0F4F8] transition"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Collapse Sidebar"
        >
          <FaBars size={20} />
        </button>
        <button
          className="text-gray-400 hover:text-[#0D3B66] transition md:hidden"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Toggle Sidebar"
        >
          <FaBars size={22} />
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-2">
        <SidebarBtn
          icon={<FaHome size={22} />}
          label="Dashboard"
          active={activeView === 'dashboard'}
          onClick={() => handleViewChange('dashboard')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaBook size={22} />}
          label="Courses"
          active={activeView === 'courses'}
          onClick={() => handleViewChange('courses')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaList size={22} />}
          label="Review"
          active={activeView === 'Review'}
          onClick={() => handleViewChange('Review')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaUsers size={22} />}
          label="Community"
          active={activeView === 'community'}
          onClick={() => handleViewChange('community')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaTrophy size={22} />}
          label="Achievements"
          active={activeView === 'achievements'}
          onClick={() => handleViewChange('achievements')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaTrophy size={22} />}
          label="EmailRemainder"
          active={activeView === 'EmailRemainder'}
          onClick={() => handleViewChange('EmailRemainder')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaRoad size={22} />}
          label="Roadmap"
          active={activeView === 'roadmap'}
          onClick={() => handleViewChange('roadmap')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaUser size={22} />}
          label="Profile"
          active={activeView === 'profile'}
          onClick={() => handleViewChange('profile')}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaComments size={22} />}
          label="AI Chat"
          active={activeView === 'AI Chat'}
          onClick={() => handleViewChange('AI Chat')}
          collapsed={sidebarCollapsed}
        />
        {(userIsInstructor || userIsAdmin) && (
          <SidebarBtn
            icon={<FaChartBar size={22} />}
            label="Analytics"
            active={activeView === 'analytics'}
            onClick={() => handleViewChange('analytics')}
            collapsed={sidebarCollapsed}
          />
        )}
        {(userIsInstructor || userIsAdmin) && (
          <SidebarBtn
            icon={<FaCog size={22} />}
            label="Settings"
            active={activeView === 'settings'}
            onClick={() => handleViewChange('settings')}
            collapsed={sidebarCollapsed}
          />
        )}
        {userIsAdmin && (
          <SidebarBtn
            icon={<FaUserShield size={22} />}
            label="Admin"
            active={activeView === 'admin'}
            onClick={() => navigate('/admin')}
            collapsed={sidebarCollapsed}
          />
        )}
        {userRole === 'user' && (
          <SidebarBtn
            icon={<FaExchangeAlt size={22} />}
            label="Skill Barter"
            active={activeView === 'barter'}
            onClick={() => handleViewChange('barter')}
            collapsed={sidebarCollapsed}
          />
        )}
        {/* Add Logout Button */}
        <SidebarBtn
          icon={<FaSignOutAlt size={22} />}
          label="Log Out"
          active={activeView === 'Log Out'}
          onClick={handleLogout}
          collapsed={sidebarCollapsed}
        />
        <SidebarBtn
          icon={<FaSignOutAlt size={22} />}
          label="Assignments"
          active={activeView === 'Assignments'}
          onClick={handleLogout}
          collapsed={sidebarCollapsed}
        />
      </nav>
      <div className="mt-auto mb-6 flex justify-center">
        {/* Optional: Dark mode toggle */}
        {/* <button className="p-2 rounded-full bg-[#F0F4F8] hover:bg-[#E0E7EF] transition">
          <HiOutlineLightBulb className="text-[#FFC857]" size={22} />
        </button> */}
        
      </div>
      
    </aside>
  );

  // --- Stat Card Component ---
  const StatCard = ({ icon, label, value, accent }) => (
    <div className="flex-1 min-w-[140px] bg-white rounded-xl shadow-md px-6 py-5 flex items-center gap-4 hover:shadow-lg transition-all duration-200">
      <div className={`p-3 rounded-full ${accent} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#0D3B66]">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );

  // --- Recent Activity Card ---
  const ActivityCard = ({ activity }) => (
    <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-lg px-4 py-3 mb-2 shadow-sm hover:shadow-md transition">
      <span className="text-[#00CFC1] text-lg">
        {activity.type === "course_completed" && <FaBook />}
        {activity.type === "achievement_earned" && <FaTrophy />}
        {activity.type === "course_started" && <FaRoad />}
      </span>
      <div>
        <div className="font-medium text-gray-700">{activity.title}</div>
        <div className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</div>
      </div>
    </div>
  );

  // --- Main Content ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen font-[Inter]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`flex-1 ml-0 md:ml-${sidebarCollapsed ? '20' : '56'} transition-all duration-300 px-4 md:px-10 py-8`}>
        {/* Welcome + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={dashboardData?.userProfile?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
              alt="Profile"
              className="w-14 h-14 rounded-full border-4 border-[#00CFC1] shadow"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#0D3B66]">Welcome back, {dashboardData?.userProfile?.Fullname?.firstname} 👋</h1>
              <div className="text-gray-500 text-sm">{dashboardData?.userProfile?.bio}</div>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search courses, resources..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#00CFC1] transition"
              />
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard
            icon={<FaBook className="text-[#007B8A]" size={24} />}
            label="Courses Enrolled"
            value={stats?.totalCourses || 0}
            accent="bg-[#00CFC1]"
          />
          <StatCard
            icon={<FaTrophy className="text-[#FFC857]" size={24} />}
            label="Completed Lessons"
            value={stats?.completedCourses || 0}
            accent="bg-[#FFC857]"
          />
          <StatCard
            icon={<FaClock className="text-[#0D3B66]" size={24} />}
            label="Study Hours"
            value={Math.round((stats?.totalCourses || 0) * 2.5)}
            accent="bg-[#0D3B66]"
          />
          <StatCard
            icon={<FaStar className="text-[#00CFC1]" size={24} />}
            label="Current Streak"
            value={stats?.streak || 0}
            accent="bg-[#00CFC1]"
          />
        </div>

        {/* Main Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="col-span-2 bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-[#0D3B66]">Recent Activity</h2>
              <Link to="/activity" className="text-[#007B8A] text-sm hover:underline">View all</Link>
            </div>
            <div>
              {activities.slice(0, 5).map(activity => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
          </div>
          {/* Motivational Tip */}
          <div className="relative rounded-xl shadow-md p-6 flex flex-col justify-between text-white overflow-hidden"
               style={{
                 background: 'linear-gradient(120deg, #00CFC1 0%, #007B8A 100%)'
               }}>
            <div className="absolute inset-0 animate-gradient-move opacity-30" />
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineLightBulb size={24} />
              <span className="font-semibold">Motivation</span>
            </div>
            <div className="text-lg font-medium mb-4">{motivationalTips[tipIndex]}</div>
            <button
              className="self-end text-xs underline hover:text-[#FFC857] transition"
              onClick={() => setTipIndex((tipIndex + 1) % motivationalTips.length)}
            >
              Next Tip
            </button>
          </div>
        </div>

        <hr className="my-8 border-t border-[#F0F4F8]" />

        {/* Leaderboard Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-[#0D3B66]">Leaderboard</h2>
            <Link to="/leaderboard" className="text-[#007B8A] text-sm hover:underline">View all</Link>
          </div>
          <div>
            {dashboardData?.leaderboard?.slice(0, 5).map((user, index) => (
              <LeaderboardItem
                key={user._id}
                position={index + 1}
                name={`${user.Fullname.firstname} ${user.Fullname.lastname}`}
                points={user.points}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 px-4 py-8 bg-[#F9FAFB] border-l border-[#E5E7EB] gap-8">
        {/* Quick Tips */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineLightBulb className="text-[#FFC857]" size={20} />
            <span className="font-semibold text-[#0D3B66]">Quick Tips</span>
          </div>
          <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
            <li>Review notes after each lesson.</li>
            <li>Use spaced repetition for memorization.</li>
            <li>Join community discussions.</li>
          </ul>
        </div>
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MdEvent className="text-[#007B8A]" size={20} />
            <span className="font-semibold text-[#0D3B66]">Upcoming Events</span>
          </div>
          <div className="text-gray-600 text-sm">Webinar: "Mastering React" <br /> <span className="text-xs text-gray-400">May 30, 6:00 PM</span></div>
        </div>
        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineBell className="text-[#FFC857]" size={20} />
            <span className="font-semibold text-[#0D3B66]">Notifications</span>
          </div>
          <ul className="text-gray-600 text-sm space-y-1">
            {notifications.slice(0, 3).map(n => (
              <li key={n._id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-[#FFC857]'}`}></span>
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, progressColor }) => {
  const navigate = useNavigate();
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Animate progress bar on mount
    setTimeout(() => setProgressWidth(course.progress), 200);
  }, [course.progress]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleCourseClick = () => {
    if (course.isEnrolled) {
      if (course.paidStudents?.includes(JSON.parse(localStorage.getItem('user'))._id)) {
        navigate(`/courses/${course._id}/learn`);
      } else {
        navigate(`/courses/${course._id}`);
      }
    } else {
      navigate(`/courses/${course._id}`);
    }
  };

  return (
    <div
      className={`
        bg-white p-5 rounded-2xl cursor-pointer shadow-md border border-transparent
        transition-all duration-300 relative overflow-hidden
        hover:shadow-xl hover:border-[#00CFC1] hover:-translate-y-1
        group
      `}
      onClick={handleCourseClick}
      style={{
        boxShadow: course.isCompleted
          ? '0 4px 24px 0 rgba(16, 185, 129, 0.15)'
          : '0 2px 12px 0 rgba(13, 59, 102, 0.07)'
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-[#00CFC1] transition-all duration-300"></div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-[#0D3B66]">{course.title}</h3>
          {course.rating >= 4.7 && (
            <span className="bg-gradient-to-r from-[#FFC857] to-[#00CFC1] text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm ml-2 animate-pulse">
              Top Rated
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{course.category}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center text-gray-400 text-xs">
            <FaClock className="mr-1" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center text-yellow-500 text-xs">
            <FaStar className="mr-1" />
            <span>{course.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full font-semibold
            ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {course.isCompleted && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Completed
            </span>
          )}
          {!course.isEnrolled && !course.isCompleted && (
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Not Enrolled
            </span>
          )}
          {course.isEnrolled && !course.paidStudents?.includes(JSON.parse(localStorage.getItem('user'))._id) && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Payment Required
            </span>
          )}
          {course.type === 'arvr' && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
              AR/VR
            </span>
          )}
        </div>
      </div>
      {/* Animated Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
        <div
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-700 ${progressColor}`}
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 items-center">
        <span className="text-xs text-gray-400">{course.progress}%</span>
        <span className="text-xs font-semibold text-[#007B8A]">${course.price.toFixed(2)}</span>
      </div>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          boxShadow: '0 0 32px 0 #00CFC155'
        }}
      />
    </div>
  );
};

// Leaderboard Item Component
const LeaderboardItem = ({ position, name, points }) => {
  const medals = [
    <span className="text-yellow-400 animate-bounce">🥇</span>,
    <span className="text-gray-400 animate-bounce">🥈</span>,
    <span className="text-orange-400 animate-bounce">🥉</span>
  ];
  const borderGradient = [
    "border-2 border-yellow-300",
    "border-2 border-gray-400",
    "border-2 border-orange-400"
  ];
  return (
    <div
      className={`
        flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl px-4 py-3 mb-2 shadow
        ${position <= 3 ? borderGradient[position - 1] : "border border-[#F0F4F8]"}
        transition hover:scale-105 hover:shadow-xl relative
      `}
      style={position === 1 ? { overflow: 'visible' } : {}}
    >
      {/* Confetti for 1st place */}
      {position === 1 && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-pulse select-none">🎉</span>
      )}
      <div className="flex items-center gap-2">
        {position <= 3 ? medals[position - 1] : <span className="text-gray-400 font-bold">{position}</span>}
        <img
          src={`https://randomuser.me/api/portraits/men/${position + 20}.jpg`}
          alt={name}
          className={`w-8 h-8 rounded-full ${position <= 3 ? 'ring-2 ring-offset-2 ring-[#00CFC1]' : 'border-2 border-[#00CFC1]'}`}
        />
        <span className="font-semibold text-[#0D3B66]">{name}</span>
      </div>
      <div className="font-semibold text-[#007B8A]">{points} pts</div>
    </div>
  );
};

export default Dashboard;