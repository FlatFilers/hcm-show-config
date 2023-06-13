import { FlatfileEvent } from '@flatfile/configure';
import { post } from './request';
import api from '@flatfile/api';

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
export const getUserIdFromSpace = async (spaceId) => {
  console.log('| fetching space: ' + spaceId);

  const space = await api.spaces.get(spaceId);

  console.log('| space: ' + JSON.stringify(space));

  const userId = space.data.metadata.userId;

  console.log('| userId: ' + userId);

  // TODO: Eventually remove. Embed has a different format currently
  // and nests the data under `spaceInfo`

  return userId;
};
