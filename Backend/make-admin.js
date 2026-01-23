const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Register models
        const User = require('./models/User');

        // Update emails to admin
        const emailsToPromote = ['subhashraj@gmail.com', 'subha11.11raj@gmail.com'];

        const res = await User.updateMany(
            { email: { $in: emailsToPromote } },
            { role: 'admin' }
        );

        console.log(`Updated ${res.modifiedCount} users to admin role.`);

        // Verify
        const admins = await User.find({ role: 'admin' }, 'name email role');
        console.log('\nCurrent Admins:');
        admins.forEach(u => console.log(`${u.name} (${u.email})`));

        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
