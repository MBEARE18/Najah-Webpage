const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all live classes
// @route   GET /api/live-classes
// @access  Public
exports.getLiveClasses = async (req, res, next) => {
  try {
    const { status, courseId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (courseId) query.course = courseId;

    const classes = await LiveClass.find(query)
      .populate('course', 'name board class')
      .populate('teacher', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort('scheduledDate');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single live class
// @route   GET /api/live-classes/:id
// @access  Public
exports.getLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('course', 'name board class')
      .populate('teacher', 'name email phone')
      .populate('enrolledStudents', 'name email');

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create live class
// @route   POST /api/live-classes
// @access  Private/Admin
exports.createLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.create(req.body);

    const populatedClass = await LiveClass.findById(liveClass._id)
      .populate('course', 'name board class')
      .populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      data: populatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update live class
// @route   PUT /api/live-classes/:id
// @access  Private/Admin
exports.updateLiveClass = async (req, res, next) => {
  try {
    let liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('course', 'name board class').populate('teacher', 'name email');

    res.status(200).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Admin
exports.deleteLiveClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    await liveClass.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Live class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll student in live class
// @route   POST /api/live-classes/:id/enroll
// @access  Private
exports.enrollInClass = async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    if (liveClass.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Student already enrolled in this class'
      });
    }

    if (liveClass.enrolledStudents.length >= liveClass.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Class is full'
      });
    }

    liveClass.enrolledStudents.push(req.user.id);
    await liveClass.save();

    res.status(200).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

