const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const { auth } = require('../middleware/auth');

// Get all analytics data
router.get('/', auth, async (req, res) => {
  try {
    // Get student and alumni counts
    const studentCount = await Student.countDocuments();
    const alumniCount = await Alumni.countDocuments();

    // Get student year-wise distribution
    const studentYearWise = await Student.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { year: 1 }
      }
    ]);

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
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router; 