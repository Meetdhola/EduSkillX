const { BarterProposal, BarterChat } = require('../models/barter.model');
const Course = require('../models/course.model');
const User = require('../models/auth.model');

// Get all available courses for bartering
exports.getAvailableCourses = async (req, res) => {
  try {
    // Get all courses that the current user is enrolled in
    const enrolledCourses = await Course.find({
      enrolledStudents: req.user._id
    }).select('title description thumbnail instructor price category');

    // Get all courses that are available for bartering (not already in pending/accepted proposals)
    const existingProposals = await BarterProposal.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ],
      status: { $in: ['pending', 'accepted'] }
    }).select('offeredCourse');

    const offeredCourseIds = existingProposals.map(proposal => proposal.offeredCourse.toString());
    
    // Filter out courses that are already offered in active proposals
    const availableCourses = enrolledCourses.filter(course => 
      !offeredCourseIds.includes(course._id.toString())
    );

    res.json({ 
      success: true, 
      courses: availableCourses,
      count: availableCourses.length
    });
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching available courses' });
  }
};

// Get all barter proposals for the current user
exports.getProposals = async (req, res) => {
  try {
    const proposals = await BarterProposal.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    })
    .populate('fromUser', 'Fullname email avatar')
    .populate('toUser', 'Fullname email avatar')
    .populate('offeredCourse', 'title description thumbnail')
    .populate('requestedCourse', 'title description thumbnail')
    .sort('-createdAt');

    res.json({ success: true, proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ success: false, message: 'Error fetching proposals' });
  }
};

// Create a new barter proposal
exports.createProposal = async (req, res) => {
  try {
    const { offeredCourseId, toUserId } = req.body;
    
    console.log('Creating proposal with:', { 
      offeredCourseId, 
      toUserId, 
      fromUserId: req.user._id 
    });

    // Validate required fields
    if (!offeredCourseId || !toUserId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: offeredCourseId and toUserId are required' 
      });
    }

    // Prevent users from creating proposals with themselves
    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot create a barter proposal with yourself' 
      });
    }

    // Verify the course exists and user is enrolled
    const offeredCourse = await Course.findOne({
      _id: offeredCourseId,
      enrolledStudents: req.user._id
    });
    
    if (!offeredCourse) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found or you are not enrolled' 
      });
    }

    // Verify the target user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Target user not found' 
      });
    }

    // Check if a proposal already exists
    const existingProposal = await BarterProposal.findOne({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredCourse: offeredCourseId,
      status: 'pending'
    });

    if (existingProposal) {
      return res.status(400).json({ 
        success: false, 
        message: 'A proposal already exists for this exchange' 
      });
    }

    // Create the proposal
    const proposal = new BarterProposal({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredCourse: offeredCourseId,
      status: 'pending'
    });

    await proposal.save();
    console.log('Proposal saved successfully:', proposal._id);

    // Populate the proposal with user and course details
    const populatedProposal = await BarterProposal.findById(proposal._id)
      .populate('fromUser', 'Fullname email avatar')
      .populate('toUser', 'Fullname email avatar')
      .populate('offeredCourse', 'title description thumbnail')
      .populate('requestedCourse', 'title description thumbnail');

    res.status(201).json({ success: true, proposal: populatedProposal });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating proposal',
      error: error.message
    });
  }
};

// Update a barter proposal with requested course
exports.updateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { requestedCourseId } = req.body;

    const proposal = await BarterProposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify the requested course exists and user is enrolled
    const requestedCourse = await Course.findOne({
      _id: requestedCourseId,
      enrolledStudents: req.user._id
    });
    
    if (!requestedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found or you are not enrolled' });
    }

    proposal.requestedCourse = requestedCourseId;
    await proposal.save();

    const populatedProposal = await BarterProposal.findById(proposalId)
      .populate('fromUser', 'Fullname email avatar')
      .populate('toUser', 'Fullname email avatar')
      .populate('offeredCourse', 'title description thumbnail')
      .populate('requestedCourse', 'title description thumbnail');

    res.json({ success: true, proposal: populatedProposal });
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ success: false, message: 'Error updating proposal' });
  }
};

