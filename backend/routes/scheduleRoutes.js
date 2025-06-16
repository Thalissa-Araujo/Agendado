const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, scheduleController.createSchedule);
router.get('/professional/:professionalId', authMiddleware, scheduleController.getProfessionalSchedules);
router.put('/:id', authMiddleware, scheduleController.updateSchedule);
router.delete('/:id', authMiddleware, scheduleController.deleteSchedule);

module.exports = router;