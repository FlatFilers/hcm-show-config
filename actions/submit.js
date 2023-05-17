const https = require('https');

export default function submit(event) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      protocol: 'https:',
      hostname: 'webhook.site',
      path: '/256069b2-07da-411c-afba-51948cbc2515',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = JSON.stringify({ event }, null, 2);
    req.write(body);
    req.on('response', (res) => {
      // Handle the response if needed
      // ...
      // Resolve the promise to indicate the request is complete
      resolve();
    });
    req.on('error', (err) => {
      // Handle any errors that occur during the request
      reject(err);
    });
    req.end();
  });
}
