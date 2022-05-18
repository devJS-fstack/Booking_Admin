const express = require('express');
const router = express.Router();

const bookingController = require('../app/Controllers/BookingController');

// newsController.main
router.post('/success', bookingController.successBooking);
router.post('/cancel', bookingController.cancelBooking);
router.post('/info', bookingController.infoBooking);
router.post('/', bookingController.main);
router.get('/', bookingController.main);
module.exports = router;