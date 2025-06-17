const mongoose = require('mongoose');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_association';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Student.deleteMany({});
    await Alumni.deleteMany({});
    console.log('Cleared existing data');

    // Create test students
    const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Sara', 'David', 'Anna', 'Mike', 'Linda', 'Tom', 'Nina', 'Sam', 'Olivia', 'Max', 'Sophia', 'Leo', 'Emma', 'Ben', 'Ava'];
    const middleNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
    const students = Array.from({ length: 20 }).map((_, i) => {
      const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
      const genderOptions = ['Male', 'Female', 'Other'];
      const expType = i % 2 === 0 ? 'Internship' : 'Work Experience';
      return {
        email: `student${i + 1}@mgmcen.ac.in`,
        password: 'password123',
        profile: '',
        department: 'Information Technology',
        course: 'B. Tech. Information Technology',
        first_name: firstNames[i % firstNames.length],
        middle_name: middleNames[i % middleNames.length],
        last_name: lastNames[i % lastNames.length],
        dob: new Date(2002, i % 12, (i % 28) + 1),
        gender: genderOptions[i % 3],
        current_year: yearOptions[i % 4],
        phone: `9${String(100000000 + i).slice(0, 9)}`,
        alt_phone: `8${String(100000000 + i).slice(0, 9)}`,
        student_id: `S${String(1000000000 + i)}`,
        current_address: `${i + 1} Student Lane`,
        permanent_address: `${i + 1} Student Lane`,
        experience: [{
          type: expType,
          company: `Company${i + 1}`,
          position: `Position${i + 1}`,
          years: i % 4,
          months: (i % 12) + 1,
          description: `Worked as ${expType} at Company${i + 1}`
        }],
        skillset: [`Skill${i + 1}A`, `Skill${i + 1}B`],
        projects: [{
          title: `Project${i + 1}`,
          description: `Description for Project${i + 1}`,
          technologies: `Tech${i + 1}`,
          years: 1,
          months: (i % 12) + 1,
          link: `https://project${i + 1}.com`
        }],
        achievements: [{
          type: ['sports', 'awards', 'academic', 'events'][i % 4],
          title: `Achievement${i + 1}`,
          description: `Description for Achievement${i + 1}`,
          date: new Date(2020, i % 12, (i % 28) + 1),
          organization: `Org${i + 1}`
        }],
        education: [
          {
            type: '10th',
            institution: `School${i + 1}`,
            board: 'CBSE',
            year: 2018,
            grade: 'A',
            percentage: 85 + (i % 10)
          },
          {
            type: '12th',
            institution: `College${i + 1}`,
            board: 'State',
            year: 2020,
            grade: 'A',
            percentage: 80 + (i % 10)
          }
        ],
        mentorship_status: 'Available',
        profileCompleted: true
      };
    });

    // Create test alumni
    const alumni = Array.from({ length: 20 }).map((_, i) => {
      const genderOptions = ['Male', 'Female', 'Other'];
      const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Sara', 'David', 'Anna', 'Mike', 'Linda', 'Tom', 'Nina', 'Sam', 'Olivia', 'Max', 'Sophia', 'Leo', 'Emma', 'Ben', 'Ava'];
      const middleNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
      return {
        email: `alumni${i + 1}@alumni.com`,
        password: 'password123',
        profile: '',
        first_name: firstNames[i % firstNames.length],
        middle_name: middleNames[i % middleNames.length],
        last_name: lastNames[i % lastNames.length],
        dob: new Date(1990 + (i % 10), i % 12, (i % 28) + 1),
        gender: genderOptions[i % 3],
        phone: `7${String(100000000 + i).slice(0, 9)}`,
        alt_phone: `6${String(100000000 + i).slice(0, 9)}`,
        current_address: `${i + 1} Alumni Lane`,
        permanent_address: `${i + 1} Alumni Lane`,
        department: 'Information Technology',
        course: 'B. Tech. Information Technology',
        passing_year: 2010 + (i % 10),
        current_company: `Company${i + 1}`,
        designation: `Designation${i + 1}`,
        current_location: `City${i + 1}`,
        joined_date: new Date(2010 + (i % 10), (i % 12), (i % 28) + 1),
        experience: [{
          company: `Company${i + 1}`,
          position: `Position${i + 1}`,
          years: 2 + (i % 5),
          months: (i % 12) + 1,
          description: `Worked as Position${i + 1} at Company${i + 1}`
        }],
        skillset: [`Skill${i + 1}A`, `Skill${i + 1}B`],
        projects: [{
          title: `Project${i + 1}`,
          description: `Description for Project${i + 1}`,
          technologies: `Tech${i + 1}`,
          duration: (i % 12) + 1,
          link: `https://alumniproject${i + 1}.com`
        }],
        achievements: [{
          type: ['sports', 'awards', 'academic', 'events'][i % 4],
          title: `Achievement${i + 1}`,
          description: `Description for Achievement${i + 1}`,
          date: new Date(2015 + (i % 10), i % 12, (i % 28) + 1),
          organization: `Org${i + 1}`
        }],
        profileCompleted: true
      };
    });

    // Insert data
    await Student.insertMany(students);
    await Alumni.insertMany(alumni);
    console.log('Test data inserted successfully');

    // Seed admin user
    const adminData = {
      username: 'admin',
      email: 'admin@alumni.com',
      password: '123456',
      profile: ''
    };
    // Remove existing admin with same email or username
    await Admin.deleteMany({ $or: [ { email: adminData.email }, { username: adminData.username } ] });
    await Admin.create(adminData);
    console.log('Admin user seeded: admin@alumni.com / 123456');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 