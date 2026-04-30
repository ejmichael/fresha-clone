import crypto from 'crypto';
import Business from '../models/Business.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate PayFast signature
const generateSignature = (data, passPhrase = null) => {
  let pfOutput = '';
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== '') {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
      }
    }
  }

  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== null && passPhrase !== '') {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscriptionCheckout = async (req, res) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Calculate billing date: 30 days starting from today if they are in pending_setup
    let billingDate = new Date();
    let initialAmount = '149.00';
    if (business.subscriptionStatus === 'pending_setup') {
      billingDate.setDate(billingDate.getDate() + 30);
      initialAmount = '0.00';
    }
    const billingDateString = billingDate.toISOString().split('T')[0];

    // The data payload for a PayFast Subscription
    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.CLIENT_URL}/dashboard/settings?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/settings?payment=canceled`,
      notify_url: `https://${req.get('host')}/api/payments/itn`,
      name_first: business.name.split(' ')[0] || 'Business',
      name_last: business.name.split(' ').slice(1).join(' ') || 'Owner',
      email_address: business.email,
      m_payment_id: businessId,        // Track custom user ID
      amount: initialAmount,            // Monthly cost for Growth plan (0.00 for trial)
      item_name: 'Lazie Growth Subscription',
      subscription_type: '1',          // 1 = Subscription
      billing_date: billingDateString, // The date for the first payment (today or in 30 days)
      recurring_amount: '149.00',
      frequency: '3',                  // 3 = Monthly
      cycles: '0',                     // 0 = Indefinite
    };

    // Calculate Signature
    paymentData.signature = generateSignature(paymentData, process.env.PAYFAST_PASSPHRASE || '');

    res.json({ paymentData, payfastUrl: process.env.PAYFAST_URL });
  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

export const payfastITNWebhook = async (req, res) => {
  try {
    // PayFast ITN payload
    const pfData = req.body;

    // 1. Check IP address (In production, verify it's from PayFast)
    // 2. Validate Signature
    const signature = pfData.signature;
    delete pfData.signature;

    const calculatedSignature = generateSignature(pfData, process.env.PAYFAST_PASSPHRASE || '');

    if (signature !== calculatedSignature) {
      console.error('Invalid signature in ITN');
      return res.status(400).send('Invalid signature');
    }

    // 3. Process the state
    const paymentStatus = pfData.payment_status; // e.g., COMPLETE
    const businessId = pfData.m_payment_id;
    const token = pfData.token; // The recurring billing token

    if (businessId) {
      const business = await Business.findById(businessId);
      if (business) {
        business.payfastToken = token;

        // If the payment is COMPLETE, it means a charge was actually made
        if (paymentStatus === 'COMPLETE') {
          business.subscriptionStatus = 'active';
          
          // Extend expiration by 31 days from today
          const expiration = new Date();
          expiration.setDate(expiration.getDate() + 31);
          business.subscriptionExpiresAt = expiration;
          
          console.log(`[ITN] Successfully activated PAID subscription for business ${businessId}`);
        } 
        // If it's NOT complete but we have a token and they were pending, it's a trial setup
        else if (business.subscriptionStatus === 'pending_setup' && token) {
          business.subscriptionStatus = 'trialing';
          
          // Set trial expiration exactly 30 days from now
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 30);
          business.subscriptionExpiresAt = trialEnd;
          
          console.log(`[ITN] Successfully started GATED TRIAL for business ${businessId}`);
        }

        await business.save();
      }
    }

    // Always respond with 200 to acknowledge receipt of ITN
    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN Webhook Error:', error);
    res.status(500).send('Webhook parsing error');
  }
};
