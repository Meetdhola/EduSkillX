const aiService = require('../services/ai.service');
const {validationResult} = require('express-validator');

// Get AI study recommendations
module.exports.getRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const recommendations = await aiService.getRecommendations(userId);
        res.status(200).json({ recommendations });
    } catch (error) {
        next(error);
    }
}

// Generate personalized learning path
module.exports.generateLearningPath = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const userId = req.user._id;
        const {preferences} = req.body;
        
        const learningPath = await aiService.generateLearningPath(userId, preferences);
        res.status(200).json({ learningPath });
    } catch (error) {
        next(error);
    }
}

// Fetch user learning progress
module.exports.getLearningProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const progress = await aiService.getLearningProgress(userId);
        res.status(200).json({ progress });
    } catch (error) {
        next(error);
    }
}

// Get personalized study schedule
module.exports.getStudySchedule = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {startDate, endDate} = req.body;
        
        const schedule = await aiService.getStudySchedule(userId, startDate, endDate);
        res.status(200).json({ schedule });
    } catch (error) {
        next(error);
    }
}

// Get AI-powered performance insights
module.exports.getPerformanceInsights = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const insights = await aiService.getPerformanceInsights(userId);
        res.status(200).json({ insights });
    } catch (error) {
        next(error);
    }
}

// Get personalized practice exercises
module.exports.getPracticeExercises = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {topic, difficulty} = req.query;
        
        const exercises = await aiService.getPracticeExercises(userId, topic, difficulty);
        res.status(200).json({ exercises });
    } catch (error) {
        next(error);
    }
}

// Get AI-generated quiz questions
module.exports.getQuizQuestions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {topic, count = 10} = req.query;
        
        const questions = await aiService.getQuizQuestions(userId, topic, count);
        res.status(200).json({ questions });
    } catch (error) {
        next(error);
    }
}

// Get learning style analysis
module.exports.getLearningStyleAnalysis = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const analysis = await aiService.getLearningStyleAnalysis(userId);
        res.status(200).json({ analysis });
    } catch (error) {
        next(error);
    }
}

// Get personalized resource recommendations
module.exports.getResourceRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {topic, resourceType} = req.query;
        
        const resources = await aiService.getResourceRecommendations(userId, topic, resourceType);
        res.status(200).json({ resources });
    } catch (error) {
        next(error);
    }
}

// Get AI-powered study tips
module.exports.getStudyTips = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {topic, count = 5} = req.query;
        
        const tips = await aiService.getStudyTips(userId, topic, count);
        res.status(200).json({ tips });
    } catch (error) {
        next(error);
    }
} 