const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const { createReadStream } = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Function to upload file to GitHub
async function uploadToGitHub(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, { encoding: 'base64' });
    
    // Create or update file in GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `uploads/${fileName}`,
      message: `Upload profile photo: ${fileName}`,
      content: content,
      branch: GITHUB_BRANCH
    });

    // Return the GitHub raw URL for the file
    return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/uploads/${fileName}`;
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    throw error;
  }
}

// Function to handle file upload and return both local and GitHub URLs
async function handleFileUpload(file) {
  try {
    // Get the local file path
    const localFilePath = file.path;
    const fileName = file.filename;

    // Upload to GitHub
    const githubUrl = await uploadToGitHub(localFilePath, fileName);

    // Return both URLs
    return {
      localUrl: `/uploads/${fileName}`,
      githubUrl: githubUrl
    };
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
}

module.exports = {
  upload,
  handleFileUpload
}; 