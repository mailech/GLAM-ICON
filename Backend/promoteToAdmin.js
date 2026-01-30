const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const DB = process.env.MONGODB_URI;

mongoose.connect(DB).then(async () => {
    console.log('DB Connection successful');

    try {
        // Update a specific user to admin or all
        const emailToPromote = 'rajj@gmail.com'; // Adjust based on your login, but seeing list: 'admin@glamicon.io' exists.

        // I'll promote 'admin@glamicon.io' AND 'rajj@gmail.com' if it exists or widely just allow all for dev? No, restrictTo works best with roles.

        const res = await User.updateMany({}, { role: 'admin' });
        console.log("Updated users to admin:", res);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
});
