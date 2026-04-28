import Business from '../models/Business.js';

/**
 * Subscription Guard Middleware
 * Blocks dashboard API access if the business's trial has expired
 * and they haven't subscribed yet.
 * Always allows access if subscriptionStatus === 'active'.
 */
export const subscriptionGuard = async (req, res, next) => {
  try {
    const business = await Business.findById(req.business.id).select('subscriptionStatus subscriptionExpiresAt');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Handle new users who need to provide card details
    if (business.subscriptionStatus === 'pending_setup') {
      return res.status(403).json({
        message: 'Please complete your account setup by providing card details for your free trial.',
        setupRequired: true
      });
    }

    // Check if trial has expired
    if (business.subscriptionStatus === 'trialing') {
      const now = new Date();
      if (business.subscriptionExpiresAt && business.subscriptionExpiresAt < now) {
        return res.status(403).json({
          message: 'Your free trial has expired. Please subscribe to continue.',
          trialExpired: true
        });
      }
      return next(); // Still within trial
    }

    // Any other status (past_due, canceled) — block access
    return res.status(403).json({
      message: 'Your subscription is inactive. Please update your billing.',
      trialExpired: true
    });
  } catch (error) {
    console.error('subscriptionGuard error:', error);
    return res.status(500).json({ message: 'Server error checking subscription' });
  }
};
