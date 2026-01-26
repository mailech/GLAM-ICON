const Ticket = require('../models/Ticket');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllTickets = catchAsync(async (req, res, next) => {
    // Reverted to DB fetch with debug logging
    const tickets = await Ticket.find().sort('-createdAt').populate('user').populate('event');
    console.log(`getAllTickets: Found ${tickets.length} tickets`);

    res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: {
            data: tickets
        }
    });
});

exports.updateTicketStatus = catchAsync(async (req, res, next) => {
    // 1. Update the ticket
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, {
        applicationStatus: req.body.status,
        adminFeedback: req.body.feedback
    }, {
        new: true,
        runValidators: true
    }).populate('user');

    if (!ticket) {
        return next(new AppError('No ticket found with that ID', 404));
    }

    // 2. If status is 'shortlisted', send notification email
    if (req.body.status === 'shortlisted' && ticket.user && ticket.user.email) {
        const resetURL = `http://localhost:5173/phase-2-registration?ticketId=${ticket._id}`; // TODO: Change to prod URL in production

        try {
            const sendEmail = require('../utils/email');

            const message = `
                Congratulations ${ticket.user.name}! 
                
                You have been SHORTLISTED for the next round of Glam Iconic India 2026!
                The judges were impressed with your profile.

                Please complete your Phase 2 Registration to proceed further:
                ${resetURL}

                Admin Feedback: ${req.body.feedback || 'Great profile!'}

                Best of luck,
                The Glam Iconic India Team
            `;

            await sendEmail({
                email: ticket.user.email,
                subject: 'You are Shortlisted! - Glam Iconic India',
                message
            });
            console.log(`Shortlist email sent to ${ticket.user.email}`);
        } catch (err) {
            console.error('Email send failed:', err);
            // Don't fail the request, just log it.
        }
    }

    res.status(200).json({
        status: 'success',
        data: { ticket }
    });
});

exports.getMyTickets = catchAsync(async (req, res, next) => {
    // Find tickets for the current user
    console.log(`getMyTickets: Fetching for user ${req.user.id}`);
    const tickets = await Ticket.find({ user: req.user.id }).populate('event');
    console.log(`getMyTickets: Found ${tickets.length} tickets`);

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

exports.getTicketStats = catchAsync(async (req, res, next) => {
    const stats = await Ticket.aggregate([
        {
            $group: {
                _id: '$applicationStatus',
                count: { $sum: 1 }
            }
        }
    ]);

    // Format stats for easier frontend consumption
    const statsObj = {
        total: 0,
        pending: 0,
        shortlisted: 0,
        rejected: 0
    };

    stats.forEach(s => {
        // Handle potential null/undefined status by treating as 'pending' or ignoring
        const status = s._id || 'pending';
        if (statsObj[status] !== undefined) {
            statsObj[status] = s.count;
        } else {
            // If there are other statuses not initialized above, add them or map them
            statsObj[status] = s.count;
        }
        statsObj.total += s.count;
    });

    // Explicitly mapping if the naming in DB is different, but assuming 'pending', 'shortlisted', 'rejected'

    res.status(200).json({
        status: 'success',
        data: {
            stats: statsObj
        }
    });
});
