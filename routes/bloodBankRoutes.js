// File: backend/routes/bloodBankRoutes.js
const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBankController');
const auth = require('../middleware/auth');

router.get('/', bloodBankController.getAllBloodBanks);
router.get('/:id', bloodBankController.getBloodBankById);

router.use(auth.protect);

router.post('/:bloodBankId/requests', auth.authorize('user'), bloodBankController.createBloodRequest);
router.get('/:bloodBankId/requests', auth.authorize('bloodbank_admin'), bloodBankController.getBloodBankRequests);

router.patch('/:id/stock', auth.authorize('bloodbank_admin'), bloodBankController.updateBloodStock);

module.exports = router;