const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine resource type (image vs video)
        let resource_type = 'auto';
        let folder = 'glam-icon-india';
        let format = undefined; // let cloudinary decide or keep original

        if (file.mimetype.startsWith('video')) {
            resource_type = 'video';
            folder = 'glam-icon-india/videos';
        } else {
            folder = 'glam-icon-india/images';
            format = 'jpg'; // normalize images to jpg for consistency if desired
        }

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: `${file.fieldname}-${Date.now()}`,
            format: format,
        };
    },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
