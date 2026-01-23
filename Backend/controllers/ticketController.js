const Ticket = require('../models/Ticket');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllTickets = catchAsync(async (req, res, next) => {
    // Simplified: Get all tickets, sort by newest. Ignoring pagination for now to debug.
    const tickets = await Ticket.find().sort('-createdAt').populate('user').populate('event');

    res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: {
            data: tickets
        }
    });
});

exports.updateTicketStatus = catchAsync(async (req, res, next) => {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, {
        applicationStatus: req.body.status,
        adminFeedback: req.body.feedback
    }, {
        new: true,
        runValidators: true
    });

    if (!ticket) {
        return next(new AppError('No ticket found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { ticket }
    });
});

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
