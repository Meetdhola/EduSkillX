import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// import LoginPage from './components/LoginPage'
import ARVR from './components/ArVr'
import AIChat from './components/AIChat'
// import CourseVerification from './components/Courseverfication'
import UserLogin from './components/auth/UserLogin'
import UserSignup from './components/auth/UserSignup'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import { ThemeProvider } from './context/ThemeContext'
import UserContext from './context/userContext'
import PrivateRoute from './components/PrivateRoute'
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail'
import CreateCourse from './components/CreateCourse'
import AdminDashboard from './components/dashboard/AdminDashboard'
import Profile from './components/dashboard/Profile'
import Payment from './components/Payment'
import CourseLearning from './components/CourseLearning'
import { getCurrentUser, isAdmin } from './utils/roleUtils'
import Notifications from './components/Notifications'
import MicroInternship from './components/MicroInternship'
import Freelancing from './components/Freelancing'
import Roadmap from './components/Roadmap'
import EduSkillXBarter from './components/EduSkillXBarter'
import Transcription from './components/Transcription'
import OpportunitiesPage from './pages/OpportunitiesPage'
// import Certificate from './components/Certificate'
import './App.css'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import CustomerReview from './components/CustomerReview'
import QueueVRVisualization from './components/QueueVisualization'
import StackVisualization from './components/StackVisualization'
import About from './components/About'
import ContactUs from './components/ContactUs'
import EmailReminder from './components/EmailReminder'
import Settings from './components/dashboard/Settings'
import Analytics from './components/dashboard/Analytics'
import Assignments from './components/dashboard/Assignments'
// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!userIsAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <UserContext>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            {/* <Route path="/arvr" element={<ARVR/>} /> */}
            <Route path="/AIChat" element={<AIChat/>} />
            <Route path="/roadmap" element={<Roadmap/>} />
            <Route path="/barter" element={<EduSkillXBarter/>} />
            <Route path="/review" element={<CustomerReview/>} />
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<ContactUs/>}/>
            <Route path="/EmailRemainder" element={<EmailReminder/>}/>
            <Route path="/Profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings/></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics/></PrivateRoute>} />
            <Route path="/assignments" element={<PrivateRoute><Assignments/></PrivateRoute>} />
            {/* <Route path="/certificate" element={<Certificate/>} /> */}
            
            {/* <Route path="/CourseVerification" element={<CourseVerification/>} /> */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/opportunities"
              element={
                <PrivateRoute>
                  <OpportunitiesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/create"
              element={
                <PrivateRoute>
                  <CreateCourse />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment/:courseId"
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseId/learn"
              element={
                <PrivateRoute>
                  <CourseLearning />
                </PrivateRoute>
              }
            />
            <Route
              path="/transcriptions"
              element={
                <PrivateRoute>
                  <Transcription />
                </PrivateRoute>
              }
            />
            <Route path="/micro-internship" element={<PrivateRoute><MicroInternship /></PrivateRoute>} />
            <Route path="/freelancing" element={<PrivateRoute><Freelancing /></PrivateRoute>} />
            <Route path="/data-structures/stack" element={<PrivateRoute><StackVisualization /></PrivateRoute>} />
            <Route path="/data-structures/linked-list" element={<PrivateRoute><LinkedListVisualizer /></PrivateRoute>} />
            {/* <Route path="/data-structures/queue" element={<PrivateRoute><QueueVRVisualization/></PrivateRoute>} /> */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserContext>
      </ThemeProvider>
    </Router>
  )
}

export default App
