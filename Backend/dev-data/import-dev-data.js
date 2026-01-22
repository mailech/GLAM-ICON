const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config({ path: './.env' }); // Load env variables from current directory

const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/glamicon-events';

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.log('DB Connection failed', err));

// Example Data
const events = [
    {
        title: 'Mumbai Fashion Week 2026',
        description: 'The premier fashion event in Mumbai showcasing the latest collections from top Indian designers. Experience glamour like never before.',
        category: 'music', // using 'music' just to pass enum validator for now even if it's fashion
        startDate: new Date('2026-03-15T18:00:00'),
        endDate: new Date('2026-03-15T23:00:00'),
        location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760],
            address: 'Jio World Centre, Mumbai',
            description: 'Main Ballroom'
        },
        price: 5000,
        capacity: 200,
        imageCover: 'https://images.unsplash.com/photo-1576403233400-985429acb76d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        images: [
            'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80',
            'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'
        ],
        organizer: '5c8a1d5b0190b214360dc001' // Placeholder ID, will be replaced or script needs valid user ID
    },
    {
        title: 'Elite Model Hunt Finals',
        description: 'Witness the crowning of the next face of Indian fashion. A night of high stakes, beauty, and intense competition.',
        category: 'competition',
        startDate: new Date('2026-04-20T19:00:00'),
        endDate: new Date('2026-04-20T22:00:00'),
        location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139],
            address: 'Taj Palace, New Delhi',
            description: 'Grand Hall'
        },
        price: 2500,
        capacity: 150,
        imageCover: 'https://images.unsplash.com/photo-1509631180846-36e3471803f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80',
        images: [
            'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        organizer: '5c8a1d5b0190b214360dc001'
    },
    {
        title: 'Abstract Art & Couture Gala',
        description: 'A fusion of modern art and haute couture. Semi-formal attire required. Includes dinner and cocktail hour.',
        category: 'exhibition',
        startDate: new Date('2026-05-10T20:00:00'),
        endDate: new Date('2026-05-10T23:59:00'),
        location: {
            type: 'Point',
            coordinates: [77.5946, 12.9716],
            address: 'UB City, Bangalore',
            description: 'Rooftop Lounge'
        },
        price: 7500,
        capacity: 100,
        imageCover: 'https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        images: [],
        organizer: '5c8a1d5b0190b214360dc001'
    },
    {
        title: 'Sustainable Luxury Summit',
        description: 'Discussing the future of eco-friendly luxury fashion. Keynote speakers from top global brands.',
        category: 'conference',
        startDate: new Date('2026-06-05T10:00:00'),
        endDate: new Date('2026-06-05T17:00:00'),
        location: {
            type: 'Point',
            coordinates: [78.4867, 17.3850],
            address: 'HICC, Hyderabad',
            description: 'Conference Room A'
        },
        price: 1500,
        capacity: 300,
        imageCover: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1225&q=80',
        images: [],
        organizer: '5c8a1d5b0190b214360dc001'
    }
];

const importData = async () => {
    try {
        // NOTE: We need a valid organizer ID. We will find the first admin user or just the first user.
        const User = require('../models/User');
        const admin = await User.findOne(); // Just get any user to be the organizer

        if (admin) {
            events.forEach(ev => {
                ev.organizer = admin._id;
                // map category to enum
                if (ev.category === 'competition') ev.category = 'other';
            });
        } else {
            console.log('No user found to assign as organizer. Create a user first!');
            process.exit();
        }

        await Event.create(events);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Event.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
