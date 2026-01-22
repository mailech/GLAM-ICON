const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');
//const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested routes for reviews
//router.use('/:eventId/reviews', reviewRouter);

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes (require authentication)
router.use(authController.protect);

// Routes for ticket management
router.post('/:eventId/book', eventController.bookEvent);
router.get('/my-events', eventController.getMyEvents);
router.get('/my-tickets', eventController.getMyTickets);

// Admin and organizer restricted routes
router.use(authController.restrictTo('admin', 'organizer'));

router.post(
  '/',
  eventController.uploadEventImages,
  eventController.resizeEventImages,
  eventController.createEvent
);

router
  .route('/:id')
  .patch(
    eventController.uploadEventImages,
    eventController.resizeEventImages,
    eventController.updateEvent
  )
  .delete(eventController.deleteEvent);

module.exports = router;
