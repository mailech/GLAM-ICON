const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router
    .route('/')
    .get(ticketController.getMyTickets)
    .post(ticketController.createTicket);

router
    .route('/:id')
    .get(ticketController.getTicket)
    .patch(authController.restrictTo('admin'), ticketController.updateTicketStatus);

// Admin routes
// router.use(authController.restrictTo('admin'));
router.route('/admin/stats').get(ticketController.getTicketStats);
router.route('/admin/all').get(ticketController.getAllTickets);

module.exports = router;
