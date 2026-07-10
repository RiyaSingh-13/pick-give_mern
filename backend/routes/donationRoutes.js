// backend/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/', donationController.createDonation);
router.get('/', donationController.getDonations);
router.put('/:id/accept', donationController.acceptDonation);
router.put('/:id/claim', donationController.claimDonationRun);
router.put('/:id/verify-pickup', donationController.verifyPickup);
router.put('/:id/complete', donationController.completeDonationDelivery);
router.put('/:id/self-transit', donationController.startSelfTransit);
router.put('/:id/self-complete', donationController.completeSelfDelivery);

module.exports = router;
