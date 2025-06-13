// File: backend/routes/hospitalRoutes.js
const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);

router.use(auth.protect);

router.post('/:hospitalId/requests', auth.authorize('user'), hospitalController.createBedRequest);
router.get('/:hospitalId/requests', auth.authorize('hospital_admin'), hospitalController.getHospitalRequests);

router.patch('/:id/beds', auth.authorize('hospital_admin'), hospitalController.updateBedAvailability);

module.exports = router;