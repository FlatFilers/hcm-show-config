import { FlatfileEvent } from '@flatfile/configure';
import { post } from './request';

export const getAccessToken = async () => {
  const clientId = '8645f8b0-5573-4926-8f7b-7b114f36d45b';
  const secret = 'feab5697-911b-41b9-9282-f1011e3cba13';

  try {
    await post({
      hostname: 'api.x.flatfile.com',
      path: '/v1/auth',
      body: { clientId, secret },
    });
  } catch (err) {
    console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
  }
};

export const getUserIdFromSpace = async ({ event, spaceId }) => {
  console.log('| fetching space: ' + spaceId);

  const space = await event.api.getSpaceById(spaceId);

  console.log('| space: ' + JSON.stringify(space));

  // TODO: Eventually remove. Embed has a different format currently
  // and nests the data under `spaceInfo`
  const userId =
    (space.metadata && space.metadata.userId) ||
    (space.metadata &&
      space.metadata.spaceInfo &&
      space.metadata.spaceInfo.userId);

  console.log('| userId: ' + userId);

  return userId;
};
