const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const assignmentController = require('../controllers/assignment.controller');

// Get instructor's assignments
router.get('/instructor/assignments', auth, assignmentController.getInstructorAssignments);

// Get student's assignments
router.get('/student/assignments', auth, assignmentController.getStudentAssignments);

// Create new assignment
router.post('/assignments', auth, assignmentController.createAssignment);

// Submit assignment
router.post('/assignments/:assignmentId/submit', auth, assignmentController.submitAssignment);

// Grade assignment
router.post('/assignments/:assignmentId/submissions/:submissionId/grade', auth, assignmentController.gradeAssignment);

module.exports = router; 