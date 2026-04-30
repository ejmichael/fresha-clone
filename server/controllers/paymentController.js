import crypto from 'crypto';
import Business from '../models/Business.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate PayFast signature
const generateSignature = (data, passPhrase = null) => {
  let pfOutput = '';
  
  // Create a copy and remove signature if present (for ITN verification)
  const signData = { ...data };
  delete signData.signature;

  // PayFast requires variables to be in alphabetical order for signature generation
  const sortedKeys = Object.keys(signData).sort();
  
  for (let key of sortedKeys) {
    const value = signData[key];
    if (value !== undefined && value !== null && value !== '') {
      // Ensure value is a string before trimming
      const stringValue = String(value).trim();
      pfOutput += `${key}=${encodeURIComponent(stringValue).replace(/%20/g, '+')}&`;
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
    const businessId = req.business?.id;
    if (!businessId) {
      console.error('[Checkout] No business ID in request');
      return res.status(401).json({ message: 'User reference missing' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      console.error('[Checkout] Business not found:', businessId);
      return res.status(404).json({ message: 'Business not found' });
    }

    // Verify critical env vars
    if (!process.env.PAYFAST_MERCHANT_ID || !process.env.PAYFAST_MERCHANT_KEY) {
      console.error('[Checkout] PayFast configuration missing in .env');
      return res.status(500).json({ message: 'Payment gateway misconfigured' });
    }

    // Calculate billing date: 30 days starting from today if they are in pending_setup
    let billingDate = new Date();
    let initialAmount = '149.00';
    if (business.subscriptionStatus === 'pending_setup') {
      billingDate.setDate(billingDate.getDate() + 30);
      initialAmount = '10.00';
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
      m_payment_id: businessId.toString(),        // Ensure string
      amount: initialAmount,
      item_name: 'Lazie Growth Subscription',
      subscription_type: '1',
      billing_date: billingDateString,
      recurring_amount: '149.00',
      frequency: '3',
      cycles: '0',
    };

    console.log('[Checkout] Generating payment for:', business.name, 'Amount:', initialAmount);

    // Calculate Signature
    paymentData.signature = generateSignature(paymentData, process.env.PAYFAST_PASSPHRASE || '');

    res.json({ paymentData, payfastUrl: process.env.PAYFAST_URL });
  } catch (error) {
    console.error('[Checkout Error]', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

export const payfastITNWebhook = async (req, res) => {
  try {
    // PayFast ITN payload
    const pfData = req.body;
    console.log('[ITN Webhook Received]', pfData);

    if (!pfData || Object.keys(pfData).length === 0) {
      console.error('[ITN] Empty payload received. Check express.urlencoded middleware.');
      return res.status(400).send('Empty payload');
    }

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
