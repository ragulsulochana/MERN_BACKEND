const mongoose = require('mongoose');
require('dotenv').config();

const Train = require('./models/Train');
const User = require('./models/User');
const Booking = require('./models/Booking');

// Sample Indian trains data
const sampleTrains = [
  {
    trainNumber: "12627",
    trainName: "Karnataka Express",
    source: "NDLS",
    destination: "SBC",
    stations: [
      { stationCode: "NDLS", stationName: "New Delhi", arrivalTime: "00:00", departureTime: "22:20", distance: 0 },
      { stationCode: "AGC", stationName: "Agra Cantt", arrivalTime: "01:50", departureTime: "01:55", distance: 188 },
      { stationCode: "JHS", stationName: "Jhansi Jn", arrivalTime: "04:18", departureTime: "04:28", distance: 415 },
      { stationCode: "BPL", stationName: "Bhopal Jn", arrivalTime: "08:00", departureTime: "08:10", distance: 707 },
      { stationCode: "SBC", stationName: "Bangalore City", arrivalTime: "06:00", departureTime: "00:00", distance: 2444 }
    ],
    classes: {
      SL: { totalSeats: 72, fare: 485 },
      "3A": { totalSeats: 64, fare: 1280 },
      "2A": { totalSeats: 48, fare: 1915 },
      "1A": { totalSeats: 24, fare: 3200 }
    },
    runningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    duration: "31h 40m"
  },
  {
    trainNumber: "16235",
    trainName: "Mysore Express",
    source: "MAS",
    destination: "KRR",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "00:00", departureTime: "22:00", distance: 0 },
      { stationCode: "SA", stationName: "Salem Jn", arrivalTime: "02:30", departureTime: "02:35", distance: 340 },
      { stationCode: "ED", stationName: "Erode Jn", arrivalTime: "03:45", departureTime: "03:50", distance: 400 },
      { stationCode: "KRR", stationName: "Karur", arrivalTime: "05:00", departureTime: "00:00", distance: 450 }
    ],
    classes: {
      SL: { totalSeats: 72, fare: 180 },
      "3A": { totalSeats: 64, fare: 485 },
      "2A": { totalSeats: 48, fare: 720 }
    },
    runningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    duration: "7h 00m"
  },
  {
    trainNumber: "12679",
    trainName: "Coimbatore Express",
    source: "MAS",
    destination: "CBE",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "00:00", departureTime: "06:30", distance: 0 },
      { stationCode: "KRR", stationName: "Karur", arrivalTime: "12:45", departureTime: "12:50", distance: 450 },
      { stationCode: "CBE", stationName: "Coimbatore Jn", arrivalTime: "14:30", departureTime: "00:00", distance: 497 }
    ],
    classes: {
      SL: { totalSeats: 72, fare: 200 },
      "3A": { totalSeats: 64, fare: 520 },
      "2A": { totalSeats: 48, fare: 780 },
      "1A": { totalSeats: 24, fare: 1300 }
    },
    runningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    duration: "8h 00m"
  },
  {
    trainNumber: "12841",
    trainName: "Coromandel Express",
    source: "HWH",
    destination: "MAS",
    stations: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "00:00", departureTime: "14:45", distance: 0 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "20:00", departureTime: "20:05", distance: 441 },
      { stationCode: "BZA", stationName: "Vijayawada Jn", arrivalTime: "03:40", departureTime: "03:50", distance: 901 },
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "08:45", departureTime: "00:00", distance: 1662 }
    ],
    classes: {
      SL: { totalSeats: 72, fare: 420 },
      "3A": { totalSeats: 64, fare: 1105 },
      "2A": { totalSeats: 48, fare: 1650 },
      "1A": { totalSeats: 24, fare: 2765 }
    },
    runningDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    duration: "18h 00m"
  }
];

// Sample users
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@trainbooking.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    role: "user"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Train.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample trains
    const insertedTrains = await Train.insertMany(sampleTrains);
    console.log('Sample trains inserted');

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log('Sample users created');

    // Create sample bookings with manual PNR
    const sampleBookings = [
      {
        userId: insertedUsers[1]._id,
        trainId: insertedTrains[1]._id,
        trainNumber: "16235",
        trainName: "Mysore Express",
        source: "MAS",
        destination: "KRR",
        travelDate: new Date('2025-01-15'),
        class: "SL",
        passengers: [
          { name: "Rajesh Kumar", age: 35, gender: "Male", seatNumber: "S1-25" },
          { name: "Sunita Kumar", age: 32, gender: "Female", seatNumber: "S1-26" }
        ],
        PNR: "1234567890",
        totalFare: 360,
        status: "Confirmed",
        paymentStatus: "Completed"
      },
      {
        userId: insertedUsers[2]._id,
        trainId: insertedTrains[2]._id,
        trainNumber: "12679",
        trainName: "Coimbatore Express",
        source: "MAS",
        destination: "CBE",
        travelDate: new Date('2025-01-20'),
        class: "3A",
        passengers: [
          { name: "Priya Sharma", age: 28, gender: "Female", seatNumber: "A1-15" }
        ],
        PNR: "9876543210",
        totalFare: 520,
        status: "Confirmed",
        paymentStatus: "Completed"
      }
    ];

    await Booking.insertMany(sampleBookings);
    console.log('Sample bookings created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@trainbooking.com / admin123');
    console.log('User 1: rajesh@example.com / password123');
    console.log('User 2: priya@example.com / password123');
    console.log('\n🚂 Available Routes:');
    console.log('- NDLS → SBC (Karnataka Express)');
    console.log('- MAS → KRR (Mysore Express)');
    console.log('- MAS → CBE (Coimbatore Express)');
    console.log('- HWH → MAS (Coromandel Express)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();