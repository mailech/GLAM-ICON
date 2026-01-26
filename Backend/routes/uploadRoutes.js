const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudStorage');

// Upload fields
const cpUpload = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

router.post('/', cpUpload, (req, res) => {
    try {
        // Construct URLs from Cloudinary response
        // Cloudinary puts the url in `file.path` or `file.secure_url`
        const files = req.files;
        const urls = {};

        if (files.profilePhoto) {
            urls.profilePhoto = files.profilePhoto[0].path; // Cloudinary URL
        }
        if (files.birthCertificate) {
            urls.birthCertificate = files.birthCertificate[0].path;
        }
        if (files.video) {
            urls.video = files.video[0].path;
        }

        res.status(200).json({
            status: 'success',
            data: urls
        });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

module.exports = router;
