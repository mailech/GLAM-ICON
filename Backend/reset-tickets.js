const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Delete all tickets
        await Ticket.deleteMany({});
        console.log('All tickets deleted successfully.');

        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
