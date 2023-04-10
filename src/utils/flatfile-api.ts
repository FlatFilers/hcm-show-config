import { post } from './request';

export const getAccessToken = async () => {
  const clientId = process.env.clientId;
  const secret = process.env.secret;

  // why this no work
  await post({
    hostname: 'api.x.flatfile.com',
    path: '/v1/auth',
    body: { clientId, secret },
  });
};
