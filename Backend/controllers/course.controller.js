const Course = require('../models/course.model');
const User = require('../models/auth.model');
const {validationResult} = require('express-validator');

const courseController = {
    // Create a new course
    createCourse: async (req, res, next) => {
        try {
            // Check if user is an instructor or admin
            if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
                return res.status(403).json({ 
                    message: 'Only instructors or admins can create courses',
                    role: req.user.role
                });
            }

            const {
                title,
                description,
                category,
                type,
                duration,
                difficulty,
                topics,
                price,
                requirements,
                objectives,
                thumbnail,
                status
            } = req.body;

            // Validate required fields
            if (!title || !description || !category || !type || !duration || !difficulty || !price) {
                return res.status(400).json({ 
                    message: 'Missing required fields',
                    details: {
                        title: !title ? 'Title is required' : null,
                        description: !description ? 'Description is required' : null,
                        category: !category ? 'Category is required' : null,
                        type: !type ? 'Type is required' : null,
                        duration: !duration ? 'Duration is required' : null,
                        difficulty: !difficulty ? 'Difficulty is required' : null,
                        price: !price ? 'Price is required' : null
                    }
                });
            }

            // Create course data object with exact fields
            const courseData = {
                title,
                description,
                category,
                type,
                instructor: req.user._id, // Use the authenticated user's ID
                duration: Number(duration),
                difficulty,
                topics: topics || [],
                price: Number(price),
                requirements: requirements || [],
                objectives: objectives || [],
                thumbnail: thumbnail || '',
                status: status || 'draft' // Default to draft if not specified
            };

            console.log('Creating course with data:', courseData);

            // Create new course
            const course = new Course(courseData);
            await course.save();

            res.status(201).json({
                message: 'Course created successfully',
                course
            });
        } catch (error) {
            console.error('Create course error:', error);
            
            // Handle validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                Object.keys(error.errors).forEach(key => {
                    validationErrors[key] = error.errors[key].message;
                });
                return res.status(400).json({ 
                    message: 'Validation error', 
                    errors: validationErrors 
                });
            }
            
            res.status(500).json({ message: 'Error creating course', error: error.message });
        }
    },

    // Get all courses with optional filters
    getAllCourses: async (req, res, next) => {
        try {
            const { 
                type, 
                difficulty, 
                instructor, 
                status,
                minPrice,
                maxPrice,
                search
            } = req.query;

            // Build query
            const query = {};
            if (type) query.type = type;
            if (difficulty) query.difficulty = difficulty;
            if (instructor) query.instructor = instructor;
            if (status) query.status = status;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = Number(minPrice);
                if (maxPrice) query.price.$lte = Number(maxPrice);
            }
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Get the authenticated user's ID
            const userId = req.user._id;

            // Find all courses and populate instructor info
            const courses = await Course
                .find(query)
                .populate('instructor', 'Fullname email')
                .sort({ createdAt: -1 });

            // Get user's enrolled courses to calculate progress
            const user = await User.findById(userId)
                .select('enrolledCourses completedCourses')
                .populate('enrolledCourses', '_id progress');

            // Map courses with progress information
            const coursesWithProgress = courses.map(course => {
                const userCourse = user?.enrolledCourses?.find(ec => ec._id.toString() === course._id.toString());
                const isCompleted = user?.completedCourses?.includes(course._id);
                
                return {
                    ...course.toObject(),
                    progress: userCourse ? userCourse.progress : 0,
                    isEnrolled: !!userCourse,
                    isCompleted
                };
            });

            res.json({
                message: 'Courses retrieved successfully',
                courses: coursesWithProgress
            });
        } catch (error) {
            console.error('Get all courses error:', error);
            res.status(500).json({ message: 'Error retrieving courses', error: error.message });
        }
    },

    // Get course by ID
    getCourseById: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const course = await Course
                .findById(courseId)
                .populate('instructor', 'Fullname email bio')
                .populate('enrolledStudents', 'Fullname email');

            if (!course) {
                return res.status(404).json({
                    errors: [{
                        msg: "Course not found",
                        param: "id",
                        location: "params"
                    }]
                });
            }

            res.status(200).json({ course });
        } catch (error) {
            next(error);
        }
    },

    // Update course
    updateCourse: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            }

            const courseId = req.params.id;
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    errors: [{
                        msg: "Course not found",
                        param: "id",
                        location: "params"
                    }]
                });
            }

            // Check if user is the instructor or admin
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    errors: [{
                        msg: "Not authorized to update this course",
                        location: "auth"
                    }]
                });
            }

            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            res.status(200).json({ course: updatedCourse });
        } catch (error) {
            next(error);
        }
    },

    // Delete course
    deleteCourse: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    errors: [{
                        msg: "Course not found",
                        param: "id",
                        location: "params"
                    }]
                });
            }

            // Check if user is the instructor or admin
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    errors: [{
                        msg: "Not authorized to delete this course",
                        location: "auth"
                    }]
                });
            }

            await Course.findByIdAndDelete(courseId);
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            next(error);
        }
    },

    // Enroll in a course
    enrollInCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            // Find the course
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user is already enrolled
            const isUserEnrolled = user.enrolledCourses.includes(id);
            const isCourseEnrolled = course.enrolledStudents.includes(userId);

            // If there's a mismatch in enrollment status
            if (isUserEnrolled !== isCourseEnrolled) {
                if (isUserEnrolled) {
                    // User thinks they're enrolled but course doesn't have them
                    course.enrolledStudents.push(userId);
                    course.enrolledStudentsCount = course.enrolledStudents.length;
                } else {
                    // Course thinks user is enrolled but user doesn't have the course
                    user.enrolledCourses.push(id);
                }
            } else if (isUserEnrolled && isCourseEnrolled) {
                // User is already enrolled in both places
                return res.status(200).json({ 
                    success: true,
                    message: 'User is already enrolled in this course'
                });
            } else {
                // User is not enrolled, proceed with enrollment
                user.enrolledCourses.push(id);
                course.enrolledStudents.push(userId);
                course.enrolledStudentsCount = course.enrolledStudents.length;
            }

            // Save both documents
            await Promise.all([
                user.save({ validateBeforeSave: false }),
                course.save({ validateBeforeSave: false })
            ]);

            res.status(200).json({
                success: true,
                message: 'Successfully enrolled in the course'
            });
        } catch (error) {
            console.error('Error in enrollInCourse:', error);
            res.status(500).json({ message: 'Error enrolling in course', error: error.message });
        }
    },

    // Mark course as paid
    markCourseAsPaid: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            // Find the course
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check if user is already marked as paid
            if (course.paidStudents.includes(userId)) {
                return res.status(200).json({
                    success: true,
                    message: 'Course is already marked as paid'
                });
            }

            // Add user to paid students
            course.paidStudents.push(userId);
            await course.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                message: 'Course marked as paid successfully'
            });
        } catch (error) {
            console.error('Error in markCourseAsPaid:', error);
            res.status(500).json({ message: 'Error marking course as paid', error: error.message });
        }
    },

    // Unenroll from a course
    unenrollFromCourse: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const userId = req.user._id;

            // Find course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    errors: [{
                        msg: "Course not found",
                        param: "id",
                        location: "params"
                    }]
                });
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    errors: [{
                        msg: "User not found",
                        location: "auth"
                    }]
                });
            }

            // Check if user is enrolled
            if (!course.enrolledStudents.includes(userId)) {
                return res.status(400).json({
                    errors: [{
                        msg: "Not enrolled in this course",
                        location: "body"
                    }]
                });
            }

            // Update course
            course.enrolledStudents = course.enrolledStudents.filter(
                studentId => studentId.toString() !== userId.toString()
            );
            course.enrolledStudentsCount -= 1;
            await course.save({ validateBeforeSave: false });

            // Update user
            user.enrolledCourses = user.enrolledCourses.filter(
                enrolledCourseId => enrolledCourseId.toString() !== courseId.toString()
            );
            await user.save();

            res.status(200).json({ 
                message: "Successfully unenrolled from course",
                course: {
                    id: course._id,
                    title: course.title,
                    enrolledStudentsCount: course.enrolledStudentsCount
                },
                user: {
                    id: user._id,
                    enrolledCoursesCount: user.enrolledCourses.length
                }
            });
        } catch (error) {
            console.error('Unenrollment error:', error);
            res.status(500).json({ message: 'Error unenrolling from course', error: error.message });
        }
    },

    // Get instructor's courses
    getInstructorCourses: async (req, res, next) => {
        try {
            if (req.user.role !== 'instructor') {
                return res.status(403).json({ message: 'Access denied' });
            }
            const courses = await Course
                .find({ instructor: req.user._id })
                .populate('enrolledStudents', 'Fullname email');
            res.json({ courses });
        } catch (error) {
            next(error);
        }
    },

    // Get enrolled courses
    getEnrolledCourses: async (req, res, next) => {
        try {
            // Remove the role check to allow all authenticated users
            const courses = await Course
                .find({ enrolledStudents: req.user._id })
                .populate('instructor', 'Fullname email');
            res.json({ courses });
        } catch (error) {
            next(error);
        }
    },

    // Update course rating
    updateCourseRating: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const { rating } = req.body;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Update rating
            course.rating = rating;
            await course.save();

            res.json({ message: 'Rating updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    // Get course analytics
    getCourseAnalytics: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check if user is the instructor
            if (course.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view analytics' });
            }

            const analytics = {
                totalStudents: course.enrolledStudents.length,
                completionRate: course.completionRate || 0,
                averageRating: course.rating || 0,
                revenue: course.price * course.enrolledStudents.length
            };

            res.json({ analytics });
        } catch (error) {
            next(error);
        }
    },

    // Get all unique categories
    getCategories: async (req, res) => {
        try {
            const categories = await Course.distinct('category');
            res.json({ categories });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    },

    // Add video to module
    addVideoToModule: async (req, res) => {
        try {
            // Check if user is an instructor or admin
            if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
                return res.status(403).json({ 
                    message: 'Only instructors or admins can add videos to modules',
                    role: req.user.role
                });
            }

            const { courseId, moduleId } = req.params;
            const { title, description, youtubeId, duration } = req.body;

            // Validate required fields
            if (!title || !youtubeId) {
                return res.status(400).json({
                    message: 'Title and YouTube ID are required'
                });
            }

            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    message: 'Course not found'
                });
            }

            // Check if user is the instructor of the course (unless they're an admin)
            if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: 'Only the course instructor can add videos to this course'
                });
            }

            // Find the module
            const module = course.modules[moduleId];
            if (!module) {
                return res.status(404).json({
                    message: 'Module not found'
                });
            }

            // Add the video to the module
            const video = {
                title,
                description,
                youtubeId,
                duration,
                order: module.videos ? module.videos.length : 0
            };

            if (!module.videos) {
                module.videos = [];
            }
            module.videos.push(video);

            // Save the course
            await course.save();

            res.status(201).json({
                message: 'Video added successfully',
                video
            });
        } catch (error) {
            console.error('Error adding video to module:', error);
            res.status(500).json({
                message: 'Error adding video to module',
                error: error.message
            });
        }
    },

    // Get user completed courses
    getUserCompletedCourses: async (req, res) => {
        try {
            const userId = req.params.userId;
            
            // Find the user and populate their completed courses
            const user = await User.findById(userId).populate({
                path: 'completedCourses.course',
                select: 'title description thumbnail skills level duration'
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Extract completed courses with completion date
            const completedCourses = user.completedCourses.map(completed => ({
                ...completed.course.toObject(),
                completedAt: completed.completedAt
            }));

            res.json(completedCourses);
        } catch (error) {
            console.error('Error getting user completed courses:', error);
            res.status(500).json({ message: 'Error getting completed courses', error: error.message });
        }
    },

    // Mark course as completed
    markCourseAsCompleted: async (req, res) => {
        try {
            const courseId = req.params.id;
            const userId = req.user._id;

            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user is enrolled
            if (!course.enrolledStudents.includes(userId)) {
                return res.status(400).json({ message: 'User is not enrolled in this course' });
            }

            // Check if course is already completed
            const isAlreadyCompleted = user.completedCourses.some(
                completed => completed.course.toString() === courseId
            );

            if (isAlreadyCompleted) {
                return res.status(200).json({ message: 'Course is already marked as completed' });
            }

            // Add to completed courses with completion date
            user.completedCourses.push({
                course: courseId,
                completedAt: new Date()
            });

            await user.save();

            res.status(200).json({
                message: 'Course marked as completed successfully',
                completedCourse: {
                    courseId,
                    completedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error marking course as completed:', error);
            res.status(500).json({ message: 'Error marking course as completed', error: error.message });
        }
    }
};

module.exports = courseController;