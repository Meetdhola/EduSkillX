const userModel = require('../models/auth.model');
const contentModel = require('../models/content.model');
const activityModel = require('../models/activity.model');

// Get all users
module.exports.getAllUsers = async () => {
    const users = await userModel.find().select('-password');
    return users;
}

// Get platform activity reports
module.exports.getReports = async (startDate, endDate, type) => {
    const query = {};
    
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    
    if (type) {
        query.type = type;
    }

    const activities = await activityModel.find(query)
        .populate('userId', 'Fullname email')
        .sort({ createdAt: -1 });

    // Generate report summary
    const summary = {
        totalUsers: await userModel.countDocuments(),
        totalActivities: activities.length,
        activitiesByType: await activityModel.aggregate([
            { $match: query },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        recentActivities: activities.slice(0, 10)
    };

    return summary;
}

// Create platform content
module.exports.createContent = async (contentData) => {
    const content = await contentModel.create(contentData);
    return content;
}

// Update platform content
module.exports.updateContent = async (contentId, updateData) => {
    const content = await contentModel.findByIdAndUpdate(
        contentId,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    return content;
}

// Delete platform content
module.exports.deleteContent = async (contentId) => {
    const result = await contentModel.findByIdAndDelete(contentId);
    return result;
} 