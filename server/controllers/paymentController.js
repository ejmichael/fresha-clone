import crypto from 'crypto';
import Business from '../models/Business.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate PayFast signature
const generateSignature = (data, passPhrase = null) => {
  let pfOutput = '';
  
  // Make sure we don't include the signature itself in the hash calculation
  const signData = { ...data };
  delete signData.signature;

  for (let key in signData) {
    if (signData.hasOwnProperty(key)) {
      const value = signData[key];
      if (value !== undefined && value !== null && value !== '') {
        const stringValue = String(value).trim();
        pfOutput += `${key}=${encodeURIComponent(stringValue).replace(/%20/g, '+')}&`;
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

    // Set initial amount to 149.00 to test if bank accepts standard amount
    let initialAmount = '149.00';
    let billingDate = new Date();
    
    // Set next billing date to 30 days from now
    billingDate.setDate(billingDate.getDate() + 30);
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
      m_payment_id: businessId,
      amount: initialAmount,
      item_name: 'Lazie Growth Subscription',
      subscription_type: '1',
      billing_date: billingDateString,
      recurring_amount: '149.00',
      frequency: '3',
      cycles: '0',
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
    console.log('[ITN Webhook Received]', pfData);

    // 1. Check IP address (In production, verify it's from PayFast)
    // 2. Validate Signature
    const signature = pfData.signature;
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
          const expiration = new Date();
          expiration.setDate(expiration.getDate() + 31);
          business.subscriptionExpiresAt = expiration;
        } 
        else if (business.subscriptionStatus === 'pending_setup' && token) {
          business.subscriptionStatus = 'trialing';
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 30);
          business.subscriptionExpiresAt = trialEnd;
        }

        await business.save();
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN Webhook Error:', error);
    res.status(500).send('Webhook parsing error');
  }
};
