const https = require('https');
function makeHttpPostRequest(params: any) {
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
        if (res.statusCode === 201) {
          resolve(body);
        } else {
          resolve('Failure');
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
}
export default makeHttpPostRequest;
