import express from 'express';
import { createSubscriptionCheckout, payfastITNWebhook, cancelSubscription } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate PayFast subscription signature for logged-in business
router.get('/checkout', protect, createSubscriptionCheckout);

// Public Webhook receiver for PayFast ITN
router.post('/itn', payfastITNWebhook);

// Cancel an active subscription
router.put('/cancel', protect, cancelSubscription);

export default router;
