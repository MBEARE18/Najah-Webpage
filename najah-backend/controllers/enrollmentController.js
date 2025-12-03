const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin
exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email phone class board')
      .populate('course', 'name board class')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private/Admin
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email phone class board schoolName')
      .populate('course', 'name board class subjects');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create enrollment
// @route   POST /api/enrollments
// @access  Private
exports.createEnrollment = async (req, res, next) => {
  try {
    const { courseId, subjects, studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate amount
    let amount = 0;
    subjects.forEach(subjectName => {
      const subject = course.subjects.find(s => s.name === subjectName);
      if (subject) {
        amount += subject.price;
      }
    });

    const enrollment = await Enrollment.create({
      student: studentId || req.user.id,
      course: courseId,
      subjects,
      amount
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('student', 'name email phone')
      .populate('course', 'name board class');

    res.status(201).json({
      success: true,
      data: populatedEnrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
exports.updateEnrollment = async (req, res, next) => {
  try {
    let enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('student', 'name email phone').populate('course', 'name board class');

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

