const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure dynamic storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    // Determine the upload directory based on the request type
    if (req.uploadType === 'restaurant') {
      uploadPath = '/uploads/restaurantImages';
    } else if (req.uploadType === 'menu') {
      uploadPath = '/uploads/menuImages';
    } else if (req.uploadType === 'menuItemImage'){
      uploadPath = '/uploads/menuItemImages';
    }
    else {
      uploadPath = 'src/uploads/profileImages';
    } 

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${req.uploadType}-${uniqueSuffix}${extension}`);
  },
});

// Configure Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Middleware to set the upload type
const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};

module.exports = {
  upload,
  setUploadType,
};
