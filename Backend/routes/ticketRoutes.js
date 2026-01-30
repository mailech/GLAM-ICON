const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

const paymentController = require('../controllers/paymentController');

// Payment Routes
router.post('/create-order', paymentController.createOrder);

router
    .route('/')
    .get(ticketController.getMyTickets)
    .post(ticketController.createTicket);

router
    .route('/:id')
    .get(ticketController.getTicket)
    .patch(authController.restrictTo('admin'), ticketController.updateTicketStatus);

router.patch('/:id/phase2', ticketController.submitPhase2);

// Admin routes
// router.use(authController.restrictTo('admin'));
router.route('/admin/export').get(ticketController.exportTicketsExcel);
router.route('/admin/stats').get(ticketController.getTicketStats);
router.route('/admin/all').get(ticketController.getAllTickets);

module.exports = router;
