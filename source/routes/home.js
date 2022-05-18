const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeController = require('../app/Controllers/HomeController')

// newsController.main
router.post('/checkToken', homeController.checkToken)
router.get('/status', homeController.status)
router.post('/passport', passport.authenticate('local', { failureRedirect: '/' }), homeController.passportAuthen)
router.post('/login', homeController.postLogin);
router.get('/', homeController.getMain);

module.exports = router;