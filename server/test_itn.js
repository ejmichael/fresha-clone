import crypto from 'crypto';

const passPhrase = '1lovePamlyn4ever'; // from .env

const simulatedData = {
  m_payment_id: '69f3bfa1b0b3e3272881a2bf',
  pf_payment_id: '1234567',
  payment_status: 'COMPLETE',
  item_name: 'Lazie Growth Subscription',
  item_description: '',
  amount_gross: '14.90',
  amount_fee: '-0.50',
  amount_net: '14.40',
  custom_str1: '',
  custom_str2: '',
  custom_str3: '',
  custom_str4: '',
  custom_str5: '',
  custom_int1: '',
  custom_int2: '',
  custom_int3: '',
  custom_int4: '',
  custom_int5: '',
  name_first: 'Test',
  name_last: 'User',
  email_address: 'test@example.com',
  merchant_id: '10039862',
  token: 'fdbcfb8a-9824-4f22-9218-c2fe0ea9a65f',
  billing_date: '2024-05-30'
};

const generateSignature = (data, passPhrase) => {
  let pfOutput = '';
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (data[key] !== '') {
        const stringValue = String(data[key]).trim();
        pfOutput += `${key}=${encodeURIComponent(stringValue).replace(/%20/g, '+')}&`;
      }
    }
  }
  let getString = pfOutput.slice(0, -1);
  if (passPhrase) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(getString).digest('hex');
};

simulatedData.signature = generateSignature(simulatedData, passPhrase);

// Convert to x-www-form-urlencoded
const formBody = [];
for (let property in simulatedData) {
  const encodedKey = encodeURIComponent(property);
  const encodedValue = encodeURIComponent(simulatedData[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}

const fetchUrl = 'http://localhost:5011/api/payments/itn';

fetch(fetchUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: formBody.join("&")
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(({ status, text }) => {
  console.log(`Server responded with ${status}: ${text}`);
})
.catch(err => console.error('Fetch error:', err));
