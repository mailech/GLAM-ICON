const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Event = require('../models/Event');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
        console.error('DB Connection Failed:', err);
        process.exit(1);
    });

const seed = async () => {
    try {
        // 1. Get or Create User
        let user = await User.findOne();
        if (!user) {
            console.log("Creating dummy user...");
            user = await User.create({
                name: 'Test Administrator',
                email: 'admin@test.com',
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'admin'
            });
        }

        // 2. Get or Create Event
        let event = await Event.findOne();
        if (!event) {
            console.log("Creating dummy event...");
            event = await Event.create({
                title: 'Miss India 2026',
                description: 'The biggest pageant of the year',
                category: 'other',
                startDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
                endDate: new Date(Date.now() + 86400000 * 31),
                price: 5000,
                capacity: 100,
                imageCover: 'https://images.unsplash.com/photo-1548123378-bde4eca81d2d',
                organizer: user._id,
                location: {
                    address: 'Mumbai, India',
                    coordinates: [72.8777, 19.0760]
                }
            });
        }

        // 3. Create Dummy Ticket
        console.log("Creating dummy ticket...");
        const ticket = await Ticket.create({
            ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            event: event._id,
            user: user._id,
            price: event.price,
            status: 'confirmed',
            qrCode: 'dummy-qr-data',
            applicationStatus: 'pending',
            registrationData: {
                name: 'Candidate One',
                age: 24,
                phone: '9876543210',
                email: 'candidate@example.com',
                height: '5ft 9in',
                profilePhoto: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d', // Use a real URL for preview
                video: '',
                birthCertificate: ''
            }
        });

        console.log('Dummy ticket created successfully!');
        console.log(ticket);

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit();
    }
};

seed();
