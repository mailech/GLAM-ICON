const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect first
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Register models in order
        require('./models/User');
        require('./models/Event');
        const Ticket = require('./models/Ticket');
        const User = require('./models/User');

        // Check Tickets
        const ticketCount = await Ticket.countDocuments();
        const tickets = await Ticket.find({});
        console.log(`Total Tickets: ${ticketCount}`);

        // Check Users
        const users = await User.find({}, 'name email role');
        console.log('\nUsers:');
        users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}`));

        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
