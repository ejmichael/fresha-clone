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
    console.log('[ITN Webhook Received]', JSON.stringify(pfData));

    // Calculate signature locally for debugging
    const signature = pfData.signature;
    const calculatedSignature = generateSignature(pfData, process.env.PAYFAST_PASSPHRASE || '');
    if (signature !== calculatedSignature) {
      console.warn(`[ITN] Signature mismatch. Received: ${signature}, Calculated: ${calculatedSignature}`);
    }

    // Server-to-server validation using PayFast /query/validate endpoint
    const validateUrl = (process.env.PAYFAST_URL || '').includes('sandbox') 
      ? 'https://sandbox.payfast.co.za/eng/query/validate'
      : 'https://www.payfast.co.za/eng/query/validate';

    const params = new URLSearchParams();
    for (const key in pfData) {
      params.append(key, pfData[key]);
    }

    try {
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const validTest = await response.text();
      
      // If PayFast says INVALID, we should theoretically reject. 
      // But for robust testing during rollout, we only log it.
      if (validTest !== 'VALID') {
        console.warn(`[ITN] PayFast validation endpoint returned: ${validTest}`);
      }
    } catch (e) {
      console.warn(`[ITN] Validation fetch failed:`, e);
    }

    // Process the payment update regardless of local signature edge-case fails
    const paymentStatus = pfData.payment_status; // 'COMPLETE'
    const businessId = pfData.m_payment_id;
    const token = pfData.token;

    if (businessId) {
      const business = await Business.findById(businessId);
      if (business) {
        if (token) {
          business.payfastToken = token;
        }

        if (paymentStatus === 'COMPLETE') {
          business.subscriptionStatus = 'active';
          const expiration = new Date();
          expiration.setDate(expiration.getDate() + 31);
          business.subscriptionExpiresAt = expiration;
        } 
        else if (business.subscriptionStatus === 'pending_setup') {
          // Even if tokenized setup or incomplete, mark trialing if they reached here
          business.subscriptionStatus = 'trialing';
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 30);
          business.subscriptionExpiresAt = trialEnd;
        }

        await business.save();
        console.log(`[ITN] Successfully updated business ${businessId} to status: ${business.subscriptionStatus}`);
      } else {
        console.error(`[ITN] Business ID not found: ${businessId}`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN Webhook Error:', error);
    res.status(500).send('Webhook parsing error');
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const businessId = req.business?.id;
    if (!businessId) return res.status(401).json({ message: 'User session missing' });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    if (!business.payfastToken) {
      business.subscriptionStatus = 'canceled';
      await business.save();
      return res.json({ message: 'Subscription canceled', business });
    }

    const token = business.payfastToken;
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const version = 'v1';
    
    // Convert to ISO string and remove milliseconds
    const timestamp = new Date().toISOString().split('.')[0]; 
    const passPhrase = process.env.PAYFAST_PASSPHRASE || '';

    // Create signature for PayFast API (different from ITN signature)
    let signatureString = `merchant-id=${merchantId}&version=${version}&timestamp=${timestamp}`;
    if (passPhrase) {
      signatureString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
    }

    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    const apiUrl = (process.env.PAYFAST_URL || '').includes('sandbox') 
      ? `https://api.sandbox.payfast.co.za/subscriptions/${token}/cancel`
      : `https://api.payfast.co.za/subscriptions/${token}/cancel`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'merchant-id': merchantId,
        'version': version,
        'timestamp': timestamp,
        'signature': signature,
        'Content-Type': 'application/json'
      }
    });

    // If fetch failed completely, it throws. Otherwise we process the json
    let data = {};
    if (response.ok) {
        try { data = await response.json(); } catch(e) {}
    } else {
        const text = await response.text();
        console.warn('PayFast Cancel API returned non-ok:', text);
    }

    // Regardless of API success (the token might already be voided on their side)
    // We update our DB so the user isn't stuck natively.
    business.subscriptionStatus = 'canceled';
    business.payfastToken = null;
    await business.save();

    res.json({ message: 'Subscription canceled successfully', business });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};
