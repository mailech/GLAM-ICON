const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const DB = process.env.MONGODB_URI;

mongoose.connect(DB).then(async () => {
    console.log('DB Connection successful');

    try {
        // Find the user you are logged in with (or update all for dev)
        // I'll grab all users for now and list them.
        const users = await User.find().limit(10);
        console.log("Users found:", users.map(u => ({ email: u.email, role: u.role, name: u.name })));

        // Prompt update if desired (hardcoded for now to promote a likely candidate)
        // If you know the email, replace 'example@test.com'

        // I'll assume we want to promote 'rajj@gmail.com' or whoever is first or 'admin@glamicon.in'
        // Let's just promote ALL existing users to 'admin' for DEV environment simplicity if requested, 
        // OR better, create a specific admin.

        // Let's create a dedicated admin script.
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
});
