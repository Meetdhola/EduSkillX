/**
 * Role-based access control utilities
 * This file provides consistent role checking across the application
 */

/**
 * Get the current user from localStorage
 * @returns {Object|null} The user object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // Ensure user has _id field (some parts of the app may expect this)
    if (user && !user._id && user.id) {
      user._id = user.id;
    }
    
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Check if the current user has a specific role
 * @param {string} role - The role to check for
 * @returns {boolean} True if the user has the role, false otherwise
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Check if the current user is an admin
 * @returns {boolean} True if the user is an admin, false otherwise
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Check if the current user is an instructor
 * @returns {boolean} True if the user is an instructor, false otherwise
 */
export const isInstructor = () => {
  return hasRole('instructor');
};

/**
 * Check if the current user is a student
 * @returns {boolean} True if the user is a student, false otherwise
 */
export const isStudent = () => {
  return hasRole('user');
};

/**
 * Get the user ID from localStorage
 * @returns {string|null} The user ID or null if not found
 */
export const getUserId = () => {
  try {
    // First try to get from getCurrentUser
    const user = getCurrentUser();
    if (user && (user._id || user.id)) {
      return user._id || user.id;
    }
    
    // Fall back to just getting userId directly
    return localStorage.getItem('userId');
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Check if the current user is the owner of a resource
 * @param {string} resourceUserId - The user ID of the resource owner
 * @returns {boolean} True if the current user is the owner, false otherwise
 */
export const isOwner = (resourceUserId) => {
  const userId = getUserId();
  return userId === resourceUserId;
};