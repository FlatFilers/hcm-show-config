import https from 'https';

export const post = async ({ hostname = 'hcm.show', path, body }) => {
  try {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          method: 'POST',
          protocol: 'https:',
          hostname,
          path,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          let result = '';
          res.on('data', (chunk) => {
            result += chunk;
          });
          res.on('end', () => {
            if (
              res.statusCode &&
              res.statusCode >= 200 &&
              res.statusCode < 300
            ) {
              resolve(result);
            } else {
              resolve('Failure');
            }
          });
          res.on('error', (err) => {
            reject(new Error('HTTP call failed'));
          });
        }
      );
      const bodyJson = JSON.stringify(body);
      req.write(bodyJson);
      req.end();
    });
  } catch (err) {
    console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
  }
};
