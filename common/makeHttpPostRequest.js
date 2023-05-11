const https = require('https');

/**
 * Makes an HTTP POST request.
 * @param {Object} params - Request parameters including the URL, body, and token.
 * @returns {Promise} - A promise that resolves with the response body or 'Failure' if the status code is not 201.
 */
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

      // Accumulate the response data
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      // Handle the response end event
      res.on('end', () => {
        if (res.statusCode === 201) {
          // Resolve the promise with the response body if the status code is 201
          resolve(responseBody);
        } else {
          // Resolve the promise with 'Failure' if the status code is not 201
          resolve('Failure');
        }
      });

      // Handle the response error event
      res.on('error', (error) => {
        console.log('error', error);
        // Reject the promise with an error if an error occurs during the response
        reject(new Error('HTTP call failed'));
      });
    });

    // Write the request body to the request
    req.write(JSON.stringify(body));
    req.end();
  });
}

export default makeHttpPostRequest;
