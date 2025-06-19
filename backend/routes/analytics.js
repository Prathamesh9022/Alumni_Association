const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');

// Get all analytics data (public access)
router.get('/', async (req, res) => {
  try {
    // Get student and alumni counts
    const studentCount = await Student.countDocuments();
    const alumniCount = await Alumni.countDocuments();

    // Get student year-wise distribution
    const yearMap = {
      "1st Year": 1,
      "2nd Year": 2,
      "3rd Year": 3,
      "4th Year": 4
    };

    const studentYearWiseRaw = await Student.aggregate([
      {
        $group: {
          _id: '$current_year',
          count: { $sum: 1 }
        }
      }
    ]);

    // Ensure all years are present, even if count is 0
    const allYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    const studentYearWise = allYears.map(label => {
      const found = studentYearWiseRaw.find(y => y._id === label);
      return {
        year: yearMap[label],
        count: found ? found.count : 0
      };
    });

    // Get alumni batch-wise distribution
    const alumniBatchWise = await Alumni.aggregate([
      {
        $group: {
          _id: '$passing_year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          batch: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { batch: 1 }
      }
    ]);

    // Get alumni company-wise distribution
    const alumniCompanyWise = await Alumni.aggregate([
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get alumni skills distribution
    const alumniSkillWise = await Alumni.aggregate([
      {
        $unwind: '$skills'
      },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      studentAlumniCount: {
        students: studentCount,
        alumni: alumniCount
      },
      studentYearWise,
      alumniBatchWise,
      alumniCompanyWise,
      alumniSkillWise
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data', details: error.message });
  }
});

module.exports = router; 