import crypto from 'crypto';
import Business from '../models/Business.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate PayFast signature
const generateSignature = (data, passPhrase = null) => {
  let pfOutput = '';
  
  // 1. Create a copy and remove existing signature for hashing
  const signData = { ...data };
  delete signData.signature;

  // 2. Concatenate fields in insertion order (standard for PayFast object maps)
  for (let key in signData) {
    if (Object.prototype.hasOwnProperty.call(signData, key)) {
      const value = signData[key];
      // PayFast skips empty values in the signature string
      if (value !== undefined && value !== null && value !== '') {
        const stringValue = String(value).trim();
        pfOutput += `${key}=${encodeURIComponent(stringValue).replace(/%20/g, '+')}&`;
      }
    }
  }

  // 3. Remove trailing ampersand
  let getString = pfOutput.slice(0, -1);

  // 4. Append passphrase if configured
  if (passPhrase !== null && passPhrase !== '') {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(getString).digest('hex');
};

export const createSubscriptionCheckout = async (req, res) => {
  try {
    const businessId = req.business?.id;
    if (!businessId) return res.status(401).json({ message: 'User session missing' });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Payment Logic: R14.90 initial auth for trial setup
    let initialAmount = '149.00';
    let billingDate = new Date();
    if (business.subscriptionStatus === 'pending_setup') {
      billingDate.setDate(billingDate.getDate() + 30);
      initialAmount = '14.90';
    }
    const billingDateString = billingDate.toISOString().split('T')[0];

    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.CLIENT_URL || 'https://lazie.co.za'}/dashboard/settings?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'https://lazie.co.za'}/dashboard/settings?payment=canceled`,
      notify_url: `https://${req.get('host')}/api/payments/itn`,
      name_first: business.name.split(' ')[0] || 'Business',
      name_last: business.name.split(' ').slice(1).join(' ') || 'Owner',
      email_address: business.email,
      m_payment_id: businessId.toString(),
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
    const pfData = req.body;
    
    // Validate Signature (passphrase is critical here)
    const signature = pfData.signature;
    const calculatedSignature = generateSignature(pfData, process.env.PAYFAST_PASSPHRASE || '');

    if (signature !== calculatedSignature) {
      console.error('Invalid signature in ITN');
      return res.status(400).send('Invalid signature');
    }

    const businessId = pfData.m_payment_id;
    const token = pfData.token;
    const paymentStatus = pfData.payment_status;

    if (businessId) {
      const business = await Business.findById(businessId);
      if (business) {
        business.payfastToken = token;

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
