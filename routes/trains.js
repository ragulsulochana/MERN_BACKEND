const express = require('express');
const { addTrain, searchTrains, getAllTrains, getTrainById } = require('../controllers/trainController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Search trains (public)
router.get('/search', searchTrains);

// Get train by ID
router.get('/:id', getTrainById);

// Add train (Admin only)
router.post('/', auth, adminAuth, addTrain);

// Get all trains (Admin only)
router.get('/', auth, adminAuth, getAllTrains);

module.exports = router;