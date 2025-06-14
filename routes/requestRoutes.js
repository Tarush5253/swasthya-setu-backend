// File: backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.use(auth.protect);

router.get('/bed-requests', requestController.getUserBedRequests);
router.get('/blood-requests', requestController.getUserBloodRequests);


router.post('/:hospitalId', auth.protect, requestController.createBedRequest);

router.post('/blood-requests/:bloodBankId', auth.protect, requestController.createBloodRequest);

router.get('/hospital-bed-requests', auth.protect , auth.authorize('hospital_admin'), requestController.getHospitalBedRequests)
router.get('/hospital-blood-requests', auth.protect , auth.authorize('bloodbank_admin'), requestController.getHospitalBloodRequests)

router.patch('/bed-requests/:id', auth.authorize('hospital_admin'), requestController.updateBedRequestStatus);
router.patch('/blood-requests/:id', auth.authorize('bloodbank_admin'), requestController.updateBloodRequestStatus);

// Get combined request history
router.get('/history', auth.protect, requestController.getUserRequestHistory);

// Get specific request details
router.get('/:type(blood|bed)/:requestId', auth.protect, requestController.getRequestDetails);

module.exports = router;