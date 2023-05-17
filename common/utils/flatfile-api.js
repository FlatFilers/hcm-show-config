import { FlatfileEvent } from '@flatfile/configure';
import { post } from './request';
const util = require('util');

/**
 * Retrieves the access token from the Flatfile API.
 */
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

/**
 * Retrieves the user ID from the Flatfile space.
 *
 * @param {Object} params - The function parameters.
 * @param {FlatfileEvent} params.event - The Flatfile event object.
 * @param {string} params.spaceId - The space ID.
 * @returns {string} The user ID.
 */
export const getUserIdFromSpace = async ({ event, spaceId }) => {
  console.log('| fetching space: ' + spaceId);
  console.log(util.inspect(event));

  const actorId = await event.context.actorId;

  console.log('| actor: ' + JSON.stringify(actorId));

  // TODO: Eventually remove. Embed has a different format currently
  // and nests the data under `spaceInfo`

  return actorId;
};
