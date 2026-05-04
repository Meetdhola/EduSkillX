const Opportunity = require('../models/opportunity.model');
const User = require('../models/auth.model');
const Course = require('../models/course.model');

const opportunityController = {
  // Get opportunities based on user's completed courses
  getOpportunitiesByUser: async (req, res) => {
    try {
      const userId = req.user._id;
      
      // Get user's completed courses
      const user = await User.findById(userId).populate('completedCourses.courseId');
      
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      
      // Extract skills from completed courses
      const userSkills = [];
      user.completedCourses.forEach(completedCourse => {
        if (completedCourse.courseId && completedCourse.courseId.skills) {
          userSkills.push(...completedCourse.courseId.skills);
        }
      });
      
      // Remove duplicates
      const uniqueSkills = [...new Set(userSkills)];
      
      // Find opportunities that match user's skills
      const opportunities = await Opportunity.find({
        skills: { $in: uniqueSkills }
      }).sort({ createdAt: -1 });
      
      res.json({
        message: 'Opportunities retrieved successfully',
        data: opportunities
      });
    } catch (error) {
      console.error('Get opportunities error:', error);
      res.status(500).json({
        message: 'Error retrieving opportunities',
        error: error.message
      });
    }
  },
  
  // Get opportunities by course ID
  getOpportunitiesByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Get course details
      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).json({
          message: 'Course not found'
        });
      }
      
      // Find opportunities that match course skills
      const opportunities = await Opportunity.find({
        skills: { $in: course.skills }
      }).sort({ createdAt: -1 });
      
      res.json({
        message: 'Opportunities retrieved successfully',
        data: opportunities
      });
    } catch (error) {
      console.error('Get opportunities by course error:', error);
      res.status(500).json({
        message: 'Error retrieving opportunities',
        error: error.message
      });
    }
  },
  
  // Get all opportunities
  getAllOpportunities: async (req, res) => {
    try {
      const opportunities = await Opportunity.find().sort({ createdAt: -1 });
      
      res.json({
        message: 'Opportunities retrieved successfully',
        data: opportunities
      });
    } catch (error) {
      console.error('Get all opportunities error:', error);
      res.status(500).json({
        message: 'Error retrieving opportunities',
        error: error.message
      });
    }
  },
  
  // Create a new opportunity (admin only)
  createOpportunity: async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        skills,
        duration,
        compensation,
        requirements,
        applicationUrl,
        company,
        location,
        isRemote
      } = req.body;
      
      const opportunity = new Opportunity({
        title,
        description,
        type,
        skills,
        duration,
        compensation,
        requirements,
        applicationUrl,
        company,
        location,
        isRemote
      });
      
      await opportunity.save();
      
      res.status(201).json({
        message: 'Opportunity created successfully',
        data: opportunity
      });
    } catch (error) {
      console.error('Create opportunity error:', error);
      res.status(500).json({
        message: 'Error creating opportunity',
        error: error.message
      });
    }
  }
};

module.exports = opportunityController; 