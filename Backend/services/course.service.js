const courseModel = require('../models/course.model');

const courseService = {
    // Create a new course
    createCourse: async (courseData) => {
        try {
            const course = new courseModel(courseData);
            await course.save();
            return course;
        } catch (error) {
            throw new Error(`Error creating course: ${error.message}`);
        }
    },

    // Get all courses with optional filters
    getAllCourses: async (filters = {}) => {
        try {
            const query = {};
            
            // Apply filters
            if (filters.type) query.type = filters.type;
            if (filters.difficulty) query.difficulty = filters.difficulty;
            if (filters.instructor) query.instructor = filters.instructor;
            if (filters.status) query.status = filters.status;
            if (filters.minPrice || filters.maxPrice) {
                query.price = {};
                if (filters.minPrice) query.price.$gte = filters.minPrice;
                if (filters.maxPrice) query.price.$lte = filters.maxPrice;
            }
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }

            return await courseModel
                .find(query)
                .populate('instructor', 'Fullname email')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching courses: ${error.message}`);
        }
    },

    // Get course by ID
    getCourseById: async (courseId) => {
        try {
            return await courseModel
                .findById(courseId)
                .populate('instructor', 'Fullname email')
                .populate('enrolledStudents', 'Fullname email');
        } catch (error) {
            throw new Error(`Error fetching course: ${error.message}`);
        }
    },

    // Update course
    updateCourse: async (courseId, updateData) => {
        try {
            return await courseModel
                .findByIdAndUpdate(courseId, updateData, { new: true })
                .populate('instructor', 'Fullname email');
        } catch (error) {
            throw new Error(`Error updating course: ${error.message}`);
        }
    },

    // Delete course
    deleteCourse: async (courseId) => {
        try {
            return await courseModel.findByIdAndDelete(courseId);
        } catch (error) {
            throw new Error(`Error deleting course: ${error.message}`);
        }
    },

    // Get instructor's courses
    getInstructorCourses: async (instructorId) => {
        try {
            return await courseModel
                .find({ instructor: instructorId })
                .populate('enrolledStudents', 'Fullname email');
        } catch (error) {
            throw new Error(`Error fetching instructor courses: ${error.message}`);
        }
    },

    // Get student's enrolled courses
    getEnrolledCourses: async (studentId) => {
        try {
            return await courseModel
                .find({ enrolledStudents: studentId })
                .populate('instructor', 'Fullname email');
        } catch (error) {
            throw new Error(`Error fetching enrolled courses: ${error.message}`);
        }
    },

    // Update course rating
    updateCourseRating: async (courseId, rating) => {
        try {
            const course = await courseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            // Update ratings array
            course.ratings.push(rating);
            
            // Calculate new average rating
            course.averageRating = course.ratings.reduce((acc, curr) => acc + curr, 0) / course.ratings.length;
            
            await course.save();
            return course;
        } catch (error) {
            throw new Error(`Error updating course rating: ${error.message}`);
        }
    },

    // Get course analytics
    getCourseAnalytics: async (courseId) => {
        try {
            const course = await courseModel
                .findById(courseId)
                .populate('enrolledStudents', 'Fullname email');

            if (!course) {
                throw new Error('Course not found');
            }

            const analytics = {
                totalEnrollments: course.enrolledStudents.length,
                averageRating: course.averageRating || 0,
                totalRatings: course.ratings.length,
                ratingDistribution: course.ratings.reduce((acc, rating) => {
                    acc[rating] = (acc[rating] || 0) + 1;
                    return acc;
                }, {}),
                revenue: course.price * course.enrolledStudents.length
            };

            return analytics;
        } catch (error) {
            throw new Error(`Error fetching course analytics: ${error.message}`);
        }
    }
};

module.exports = courseService; 