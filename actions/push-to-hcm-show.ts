import { Action } from '@flatfile/configure';
import { post } from '../../utils/request';
import { getUserIdFromSpace } from '../../utils/flatfile-api';

export const pushToHcmShow = new Action(
  {
    slug: 'pushToHcmShow',
    label: 'Push records to HCM.show',
    description: "Push this workbook's records into HCM.show",
    primary: true,
  },
  async (event) => {
    console.log('pushToHcmShow | e: ' + JSON.stringify(event));

    const { spaceId } = event.context;

    const userId = await getUserIdFromSpace({ event, spaceId });

    post({
      hostname: 'hcm.show',
      path: `/api/v1/sync-space`,
      body: { userId, spaceId },
    });
  }
);
