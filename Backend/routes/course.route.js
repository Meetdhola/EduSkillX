const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const courseController = require('../controllers/course.controller');

// Get instructor's courses (specific route)
router.get('/instructor/courses', auth, courseController.getInstructorCourses);

// Get enrolled courses (specific route)
router.get('/user/courses', auth, courseController.getEnrolledCourses);

// Get completed courses for a user
router.get('/user/:userId/completed', auth, courseController.getUserCompletedCourses);

// Get course categories
router.get('/categories', courseController.getCategories);

// Get all courses (admin)
router.get('/', auth, courseController.getAllCourses);

// Create course (admin or instructor)
router.post('/', auth, courseController.createCourse);

// Get course by ID
router.get('/:id', auth, courseController.getCourseById);

// Update course (admin or instructor)
router.put('/:id', auth, courseController.updateCourse);

// Delete course (admin or instructor)
router.delete('/:id', auth, courseController.deleteCourse);

// Enroll in course (student)
router.post('/:id/enroll', auth, courseController.enrollInCourse);

// Mark course as paid (student)
router.post('/:id/mark-paid', auth, courseController.markCourseAsPaid);

// Unenroll from course (student)
router.post('/:id/unenroll', auth, courseController.unenrollFromCourse);

// Mark course as completed (student)
router.post('/:id/complete', auth, courseController.markCourseAsCompleted);

// Update course rating
router.put('/:id/rating', auth, courseController.updateCourseRating);

// Get course analytics
router.get('/:id/analytics', auth, courseController.getCourseAnalytics);

// Add video to module
router.post('/:courseId/modules/:moduleId/videos', auth, courseController.addVideoToModule);

module.exports = router;
