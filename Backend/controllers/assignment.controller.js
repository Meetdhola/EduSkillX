const Assignment = require('../models/assignment.model');
const Course = require('../models/course.model');

const assignmentController = {
    // Get instructor's assignments
    getInstructorAssignments: async (req, res) => {
        try {
            if (req.user.role !== 'instructor') {
                return res.status(403).json({ message: 'Access denied' });
            }
            const assignments = await Assignment.find({ instructor: req.user.id })
                .populate('course', 'title')
                .populate('submissions.student', 'Fullname email');
            res.json({ assignments });
        } catch (error) {
            console.error('Error in getInstructorAssignments:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get student's assignments
    getStudentAssignments: async (req, res) => {
        try {
            const assignments = await Assignment.find({
                'submissions.student': req.user.id
            }).populate('course', 'title');
            res.json({ assignments });
        } catch (error) {
            console.error('Error in getStudentAssignments:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Create new assignment
    createAssignment: async (req, res) => {
        try {
            if (req.user.role !== 'instructor') {
                return res.status(403).json({ message: 'Access denied' });
            }
            const { courseId, title, description, dueDate } = req.body;
            const assignment = new Assignment({
                course: courseId,
                instructor: req.user.id,
                title,
                description,
                dueDate
            });
            await assignment.save();
            res.status(201).json({ assignment });
        } catch (error) {
            console.error('Error in createAssignment:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Submit assignment
    submitAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const { submission } = req.body;
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }
            assignment.submissions.push({
                student: req.user.id,
                content: submission,
                submittedAt: new Date()
            });
            await assignment.save();
            res.json({ message: 'Assignment submitted successfully' });
        } catch (error) {
            console.error('Error in submitAssignment:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Grade assignment
    gradeAssignment: async (req, res) => {
        try {
            if (req.user.role !== 'instructor') {
                return res.status(403).json({ message: 'Access denied' });
            }
            const { assignmentId, submissionId } = req.params;
            const { grade, feedback } = req.body;
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }
            const submission = assignment.submissions.id(submissionId);
            if (!submission) {
                return res.status(404).json({ message: 'Submission not found' });
            }
            submission.grade = grade;
            submission.feedback = feedback;
            submission.gradedAt = new Date();
            await assignment.save();
            res.json({ message: 'Assignment graded successfully' });
        } catch (error) {
            console.error('Error in gradeAssignment:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = assignmentController; 