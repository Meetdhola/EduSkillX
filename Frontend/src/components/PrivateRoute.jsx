import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/roleUtils';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute; 
