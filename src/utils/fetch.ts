const https = require('https');

export const get = (params: any): Promise<{ status: number; data: any }> => {
  const { url, body, token } = params;
  const options = {
    protocol: 'https:',
    hostname: 'api.x.flatfile.com',
    method: 'GET',
    path: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.status >= 200 && res.status < 300) {
          resolve({ status: 200, data: JSON.parse(body) });
        } else {
          resolve({ status: 400, data: null });
        }
      });
      res.on('error', () => {
        console.log('error');
        reject(Error('HTTP call failed'));
      });
    });
    // The below 2 lines are most important part of the whole snippet.
    // req.write(JSON.stringify(body));
    req.end();
  });
};

export const post = (params: any): Promise<{ status: number; data: any }> => {
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
    const req = https.request(options, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.status >= 200 && res.status < 300) {
          resolve({ status: 200, data: JSON.parse(body) });
        } else {
          resolve({ status: 400, data: null });
        }
      });
      res.on('error', () => {
        console.log('error');
        reject(Error('HTTP call failed'));
      });
    });
    // The below 2 lines are most important part of the whole snippet.
    req.write(JSON.stringify(body));
    req.end();
  });
};
