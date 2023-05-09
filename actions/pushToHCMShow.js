import { post } from '../common/utils/request';
import { getUserIdFromSpace } from '../common/utils/flatfile-api';

export const pushToHcmShow = async (event) => {
  console.log('pushToHcmShow | e: ' + JSON.stringify(event));

  const { spaceId } = event.context;

  const userId = await getUserIdFromSpace({ event, spaceId });

  post({
    hostname: 'hcm.show',
    path: `/api/v1/sync-space`,
    body: { userId, spaceId },
  });
};
