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
      amount: '149.00',                // Monthly cost for Growth plan
      item_name: 'Lazie Growth Subscription',
      subscription_type: '1',          // 1 = Subscription
      billing_date: new Date().toISOString().split('T')[0], // Start billing immediately
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

    if (paymentStatus === 'COMPLETE') {
      const business = await Business.findById(businessId);
      if (business) {
        business.subscriptionStatus = 'active';
        business.payfastToken = token;
        
        // Extend expiration by 31 days
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 31);
        business.subscriptionExpiresAt = expiration;

        await business.save();
        console.log(`[ITN] Successfully activated subscription for business ${businessId}`);
      }
    }

    // Always respond with 200 to acknowledge receipt of ITN
    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN Webhook Error:', error);
    res.status(500).send('Webhook parsing error');
  }
};
