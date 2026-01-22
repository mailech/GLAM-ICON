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
    .get(ticketController.getTicket);

module.exports = router;
