const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const serviceRoutes = require('./serviceRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const shareRoutes = require('./shareRoutes');

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/share', shareRoutes);
console.log('shareRoutes mounted at /share');

module.exports = router;