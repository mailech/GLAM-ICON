const Ticket = require('../models/Ticket');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyTickets = catchAsync(async (req, res, next) => {
    // Find tickets for the current user
    const tickets = await Ticket.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: {
            tickets
        }
    });
});

exports.createTicket = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.event) req.body.event = req.params.eventId;
    if (!req.body.user) req.body.user = req.user.id;

    const newTicket = await Ticket.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            ticket: newTicket
        }
    });
});

exports.getTicket = catchAsync(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new AppError('No ticket found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            ticket
        }
    });
});
