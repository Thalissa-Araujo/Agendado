const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, appointmentController.createAppointment);
router.get('/professional/:professionalId', authMiddleware, appointmentController.getProfessionalAppointments);
router.patch('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

module.exports = router;