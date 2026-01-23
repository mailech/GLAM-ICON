const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit (adjust as needed particularly for video)
});

// Upload fields
const cpUpload = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

router.post('/', cpUpload, (req, res) => {
    try {
        // Construct URLs
        const files = req.files;
        const urls = {};

        if (files.profilePhoto) {
            urls.profilePhoto = `/uploads/${files.profilePhoto[0].filename}`;
        }
        if (files.birthCertificate) {
            urls.birthCertificate = `/uploads/${files.birthCertificate[0].filename}`;
        }
        if (files.video) {
            urls.video = `/uploads/${files.video[0].filename}`;
        }

        res.status(200).json({
            status: 'success',
            data: urls
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

module.exports = router;
