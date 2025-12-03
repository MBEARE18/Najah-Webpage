const User = require('../models/User');
const { sendResetReminderEmail } = require('../utils/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, schoolName, class: studentClass, board } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone,
      schoolName,
      class: studentClass,
      board
    });

    // Send login response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Send normal login response
    sendTokenResponse(user, 200, res);

    // For students, send a one-time reset reminder email after first successful login
    if (user.role === 'student' && !user.hasSeenResetReminder) {
      try {
        // Fire-and-forget email (do not delay response)
        sendResetReminderEmail(user.email, user.name).catch(err => {
          console.error('Failed to send reset reminder email:', err);
        });

        // Mark reminder as sent without triggering pre-save password hashing
        User.findByIdAndUpdate(user._id, { hasSeenResetReminder: true })
          .catch(err => console.error('Failed to mark reset reminder as sent:', err));
      } catch (emailError) {
        console.error('Error scheduling reset reminder email:', emailError);
      }
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

