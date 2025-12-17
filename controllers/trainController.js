const Train = require('../models/Train');
const Booking = require('../models/Booking');

// Add new train (Admin only)
const addTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json({ message: 'Train added successfully', train });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search trains
const searchTrains = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    
    if (!source || !destination || !date) {
      return res.status(400).json({ message: 'Source, destination, and date are required' });
    }

    const searchDate = new Date(date);
    const dayName = searchDate.toLocaleDateString('en-US', { weekday: 'long' });

    const trains = await Train.find({
      $or: [
        { source: { $regex: source, $options: 'i' } },
        { 'stations.stationName': { $regex: source, $options: 'i' } },
        { 'stations.stationCode': { $regex: source, $options: 'i' } }
      ],
      $and: [
        {
          $or: [
            { destination: { $regex: destination, $options: 'i' } },
            { 'stations.stationName': { $regex: destination, $options: 'i' } },
            { 'stations.stationCode': { $regex: destination, $options: 'i' } }
          ]
        }
      ],
      runningDays: dayName
    });

    // Calculate available seats for each train
    const trainsWithAvailability = await Promise.all(
      trains.map(async (train) => {
        const bookings = await Booking.find({
          trainId: train._id,
          travelDate: {
            $gte: new Date(date),
            $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        });

        const availability = {};
        Object.keys(train.classes).forEach(className => {
          const bookedSeats = bookings
            .filter(booking => booking.class === className)
            .reduce((total, booking) => total + booking.passengers.length, 0);
          
          availability[className] = {
            totalSeats: train.classes[className].totalSeats,
            availableSeats: train.classes[className].totalSeats - bookedSeats,
            fare: train.classes[className].fare
          };
        });

        return {
          ...train.toObject(),
          availability
        };
      })
    );

    res.json({ trains: trainsWithAvailability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all trains (Admin)
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json({ trains });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get train by ID
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json({ train });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addTrain, searchTrains, getAllTrains, getTrainById };