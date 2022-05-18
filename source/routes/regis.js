const express = require('express');
const router = express.Router();

const regisController = require('../app/Controllers/RegisController')

// newsController.main
router.post('/stored', regisController.createUser)
router.post('/checkDuplicatePhone', regisController.checkDuplicatePhone)
router.post('/checkDuplicateEmail', regisController.checkDuplicateEmail)
router.post('/verify-email', regisController.verifyEmail)
router.post('/confirm-verify', regisController.confirmNumber)
router.get('/', regisController.main)

module.exports = router;