const express = require('express');
const { createMarketingEnrollment } = require('../controllers/marketingEnrollmentController');

const router = express.Router();

// Public marketing enrollment endpoint
router.post('/', createMarketingEnrollment);

module.exports = router;