// Accept a barter proposal
exports.acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await BarterProposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify the user is authorized to accept the proposal
    if (proposal.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this proposal' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Proposal cannot be accepted' });
    }

    // Update proposal status to accepted
    proposal.status = 'accepted';
    await proposal.save();

    // Get the offered course
    const offeredCourse = await Course.findById(proposal.offeredCourse);
    if (!offeredCourse) {
      return res.status(404).json({ success: false, message: 'Offered course not found' });
    }

    // Add the current user to the offered course's enrolled students
    if (!offeredCourse.enrolledStudents.includes(req.user._id)) {
      offeredCourse.enrolledStudents.push(req.user._id);
      await offeredCourse.save();
    }

    // If there's a requested course, add the proposal creator to its enrolled students
    if (proposal.requestedCourse) {
      const requestedCourse = await Course.findById(proposal.requestedCourse);
      if (requestedCourse && !requestedCourse.enrolledStudents.includes(proposal.fromUser)) {
        requestedCourse.enrolledStudents.push(proposal.fromUser);
        await requestedCourse.save();
      }
    }

    const populatedProposal = await BarterProposal.findById(proposalId)
      .populate('fromUser', 'Fullname email avatar')
      .populate('toUser', 'Fullname email avatar')
      .populate('offeredCourse', 'title description thumbnail')
      .populate('requestedCourse', 'title description thumbnail');

    res.json({ success: true, proposal: populatedProposal });
  } catch (error) {
    console.error('Error accepting proposal:', error);
    res.status(500).json({ success: false, message: 'Error accepting proposal' });
  }
};

// Reject a barter proposal
exports.rejectProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await BarterProposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify the user is authorized to reject the proposal
    if (proposal.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this proposal' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Proposal cannot be rejected' });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.json({ success: true, message: 'Proposal rejected successfully' });
  } catch (error) {
    console.error('Error rejecting proposal:', error);
    res.status(500).json({ success: false, message: 'Error rejecting proposal' });
  }
};

// Get chat messages for a proposal
exports.getChatMessages = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await BarterProposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify the user is part of the proposal
    if (![proposal.fromUser.toString(), proposal.toUser.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
    }

    const messages = await BarterChat.find({ proposal: proposalId })
      .populate('sender', 'Fullname email avatar')
      .sort('createdAt');

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
};

// Send a chat message
exports.sendMessage = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { content } = req.body;

    const proposal = await BarterProposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Verify the user is part of the proposal
    if (![proposal.fromUser.toString(), proposal.toUser.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages in this chat' });
    }

    if (proposal.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Can only send messages for accepted proposals' });
    }

    const message = new BarterChat({
      proposal: proposalId,
      sender: req.user._id,
      content
    });

    await message.save();

    const populatedMessage = await BarterChat.findById(message._id)
      .populate('sender', 'Fullname email avatar');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};

// Get all users with available courses for bartering
exports.getUsersWithAvailableCourses = async (req, res) => {
  try {
    // Get all courses that have enrolled students
    const courses = await Course.find({
      enrolledStudents: { $exists: true, $ne: [] }
    }).populate('enrolledStudents', '_id Fullname email avatar');

    // Create a map of users and their courses
    const userCoursesMap = new Map();
    
    courses.forEach(course => {
      course.enrolledStudents.forEach(user => {
        if (user._id.toString() !== req.user._id.toString()) {
          if (!userCoursesMap.has(user._id.toString())) {
            userCoursesMap.set(user._id.toString(), {
              user: user,
              courses: []
            });
          }
          userCoursesMap.get(user._id.toString()).courses.push({
            _id: course._id,
            title: course.title,
            thumbnail: course.thumbnail
          });
        }
      });
    });

    // Convert map to array
    const users = Array.from(userCoursesMap.values()).map(({ user, courses }) => ({
      _id: user._id,
      Fullname: user.Fullname,
      email: user.email,
      avatar: user.avatar,
      courseCount: courses.length,
      courses: courses
    }));

    res.json({ 
      success: true, 
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users with available courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching users with available courses' });
  }
};