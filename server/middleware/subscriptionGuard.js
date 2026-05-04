import Business from '../models/Business.js';

/**
 * Subscription Guard Middleware
 * Blocks dashboard API access based on subscription status and expiry.
 */
export const subscriptionGuard = async (req, res, next) => {
  try {
    const business = await Business.findById(req.business.id).select('subscriptionStatus subscriptionExpiresAt');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const { subscriptionStatus, subscriptionExpiresAt } = business;
    const now = new Date();

    // Block users who have never set up payment
    if (subscriptionStatus === 'pending_setup') {
      return res.status(403).json({
        message: 'Please complete your account setup.',
        setupRequired: true
      });
    }

    // Active subscribers — always allow
    if (subscriptionStatus === 'active') {
      return next();
    }

    // Trialing — allow if trial hasn't expired yet
    if (subscriptionStatus === 'trialing') {
      if (subscriptionExpiresAt && subscriptionExpiresAt < now) {
        return res.status(403).json({
          message: 'Your first month promotion has expired. Please check billing.',
          trialExpired: true
        });
      }
      return next();
    }

    // Canceled — allow during grace period (until subscriptionExpiresAt elapses)
    if (subscriptionStatus === 'canceled') {
      if (subscriptionExpiresAt && subscriptionExpiresAt > now) {
        return next(); // Still has time left, grant access
      }
      return res.status(403).json({
        message: 'Your subscription has fully expired. Please re-subscribe to continue.',
        trialExpired: true
      });
    }

    // Any other unknown status — block
    return res.status(403).json({
      message: 'Your subscription is inactive. Please update your billing.',
      trialExpired: true
    });
  } catch (error) {
    console.error('subscriptionGuard error:', error);
    return res.status(500).json({ message: 'Server error checking subscription' });
  }
};
