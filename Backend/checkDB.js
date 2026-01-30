const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('./models/Ticket');

dotenv.config({ path: './.env' });

const DB = process.env.MONGODB_URI;

mongoose.connect(DB).then(async () => {
    console.log('DB Connection successful');

    try {
        const count = await Ticket.countDocuments();
        console.log(`Total Tickets in DB: ${count}`);

        const tickets = await Ticket.find().limit(5);
        console.log('Sample Tickets:', tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err);
    } finally {
        process.exit();
    }
});
