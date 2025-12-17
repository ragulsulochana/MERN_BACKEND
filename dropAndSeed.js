const mongoose = require('mongoose');
require('dotenv').config();

const dropAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Drop the entire database
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    // Now run the seed script
    require('./seedData.js');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropAndSeed();