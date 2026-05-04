import { FaHome, FaUser, FaBook, FaUsers, FaFileAlt, FaChartLine, FaCreditCard, FaComments, FaCog } from 'react-icons/fa';

export const navigationConfig = {
    admin: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: FaHome
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: FaUser
        },
        {
            name: 'Courses',
            path: '/dashboard/courses',
            icon: FaBook
        },
        {
            name: 'Users',
            path: '/dashboard/users',
            icon: FaUsers
        },
        {
            name: 'Analytics',
            path: '/dashboard/analytics',
            icon: FaChartLine
        },
        {
            name: 'Payments',
            path: '/dashboard/payments',
            icon: FaCreditCard
        },
        {
            name: 'Messages',
            path: '/dashboard/messages',
            icon: FaComments
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: FaCog
        }
    ],
    tutor: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: FaHome
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: FaUser
        },
        {
            name: 'Courses',
            path: '/dashboard/courses',
            icon: FaBook
        },
        {
            name: 'Assignments',
            path: '/dashboard/assignments',
            icon: FaFileAlt
        },
        {
            name: 'Analytics',
            path: '/dashboard/analytics',
            icon: FaChartLine
        },
        {
            name: 'Payments',
            path: '/dashboard/payments',
            icon: FaCreditCard
        },
        {
            name: 'Messages',
            path: '/dashboard/messages',
            icon: FaComments
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: FaCog
        }
    ],
    user: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: FaHome
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: FaUser
        },
        {
            name: 'Courses',
            path: '/dashboard/courses',
            icon: FaBook
        },
        {
            name: 'Assignments',
            path: '/dashboard/assignments',
            icon: FaFileAlt
        },
        {
            name: 'Messages',
            path: '/dashboard/messages',
            icon: FaComments
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: FaCog
        }
    ]
}; 