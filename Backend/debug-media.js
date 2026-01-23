const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events')
    .then(async () => {
        require('./models/User');
        require('./models/Event');
        const Ticket = require('./models/Ticket');

        const tickets = await Ticket.find({});

        console.log('--- DB ENTRIES ---');
        tickets.forEach(t => {
            if (t.registrationData) {
                console.log('Photo:', t.registrationData.profilePhoto);
                console.log('Video:', t.registrationData.video);
            }
        });

        console.log('\n--- FILES ON DISK ---');
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (fs.existsSync(uploadDir)) {
            fs.readdirSync(uploadDir).forEach(f => console.log(f));
        }

        process.exit();
    })
    .catch(err => { console.error(err); process.exit(1); });
