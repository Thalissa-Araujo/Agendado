const express = require('express');
const router = express.Router();
console.log('shareRoutes.js loaded');
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, shareController.shareCalendar);
console.log('POST / route defined in shareRoutes.js');
router.get('/professional/:professionalId', authMiddleware, shareController.getSharedCalendars);
router.delete('/:id', authMiddleware, shareController.revokeShare);

module.exports = router;