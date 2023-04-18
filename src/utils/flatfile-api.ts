import { FlatfileEvent } from '@flatfile/configure';
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

export const getUserIdFromSpace = async ({
  event,
  spaceId,
}: {
  event: FlatfileEvent;
  spaceId: string;
}) => {
  console.log('| fetching space: ' + spaceId);

  const space = await event.api.getSpaceById({ spaceId });

  console.log('| space: ' + JSON.stringify(space));

  // TODO: Eventually remove. Embed has a different format currently
  // and nests the data under `spaceInfo`
  const userId =
    (space.data.metadata as { userId: string }).userId ||
    (space.data.metadata as { spaceInfo: { userId: string } }).spaceInfo.userId;

  console.log('| userId: ' + userId);

  return userId;
};
