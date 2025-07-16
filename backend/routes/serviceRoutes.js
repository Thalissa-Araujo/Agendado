const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, serviceController.createService);
router.get('/', authMiddleware, serviceController.getProfessionalServicesForAuthUser);
router.get('/professional/:professionalId', authMiddleware, serviceController.getProfessionalServices);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;