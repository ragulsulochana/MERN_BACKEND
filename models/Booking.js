const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  trainNumber: {
    type: String,
    required: true
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
  travelDate: {
    type: Date,
    required: true
  },
  class: {
    type: String,
    enum: ['SL', '3A', '2A', '1A', 'CC'],
    required: true
  },
  passengers: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    seatNumber: String
  }],
  PNR: {
    type: String,
    unique: true,
    required: true
  },
  totalFare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Waiting', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Generate PNR before saving
bookingSchema.pre('save', function(next) {
  if (!this.PNR) {
    this.PNR = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);