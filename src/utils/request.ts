import https from 'https';

export const post = async ({
  hostname = 'hcm.show',
  path,
  body,
}: {
  hostname?: string;
  path: string;
  body: any;
}) => {
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
          res.on('data', (chunk: any) => {
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
          res.on('error', () => {
            reject(Error('HTTP call failed'));
          });
        }
      );
      const bodyJson = JSON.stringify(body);
      req.write(bodyJson);
      req.end();
    });
  } catch (err: unknown) {
    console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
  }
};
