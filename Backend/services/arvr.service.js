// const courseModel = require('../models/course.model');
const progressModel = require('../models/progress.model');

// // Get list of AR/VR-enabled courses
// module.exports.getCourses = async () => {
//     const courses = await courseModel.find({ type: 'arvr' });
//     return courses;
// }

// // Get details of a specific course
// module.exports.getCourseDetails = async (courseId) => {
//     const course = await courseModel.findById(courseId);
//     return course;
// }

// Save AR/VR course progress
module.exports.saveProgress = async (userId, courseId, progress) => {
    const existingProgress = await progressModel.findOne({ userId, courseId });
    
    if (existingProgress) {
        existingProgress.progress = progress;
        existingProgress.lastUpdated = new Date();
        return await existingProgress.save();
    }

    const newProgress = await progressModel.create({
        userId,
        courseId,
        progress,
        lastUpdated: new Date()
    });

    return newProgress;
} 