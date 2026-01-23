const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// Helper function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadEventImages = factory.upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeEventImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `event-${req.params.id}-${Date.now()}-cover.jpeg`;
    await factory.processImage(
      req.files.imageCover[0].buffer,
      `public/img/events/${req.body.imageCover}`,
      2000,
      1333
    );
  }

  // 2) Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `event-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await factory.processImage(
          file.buffer,
          `public/img/events/${filename}`,
          2000,
          1333
        );
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on event (hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // EXECUTE QUERY
  const features = new APIFeatures(Event.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: events.length,
    data: {
      events
    }
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('reviews');

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.organizer) req.body.organizer = req.user.id;

  const newEvent = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent
    }
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getEventStats = catchAsync(async (req, res, next) => {
  const stats = await Event.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numEvents: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Event.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numEventStarts: { $sum: 1 },
        events: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numEventStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

exports.getEventsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const events = await Event.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: {
      data: events
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Event.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.bookEvent = catchAsync(async (req, res, next) => {
  // 1) Get event and check if it exists and is active
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  // 2) Check if event has available tickets
  const availableTickets = await Ticket.countDocuments({
    event: event._id,
    status: { $ne: 'cancelled' }
  });

  if (availableTickets >= event.capacity) {
    return next(new AppError('No available tickets for this event', 400));
  }

  // 3) Check if user has already booked this event
  const existingTicket = await Ticket.findOne({
    event: event._id,
    user: req.user.id,
    status: { $ne: 'cancelled' }
  });

  if (existingTicket) {
    return next(new AppError('You have already booked this event', 400));
  }

  // 4) Create ticket
  console.log('Creating ticket for event:', event._id, 'User:', req.user.id);

  try {
    const ticket = await Ticket.create({
      event: event._id,
      user: req.user.id,
      ticketNumber: `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      price: event.price,
      qrCode: `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`,
      registrationData: req.body.registrationData
    });
    console.log('Ticket created successfully:', ticket._id);

    // 5) Send response with ticket details
    res.status(201).json({
      status: 'success',
      data: {
        ticket
      }
    });
  } catch (error) {
    console.error("Ticket Creation Failed:", error);
    return next(new AppError(`Ticket Creation Failed: ${error.message}`, 500));
  }
});

exports.getMyTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({ user: req.user.id })
    .populate({
      path: 'event',
      select: 'name startDate endDate location imageCover'
    });

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: {
      tickets
    }
  });
});

exports.getMyEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find({ organizer: req.user.id });

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: {
      events
    }
  });
});
