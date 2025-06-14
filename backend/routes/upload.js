const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload, handleFileUpload } = require('../services/fileUpload');

// Upload profile photo
router.post('/profile-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const urls = await handleFileUpload(req.file);
    res.json(urls);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

module.exports = router; 