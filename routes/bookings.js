const express = require('express');
const { createBooking, getUserBookings, getBookingByPNR, cancelBooking } = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, createBooking);

// Get user bookings
router.get('/', auth, getUserBookings);

// Debug endpoint without auth
router.get('/debug', async (req, res) => {
  try {
    const bookings = await require('../models/Booking').find().limit(5);
    res.json({ bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get booking by PNR
router.get('/pnr/:pnr', auth, getBookingByPNR);

// Cancel booking
router.put('/cancel/:pnr', auth, cancelBooking);

module.exports = router;