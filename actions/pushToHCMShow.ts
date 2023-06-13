import { post } from '../common/utils/request';
import { getUserIdFromSpace } from '../common/utils/flatfile-api';

// Function to push data to HcmShow
export const pushToHcmShow = async (event) => {
  // Logging the event for debugging purposes
  console.log('pushToHcmShow | e: ' + JSON.stringify(event));

  // Extracting the spaceId from the event context
  const { spaceId } = event.context;

  // Getting the userId from the space using the getUserIdFromSpace utility function
  const userId = await getUserIdFromSpace(spaceId);

  // Making a POST request to 'hcm.show' API to sync the space
  post({
    hostname: 'hcm.show',
    path: `/api/v1/sync-space`,
    body: { userId, spaceId },
  });
};