const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events';

mongoose
    .connect(DB)
    .then(async () => {
        console.log('DB connection successful!');
        const eventCount = await Event.countDocuments();
        console.log(`Event count: ${eventCount}`);

        const userCount = await User.countDocuments();
        console.log(`User count: ${userCount}`);

        if (eventCount === 0) {
            console.log('No events found. You should run the import script.');
        } else {
            const events = await Event.find().limit(1);
            console.log('Sample Event:', events[0]);
        }
        process.exit();
    })
    .catch((err) => {
        console.log('DB Connection failed', err);
        process.exit();
    });
