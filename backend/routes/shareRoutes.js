const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, shareController.shareCalendar);
router.get('/professional/:professionalId', authMiddleware, shareController.getSharedCalendars);
router.delete('/:id', authMiddleware, shareController.revokeShare);

module.exports = router;