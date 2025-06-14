// File: backend/routes/hospitalRoutes.js
const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const {protect, authorize} = require('../middleware/auth');

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);

router.use(protect);

router.post('/:hospitalId/requests', authorize('user'), hospitalController.createBedRequest);
router.get('/:hospitalId/requests', authorize('hospital_admin'), hospitalController.getHospitalRequests);

router.put('/:id/beds', protect, authorize('hospital_admin'), hospitalController.updateBedAvailability);

module.exports = router;