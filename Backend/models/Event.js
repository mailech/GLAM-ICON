const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An event must have a title'],
    trim: true,
    maxlength: [100, 'Event title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: {
      values: ['music', 'sports', 'conference', 'workshop', 'exhibition', 'other'],
      message: 'Category is either: music, sports, conference, workshop, exhibition, or other'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be a positive number']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide event capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  availableTickets: {
    type: Number,
    default: function() {
      return this.capacity;
    }
  },
  imageCover: {
    type: String,
    default: 'default.jpg'
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must belong to an organizer']
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ price: 1, ratingsAverage: -1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ location: '2dsphere' });

// Virtual populate
eventSchema.virtual('tickets', {
  ref: 'Ticket',
  foreignField: 'event',
  localField: '_id'
});

// Query middleware to only find active events
eventSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Calculate available tickets before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('capacity')) {
    this.availableTickets = this.capacity - (this.capacity - this.availableTickets);
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
