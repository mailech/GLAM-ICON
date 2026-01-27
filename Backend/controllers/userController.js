const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users',
        format: async (req, file) => 'jpeg', // supports promises as well
        public_id: (req, file) => {
            const userId = req.user ? req.user.id : `new-${Date.now()}`;
            return `user-${userId}-${Date.now()}`;
        },
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

const upload = multer({ storage: storage });

exports.uploadUserPhoto = upload.single('photo');

// Resizing is handled by Cloudinary, so this middleware is just a pass-through or sets filename correctly
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = req.file.path.split('/').pop(); // Cloudinary returns full URL in path, or filename. 
    // Actually multer-storage-cloudinary sets req.file.filename to the public_id usually. 
    // But our User model expects a filename to be stored? 
    // Use req.file.filename which usually holds the public_id. 
    // Let's ensure consistency. If `req.file.filename` is set by the storage engine, we are good.
    next();
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Parse socialLinks if it's a JSON string (from FormData)
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
        try {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        } catch (e) {
            console.error("Error parsing socialLinks:", e);
        }
    }

    // 3) Filter out unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'bio', 'phone', 'gender', 'socialLinks', 'dob');

    // Store FULL Cloudinary URL so frontend can just use it directly
    if (req.file) filteredBody.photo = req.file.path;

    // Calculate Age if DOB is present
    if (filteredBody.dob) {
        const birthDate = new Date(filteredBody.dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        filteredBody.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});
