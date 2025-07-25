const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/:professionalId/device-token', authController.updateDeviceToken);

module.exports = router;