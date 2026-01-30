const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    // required: [true, 'Ticket must belong to an event'] // Made optional for Membership tickets
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Ticket must belong to a user']
  },
  price: {
    type: Number,
    required: [true, 'Ticket must have a price']
  },
  purchaseDate: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'used'],
    default: 'confirmed'
  },
  qrCode: {
    type: String,
    required: true
  },
  checkInTime: Date,
  checkInLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  // Registration Details
  registrationData: {
    profilePhoto: String,
    birthCertificate: String,
    video: String,
    age: Number,
    height: String,
    weight: String,
    bust: String,
    waist: String,
    hips: String,
    shoeSize: String,
    description: String,
    measurements: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    parentsName: String,
    parentsNumber: String,
    gender: String,
    state: String,
    city: String,
    pincode: String,
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentAmount: Number,
    socialLinks: {
      instagram: String,
      twitter: String,
      portfolio: String
    }
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'completed'],
    default: 'pending'
  },
  adminFeedback: String
});

// Indexes for better query performance
ticketSchema.index({ ticketNumber: 1 });
// ticketSchema.index({ event: 1, user: 1 }, { unique: true });

// Document middleware to generate ticket number before saving
ticketSchema.pre('save', async function (next) {
  if (!this.isNew || this.ticketNumber) return next();

  // Generate a unique ticket number (e.g., TKT-2023-0001) for regular tickets
  const count = await this.constructor.countDocuments();
  this.ticketNumber = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  next();
});

// Query middleware to only find active tickets
ticketSchema.pre(/^find/, function (next) {
  // this.find({ isActive: { $ne: false } });
  next();
});

// Populate event and user data when querying
ticketSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'event',
    select: 'title startDate endDate location'
  }).populate({
    path: 'user',
    select: 'name email'
  });

  next();
});

// Static method to check ticket availability
ticketSchema.statics.checkAvailability = async function (eventId) {
  const event = await this.model('Event').findById(eventId);
  if (!event) throw new Error('Event not found');

  const ticketCount = await this.countDocuments({ event: eventId, status: { $ne: 'cancelled' } });

  return {
    available: ticketCount < event.capacity,
    remaining: Math.max(0, event.capacity - ticketCount)
  };
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
