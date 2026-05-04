const userModel = require('../models/auth.model');
const learningProgressModel = require('../models/learning-progress.model');
const courseModel = require('../models/course.model');

// Get AI study recommendations
module.exports.getRecommendations = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Fetch user's learning progress
    const progress = await learningProgressModel.find({ userId });
    
    // Get all available courses
    const courses = await courseModel.find({ status: 'published' });
    
    // Process user's progress and generate recommendations
    const recommendations = [];
    
    // Add course recommendations based on progress
    for (const course of courses) {
        const userProgress = progress.find(p => p.courseId.toString() === course._id.toString());
        
        if (!userProgress) {
            // Recommend new courses
            recommendations.push({
                type: 'course',
                title: course.title,
                description: course.description,
                confidence: 0.8,
                courseId: course._id,
                difficulty: course.difficulty,
                duration: course.duration
            });
        } else if (userProgress.progress < 100) {
            // Recommend continuing in-progress courses
            recommendations.push({
                type: 'continue',
                title: course.title,
                description: `Continue learning ${course.title} (${userProgress.progress}% complete)`,
                confidence: 0.9,
                courseId: course._id,
                progress: userProgress.progress
            });
        }
    }

    // Add topic-specific recommendations
    for (const prog of progress) {
        const course = courses.find(c => c._id.toString() === prog.courseId.toString());
        if (!course) continue;

        const completedTopicIds = prog.completedTopics.map(t => t.topicId);
        const remainingTopics = course.topics.filter(t => !completedTopicIds.includes(t));

        if (remainingTopics.length > 0) {
            recommendations.push({
                type: 'topic',
                title: remainingTopics[0],
                description: `Next topic in ${course.title}`,
                confidence: 0.85,
                courseId: course._id,
                topicId: remainingTopics[0]
            });
        }
    }

    return { recommendations };
}

// Generate personalized learning path
module.exports.generateLearningPath = async (userId, preferences) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Fetch user's progress and available courses
    const progress = await learningProgressModel.find({ userId });
    const courses = await courseModel.find({ status: 'published' });

    // Generate learning path based on progress and preferences
    const path = [];
    let currentWeek = 1;

    // Add in-progress courses to path
    for (const prog of progress) {
        if (prog.progress < 100) {
            const course = courses.find(c => c._id.toString() === prog.courseId.toString());
            if (!course) continue;

            const remainingTopics = course.topics.filter(t => 
                !prog.completedTopics.some(ct => ct.topicId === t)
            );

            if (remainingTopics.length > 0) {
                path.push({
                    week: currentWeek++,
                    courseId: course._id,
                    courseTitle: course.title,
                    topics: remainingTopics.slice(0, 2),
                    goals: [
                        `Complete ${remainingTopics[0]}`,
                        `Achieve 80% or higher in topic assessments`
                    ]
                });
            }
        }
    }

    // Add new courses based on preferences
    const newCourses = courses.filter(course => 
        !progress.some(p => p.courseId.toString() === course._id.toString())
    );

    for (const course of newCourses) {
        if (currentWeek <= 4) { // Limit to 4 weeks of planning
            path.push({
                week: currentWeek++,
                courseId: course._id,
                courseTitle: course.title,
                topics: course.topics.slice(0, 2),
                goals: [
                    `Start ${course.title}`,
                    `Complete initial topics`
                ]
            });
        }
    }

    return { path };
}

// Get learning progress
module.exports.getLearningProgress = async (userId) => {
    const progress = await learningProgressModel.find({ userId });
    const courses = await courseModel.find({ status: 'published' });

    if (!progress.length) {
        return {
            overallProgress: 0,
            completedTopics: [],
            currentStreak: 0,
            coursesInProgress: [],
            recommendedNextSteps: []
        };
    }

    // Calculate overall progress
    const totalProgress = progress.reduce((acc, curr) => acc + curr.progress, 0);
    const overallProgress = Math.round(totalProgress / progress.length);

    // Get completed topics
    const completedTopics = progress.flatMap(p => 
        p.completedTopics.map(t => ({
            ...t,
            courseId: p.courseId
        }))
    );

    // Calculate current streak
    const lastUpdatedDates = completedTopics
        .map(t => new Date(t.lastUpdated))
        .sort((a, b) => b - a);

    let currentStreak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < lastUpdatedDates.length; i++) {
        const dateDiff = Math.floor((currentDate - lastUpdatedDates[i]) / (1000 * 60 * 60 * 24));
        if (dateDiff === 1) {
            currentStreak++;
            currentDate = lastUpdatedDates[i];
        } else {
            break;
        }
    }

    // Get courses in progress
    const coursesInProgress = progress
        .filter(p => p.progress < 100)
        .map(p => {
            const course = courses.find(c => c._id.toString() === p.courseId.toString());
            return {
                courseId: p.courseId,
                title: course?.title || 'Unknown Course',
                progress: p.progress,
                lastUpdated: p.lastUpdated
            };
        });

    // Generate recommended next steps
    const recommendedNextSteps = [];
    for (const prog of progress) {
        if (prog.progress < 100) {
            const course = courses.find(c => c._id.toString() === prog.courseId.toString());
            if (!course) continue;

            const nextTopic = course.topics.find(t => 
                !prog.completedTopics.some(ct => ct.topicId === t)
            );

            if (nextTopic) {
                recommendedNextSteps.push({
                    courseId: course._id,
                    courseTitle: course.title,
                    nextTopic,
                    progress: prog.progress
                });
            }
        }
    }

    return {
        overallProgress,
        completedTopics,
        currentStreak,
        coursesInProgress,
        recommendedNextSteps
    };
} 