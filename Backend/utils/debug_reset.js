console.log("Starting test...");
try {
    const mongoose = require('mongoose');
    console.log("Mongoose loaded.");
    const User = require('../models/User');
    console.log("User model loaded.");
} catch (e) {
    console.error("Error loading modules:", e);
}
