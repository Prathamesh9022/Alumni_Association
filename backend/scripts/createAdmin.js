const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminData = {
      username: 'admin',
      email: 'prathameshbembre@gmail.com',
      password: '123456',
      profile: ''
    };

    // Check if admin exists
    let admin = await Admin.findOne({ email: adminData.email });
    
    if (admin) {
      console.log('Admin already exists, updating password...');
      admin.password = adminData.password;
      await admin.save();
      console.log('Admin password updated successfully');
    } else {
      console.log('Creating new admin...');
      admin = new Admin(adminData);
      await admin.save();
      console.log('Admin created successfully');
    }

    console.log('Admin credentials:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin(); 