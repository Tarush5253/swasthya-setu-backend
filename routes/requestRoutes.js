// File: backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.use(auth.protect);

router.get('/bed-requests', requestController.getUserBedRequests);
router.get('/blood-requests', requestController.getUserBloodRequests);

router.patch('/bed-requests/:id', auth.authorize('hospital_admin'), requestController.updateBedRequestStatus);
router.patch('/blood-requests/:id', auth.authorize('bloodbank_admin'), requestController.updateBloodRequestStatus);

module.exports = router;