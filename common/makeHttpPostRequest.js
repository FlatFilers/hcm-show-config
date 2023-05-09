const https = require('https');

function makeHttpPostRequest(params) {
  const { url, body, token } = params;
  const options = {
    protocol: 'https:',
    hostname: 'api.x.flatfile.com',
    method: 'POST',
    path: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(responseBody);
        } else {
          resolve('Failure');
        }
      });
      res.on('error', (error) => {
        console.log('error', error);
        reject(new Error('HTTP call failed'));
      });
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

export default makeHttpPostRequest;
