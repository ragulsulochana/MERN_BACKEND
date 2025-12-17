const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true
  },
  trainName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  stations: [{
    stationCode: String,
    stationName: String,
    arrivalTime: String,
    departureTime: String,
    distance: Number
  }],
  classes: {
    SL: {
      totalSeats: { type: Number, default: 72 },
      fare: { type: Number }
    },
    '3A': {
      totalSeats: { type: Number, default: 64 },
      fare: { type: Number }
    },
    '2A': {
      totalSeats: { type: Number, default: 48 },
      fare: { type: Number }
    },
    '1A': {
      totalSeats: { type: Number, default: 24 },
      fare: { type: Number }
    },
    CC: {
      totalSeats: { type: Number, default: 78 },
      fare: { type: Number }
    }
  },
  runningDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  duration: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Train', trainSchema);