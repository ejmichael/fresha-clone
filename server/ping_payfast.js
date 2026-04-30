import crypto from 'crypto';

const merchantId = '10039862';
const passPhrase = '1lovePamlyn4ever';
const version = 'v1';
const timestamp = new Date().toISOString().split('.')[0]; 

// Create signature for PayFast API (MUST BE STRICT ALPHABETICAL ORDER)
let signatureString = `merchant-id=${merchantId}`;
signatureString += `&passphrase=${passPhrase}`;
signatureString += `&timestamp=${timestamp}`;
signatureString += `&version=${version}`;

const signature = crypto.createHash('md5').update(signatureString).digest('hex');

console.log('Sending String to hash:', signatureString);
console.log('Signature:', signature);

const apiUrl = `https://api.payfast.co.za/ping`;

fetch(apiUrl, {
  method: 'GET',
  headers: {
    'merchant-id': merchantId,
    'version': version,
    'timestamp': timestamp,
    'signature': signature,
    'Content-Type': 'application/json'
  }
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(({status, text}) => {
  console.log(`Ping Response: ${status}`);
  console.log(text);
})
.catch(err => console.error(err));
