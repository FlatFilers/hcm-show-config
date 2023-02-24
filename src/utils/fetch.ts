const https = require('https');

type GetParams = { host: string; path: string; token: string };

export const get = ({
  host,
  path,
  token,
}: GetParams): Promise<{ status: number; data: any }> => {
  // const { host, path, body, token } = params;
  const options = {
    protocol: 'https:',
    hostname: host,
    method: 'GET',
    path: path,
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

type PostParams = { host: string; path: string; body: any; token: string };

export const post = ({
  host,
  path,
  body,
  token,
}: PostParams): Promise<{ status: number; data: any }> => {
  const options = {
    protocol: 'https:',
    hostname: host,
    method: 'POST',
    path: path,
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
