import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaStar, FaUserGraduate, FaBook, FaGraduationCap, FaCreditCard } from 'react-icons/fa';
import { BsVr } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCurrentUser, isInstructor, isStudent, getUserId, isOwner } from '../utils/roleUtils';
import { useTheme } from '../context/ThemeContext';

const gradientBg = "bg-gradient-to-br from-[#00CFC1] via-[#007B8A] to-[#FFC857]";
const glassBg = "backdrop-blur-xl bg-white/70 dark:bg-[#14213D]/80";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const userIsInstructor = isInstructor();
  const userIsStudent = isStudent();
  const userId = getUserId();

  const API_URL = import.meta.env.VITE_BASE_URI || 'http://localhost:4000';

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    fetchCourseDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${API_URL}/api/courses/${id}`, { headers });
      const courseData = response.data.course;

      setCourse(courseData);
      setIsEnrolled(courseData.enrolledStudents.some(student => student._id === userId));
      setIsCompleted(courseData.completedStudents.includes(userId));
      setIsPaid(courseData.paidStudents.includes(userId));
      setUserRating(courseData.userRating);

      setLoading(false);
    } catch (error) {
      setError('Failed to load course details');
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const loadingToastId = toast.loading('Enrolling in course...');
      const response = await axios.post(
        `${API_URL}/api/courses/${course._id}/enroll`,
        {},
        { headers }
      );
      toast.dismiss(loadingToastId);
      if (response.data.success) {
        toast.success('Successfully enrolled in the course!');
        fetchCourseDetails();
      }
    } catch (error) {
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${course._id}`, { state: course });
  };

  const handleUnenroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to unenroll from courses');
        navigate('/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const loadingToastId = toast.loading('Unenrolling from course...');
      await axios.post(
        `${API_URL}/api/courses/${id}/unenroll`,
        {},
        { headers }
      );
      toast.dismiss(loadingToastId);
      toast.success('Successfully unenrolled from the course');
      setIsEnrolled(false);
      fetchCourseDetails();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to unenroll from course. Please try again.');
    }
  };

  const handleUpdateRating = async (rating) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/api/courses/${id}/rating`, { rating }, { headers });
      toast.success('Rating updated successfully!');
      fetchCourseDetails();
    } catch (error) {
      toast.error('Failed to update rating');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CFC1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
          <button 
            className="bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-[Inter] ${isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F9FAFB]'} py-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button 
          className="flex items-center text-[#00CFC1] mb-6 hover:text-[#007B8A] font-semibold"
          onClick={() => navigate('/courses')}
        >
          <FaArrowLeft className="mr-2" /> Back to Courses
        </button>

        {/* Hero Section */}
        <div className={`relative rounded-3xl shadow-2xl overflow-hidden mb-10 ${glassBg}`}>
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{background: 'radial-gradient(circle at 70% 30%, #00CFC1 0%, #007B8A 60%, #FFC857 100%)'}} />
          <div className="relative z-10 flex flex-col md:flex-row gap-10 p-10">
            <div className="flex flex-col items-center md:items-start">
              <div className={`rounded-2xl shadow-xl border-4 border-white/80 overflow-hidden mb-4 ${gradientBg}`}>
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course?.title}
                    className="w-48 h-48 object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-2xl text-white font-bold">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#00CFC1] text-white rounded-full shadow">
                  {course?.type === 'arvr' ? <BsVr className="inline" /> : <FaBook className="inline" />}
                  {course?.type === 'arvr' ? 'AR/VR' : 'Regular'}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${
                  course?.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  course?.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course?.difficulty?.charAt(0).toUpperCase() + course?.difficulty?.slice(1)}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${
                  course?.status === 'published' ? 'bg-green-100 text-green-800' :
                  course?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course?.status?.charAt(0).toUpperCase() + course?.status?.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-transparent bg-clip-text drop-shadow-lg">{course?.title}</h1>
                <p className="mb-4 text-lg font-medium text-[#007B8A] dark:text-[#FFC857]">{course?.category}</p>
                <div className="flex flex-wrap items-center gap-8 mb-6">
                  <div className="flex items-center gap-2 text-lg">
                    <FaClock className="text-[#00CFC1]" />
                    <span>{formatDuration(course?.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <FaStar className="text-yellow-500" />
                    <span>{course?.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <FaUserGraduate className="text-[#007B8A]" />
                    <span>{course?.enrolledStudentsCount || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <FaBook className="text-[#007B8A]" />
                    <span>{course?.topics?.length || 0} topics</span>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-[#00CFC1] dark:text-[#FFC857]">
                  ${course?.price?.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                {userIsStudent && !isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    className="px-8 py-3 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold text-lg"
                  >
                    Enroll Now
                  </button>
                )}
                {userIsStudent && isEnrolled && !isPaid && (
                  <button
                    onClick={handlePayment}
                    className="px-8 py-3 bg-gradient-to-r from-[#FFC857] to-[#00CFC1] text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold text-lg flex items-center"
                  >
                    <FaCreditCard className="mr-2" />
                    Pay Now
                  </button>
                )}
                {userIsStudent && isEnrolled && isPaid && !isCompleted && (
                  <button
                    onClick={() => navigate(`/courses/${id}/learn`)}
                    className="px-8 py-3 bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold text-lg flex items-center"
                  >
                    <FaBook className="mr-2" />
                    Continue Learning
                  </button>
                )}
                {userIsStudent && isCompleted && (
                  <button
                    onClick={() => navigate(`/courses/${id}/review`)}
                    className="px-8 py-3 bg-gradient-to-r from-[#00CFC1] to-[#FFC857] text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold text-lg flex items-center"
                  >
                    <FaGraduationCap className="mr-2" />
                    Review Course
                  </button>
                )}
                {userIsStudent && (
                  <button
                    onClick={handleUnenroll}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF585D] to-[#FFC857] text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold text-lg"
                  >
                    Unenroll
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`rounded-2xl shadow-lg p-10 mb-10 ${glassBg}`}>
          <h2 className="text-2xl font-bold mb-4 text-[#00CFC1] dark:text-[#FFC857]">Course Overview</h2>
          <p className="whitespace-pre-line text-lg">{course?.description}</p>
        </div>

        {/* Topics */}
        {course?.topics?.length > 0 && (
          <div className={`rounded-2xl shadow-lg p-10 mb-10 ${glassBg}`}>
            <h2 className="text-2xl font-bold mb-4 text-[#00CFC1] dark:text-[#FFC857]">Topics Covered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.topics.map((topic, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow border-2 border-[#00CFC1]/20 bg-white/80 dark:bg-[#22304A]/80`}
                >
                  <h3 className="font-semibold mb-1 text-lg">{topic.title}</h3>
                  <p className="text-sm mb-2">{topic.description}</p>
                  <div className="flex items-center text-xs text-[#00CFC1]">
                    <FaClock className="mr-1" />
                    <span>{formatDuration(topic.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {course?.requirements?.length > 0 && (
            <div className={`rounded-2xl shadow-lg p-8 ${glassBg}`}>
              <h2 className="text-xl font-bold mb-4 text-[#00CFC1] dark:text-[#FFC857]">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-lg">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          {course?.objectives?.length > 0 && (
            <div className={`rounded-2xl shadow-lg p-8 ${glassBg}`}>
              <h2 className="text-xl font-bold mb-4 text-[#00CFC1] dark:text-[#FFC857]">Objectives</h2>
              <ul className="list-disc list-inside space-y-2 text-lg">
                {course.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className={`rounded-2xl shadow-lg p-10 mb-10 ${glassBg}`}>
          <h2 className="text-2xl font-bold mb-6 text-[#00CFC1] dark:text-[#FFC857]">Course Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00CFC1] dark:text-[#FFC857]">
                {formatDuration(course?.duration)}
              </div>
              <div className="text-base text-gray-500">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00CFC1] dark:text-[#FFC857]">
                {course?.enrolledStudentsCount || 0}
              </div>
              <div className="text-base text-gray-500">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00CFC1] dark:text-[#FFC857]">
                {course?.completionRate || 0}%
              </div>
              <div className="text-base text-gray-500">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00CFC1] dark:text-[#FFC857]">
                {new Date(course?.updatedAt).toLocaleDateString()}
              </div>
              <div className="text-base text-gray-500">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className={`rounded-2xl shadow-lg p-10 mb-10 ${glassBg}`}>
          <h2 className="text-2xl font-bold mb-4 text-[#00CFC1] dark:text-[#FFC857]">Your Rating</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-3xl transition-all duration-200 ${
                  star <= (course?.rating || 0) ? 'text-yellow-400 scale-110' : 'text-gray-300'
                } hover:scale-125`}
                onClick={() => handleUpdateRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="text-center text-lg text-gray-600">
            {course?.rating?.toFixed(1) || '0.0'} out of 5.0
          </div>
        </div>

        {/* Reviews */}
        {course?.reviews?.length > 0 && (
          <div className={`rounded-2xl shadow-lg p-10 mb-10 ${glassBg}`}>
            <h2 className="text-2xl font-bold mb-6 text-[#00CFC1] dark:text-[#FFC857]">Student Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {course.reviews.slice(0, 4).map((review, index) => (
                <div key={index} className="rounded-xl border-2 border-[#00CFC1]/20 bg-white/80 dark:bg-[#22304A]/80 p-6 shadow flex flex-col gap-2">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-[#00CFC1]/20 rounded-full flex items-center justify-center mr-3 text-xl font-bold text-[#00CFC1]">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.Fullname}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>
                          {review.user?.Fullname?.firstname?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {review.user?.Fullname?.firstname} {review.user?.Fullname?.lastname}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
            {course.reviews.length > 4 && (
              <div className="text-center mt-6">
                <button
                  className="text-[#00CFC1] hover:text-[#007B8A] font-semibold underline"
                  onClick={() => setShowAnalytics(true)}
                >
                  View all {course.reviews.length} reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;