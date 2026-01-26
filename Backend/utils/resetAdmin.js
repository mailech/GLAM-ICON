const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Adjust path to model if needed. 
// Since we are in backend/utils, ../models/User is backend/models/User
const User = require('../models/User');

dotenv.config();

// Use the same connection logic as server.js
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events';

console.log("Connecting to:", DB);

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful! Admin reset script connected.'))
    .catch((err) => {
        console.error('DB Connection Failed:', err);
        process.exit(1);
    });

const resetAdmin = async () => {
    try {
        const email = 'admin@test.com';
        const password = 'password123';

        // 1. Find user
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} found. Updating password...`);
            user.password = password;
            user.passwordConfirm = password; // Just to be safe validation-wise
            // Trigger save to hash password
            await user.save();
            console.log('Password updated successfully!');
        } else {
            console.log(`User ${email} not found. Creating new admin user...`);
            user = await User.create({
                name: 'System Admin',
                email: email,
                password: password,
                passwordConfirm: password,
                role: 'admin'
            });
            console.log('Admin user created successfully!');
        }

        console.log(`\nCredentials verified:\nEmail: ${email}\nPassword: ${password}`);

    } catch (err) {
        console.error('Admin reset failed:', err);
    } finally {
        process.exit();
    }
};

resetAdmin();
