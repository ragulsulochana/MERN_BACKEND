const Booking = require('../models/Booking');
const Train = require('../models/Train');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { trainId, travelDate, class: travelClass, passengers } = req.body;
    // Basic request validation
    if (!trainId || !travelDate || !travelClass || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid booking data' });
    }
    // Validate train exists
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Validate selected class exists on the train
    console.log('Train classes:', train.classes);
    console.log('Selected class:', travelClass);
    if (!train.classes || !train.classes[travelClass]) {
      return res.status(400).json({ message: `Selected class '${travelClass}' is not available on this train` });
    }

    // Validate travelDate
    const travel = new Date(travelDate);
    if (isNaN(travel.getTime())) {
      return res.status(400).json({ message: 'Invalid travel date' });
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    if (travel < today) {
      return res.status(400).json({ message: 'Travel date cannot be in the past' });
    }

    // Validate passengers
    const allowedGenders = ['Male', 'Female', 'Other'];
    for (const p of passengers) {
      if (!p || typeof p !== 'object') {
        return res.status(400).json({ message: 'Invalid passenger format' });
      }
      if (!p.name || typeof p.name !== 'string' || !p.name.trim()) {
        return res.status(400).json({ message: 'Each passenger must have a valid name' });
      }
      const age = Number(p.age);
      if (!Number.isInteger(age) || age <= 0 || age > 120) {
        return res.status(400).json({ message: 'Each passenger must have a valid age' });
      }
      if (!allowedGenders.includes(p.gender)) {
        return res.status(400).json({ message: 'Each passenger must have a valid gender' });
      }
    }

    // Check seat availability
    const existingBookings = await Booking.find({
      trainId,
      travelDate: {
        $gte: new Date(travelDate),
        $lt: new Date(new Date(travelDate).getTime() + 24 * 60 * 60 * 1000)
      },
      class: travelClass
    });

    const bookedSeats = existingBookings.reduce((total, booking) => 
      total + booking.passengers.length, 0
    );

    const availableSeats = train.classes[travelClass].totalSeats - bookedSeats;

    if (passengers.length > availableSeats) {
      return res.status(400).json({ 
        message: `Only ${availableSeats} seats available in ${travelClass} class` 
      });
    }

    // Calculate total fare
    // Validate fare configuration
    const farePerPassenger = train.classes[travelClass].fare;
    if (typeof farePerPassenger !== 'number' || Number.isNaN(farePerPassenger)) {
      return res.status(500).json({ message: `Fare not configured for class ${travelClass}` });
    }
    const totalFare = farePerPassenger * passengers.length;

  
    const PNR = Math.floor(1000000000 + Math.random() * 9000000000)


    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      trainId,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      travelDate,
      class: travelClass,
      passengers,
      PNR,
      totalFare,
      status: 'Confirmed'
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        PNR: booking.PNR,


        trainNumber: booking.trainNumber,
        trainName: booking.trainName,
        source: booking.source,
        destination: booking.destination,
        travelDate: booking.travelDate,
        class: booking.class,
        passengers: booking.passengers,
        totalFare: booking.totalFare,
        status: booking.status
      }
    });
  } catch (error) {
    console.error(error.stack || error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by PNR
const getBookingByPNR = async (req, res) => {
  try {
    const { pnr } = req.params;
    
    const booking = await Booking.findOne({ PNR: pnr })
      .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { pnr } = req.params;
    
    const booking = await Booking.findOne({ PNR: pnr });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getUserBookings, getBookingByPNR, cancelBooking };