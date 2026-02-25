const Ticket = require('../models/Ticket');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllTickets = catchAsync(async (req, res, next) => {
    let filter = {};

    // 1. Handle Search
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        // Find users matching search first to filter tickets by user
        const User = require('../models/User');
        const users = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        });
        const userIds = users.map(u => u._id);

        filter = {
            $or: [
                { ticketNumber: searchRegex },
                { user: { $in: userIds } },
                { 'registrationData.phone': searchRegex }
            ]
        };
    }

    // 2. Handle Date Filtering
    if (req.query.date) {
        // Create range for the entire day in local time
        const targetDate = new Date(req.query.date);
        const start = new Date(targetDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(targetDate);
        end.setHours(23, 59, 59, 999);

        filter.createdAt = {
            $gte: start,
            $lte: end
        };
    }

    // EXECUTE QUERY
    const features = new APIFeatures(Ticket.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tickets = await features.query.populate('user').populate('event');

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
    if (req.body.status === 'shortlisted' && ticket.user) {
        // Sync status to User model so frontend banner appears
        const User = require('../models/User'); // Lazy load to avoid circular dependency if any
        await User.findByIdAndUpdate(ticket.user._id, { applicationStatus: 'shortlisted' });

        if (ticket.user.email) {
            const resetURL = `http://localhost:5173/phase-2-registration?ticketId=${ticket._id}`; // TODO: Change to prod URL in production
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
            try {
                const sendEmail = require('../utils/email');

                await sendEmail({
                    email: ticket.user.email,
                    subject: 'You are Shortlisted! - Glam Iconic India',
                    message
                });
                console.log(`Shortlist email sent to ${ticket.user.email}`);
            } catch (err) {
                console.error('Email send failed! (Check .env credentials)');
                console.log('--- EMAIL CONTENT PREVIEW ---');
                console.log(message);
                console.log('-----------------------------');
            }
        }
    } else if (req.body.status) {
        // Sync other statuses (rejected, completed, etc)
        const User = require('../models/User');
        await User.findByIdAndUpdate(ticket.user._id, { applicationStatus: req.body.status });
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
    let match = {};

    // Apply same search/date filters to stats
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        const User = require('../models/User');
        const users = await User.find({
            $or: [{ name: searchRegex }, { email: searchRegex }]
        });
        const userIds = users.map(u => u._id);
        match.$or = [
            { ticketNumber: searchRegex },
            { user: { $in: userIds } },
            { 'registrationData.phone': searchRegex }
        ];
    }

    if (req.query.date) {
        const date = new Date(req.query.date);
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        match.createdAt = { $gte: start, $lte: end };
    }

    const stats = await Ticket.aggregate([
        { $match: match },
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
        rejected: 0,
        completed: 0,
        cancelled: 0
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

    res.status(200).json({
        status: 'success',
        data: {
            stats: statsObj
        }
    });
});

exports.exportTicketsExcel = catchAsync(async (req, res, next) => {
    const ExcelJS = require('exceljs');

    // Fetch all tickets with status 'completed' (or allow filtering)
    // For now, let's export ALL completed Phase 2 registrations
    const tickets = await Ticket.find({ applicationStatus: 'completed' }).populate('user');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participants');

    worksheet.columns = [
        { header: 'Ticket No', key: 'ticketNumber', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Gender', key: 'gender', width: 10 },
        { header: 'Parents Name', key: 'parentsName', width: 25 },
        { header: 'Parents Phone', key: 'parentsNumber', width: 15 },
        { header: 'Address', key: 'address', width: 35 },
        { header: 'City', key: 'city', width: 15 },
        { header: 'State', key: 'state', width: 15 },
        { header: 'Pincode', key: 'pincode', width: 10 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
    ];

    tickets.forEach(ticket => {
        const regData = ticket.registrationData || {};
        worksheet.addRow({
            ticketNumber: ticket.ticketNumber,
            name: ticket.user.name,
            email: ticket.user.email,
            phone: regData.phone || ticket.user.phone,
            gender: regData.gender || '-',
            parentsName: regData.parentsName || '-',
            parentsNumber: regData.parentsNumber || '-',
            address: regData.address || '-',
            city: regData.city || '-',
            state: regData.state || '-',
            pincode: regData.pincode || '-',
            description: regData.description || '-',
            status: ticket.applicationStatus
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=participants.xlsx');

    await workbook.xlsx.write(res);
    res.end();
});

exports.submitPhase2 = catchAsync(async (req, res, next) => {
    // 1. Find ticket
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new AppError('No ticket found with that ID', 404));
    }

    // 2. Check if user owns the ticket or is admin
    const ticketUserId = (ticket.user._id || ticket.user).toString();
    const currentUserId = req.user.id.toString();

    console.log(`DEBUG: Phase 2 Auth Check`);
    console.log(`- Ticket ID: ${ticket._id}`);
    console.log(`- Ticket User ID: ${ticketUserId}`);
    console.log(`- Current User ID: ${currentUserId}`);
    console.log(`- Current User Role: ${req.user.role}`);

    if (ticketUserId !== currentUserId && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to update this ticket', 403));
    }

    // 3. Update registration Data
    // We map the incoming fields (bust, waist, etc.) into the registrationData sub-object
    const phase2Data = {
        height: req.body.height,
        weight: req.body.weight,
        bust: req.body.bust,
        waist: req.body.waist,
        hips: req.body.hips,
        shoeSize: req.body.shoeSize,
        description: req.body.description,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        parentsName: req.body.parentsName,
        parentsNumber: req.body.parentsNumber,
        gender: req.body.gender,
        state: req.body.state,
        city: req.body.city,
        pincode: req.body.pincode,
        paymentId: req.body.paymentId,
        paymentStatus: req.body.paymentStatus || 'completed', // Assuming frontend only calls this after success
        paymentAmount: req.body.amount,
    };

    // Update ticket
    ticket.registrationData = { ...ticket.registrationData, ...phase2Data };
    ticket.applicationStatus = 'completed';
    await ticket.save();

    // 4. Update user status
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { applicationStatus: 'completed' });

    res.status(200).json({
        status: 'success',
        data: {
            ticket
        }
    });
});

