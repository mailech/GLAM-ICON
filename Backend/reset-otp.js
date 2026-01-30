const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        const email = 'subhashrajkowluri@gmail.com';
        // We need to verify which user has this email.
        const user = await User.findOne({ email }).select('+otp');

        if (user) {
            console.log('--------------------------------------------------');
            console.log(`User Found: ${user.email}`);
            console.log(`OTP HASH: ${user.otp}`);
            // Wait, the OTP is stored as a HASH in the DB, not plain text!
            // const hash = crypto.createHash('sha256').update(otp).digest('hex');
            // I cannot reverse the hash.

            // I must OVERWRITE it with a known hash.
            // Let's set it to valid OTP '123456'
            const crypto = require('crypto');
            const newOtp = '123456';
            const hash = crypto.createHash('sha256').update(newOtp).digest('hex');

            user.otp = hash;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            await user.save({ validateBeforeSave: false });

            console.log(`UPDATED OTP TO: ${newOtp}`);
            console.log('--------------------------------------------------');
        } else {
            console.log('User not found!');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

connectDB();
