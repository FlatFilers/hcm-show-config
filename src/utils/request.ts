import https from 'https';

export const post = async ({ path, body }: { path: string; body: any }) => {
  try {
    const req = https.request({
      method: 'POST',
      protocol: 'https:',
      hostname: 'hcm.show',
      path,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const bodyJson = JSON.stringify(body);
    req.write(bodyJson);
    req.end();
  } catch (err: unknown) {
    console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
  }
};
