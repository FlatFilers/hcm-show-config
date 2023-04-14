import { Action } from '@flatfile/configure';
import { post } from '../../utils/request';

export const pushToHcmShow = new Action(
  {
    slug: 'pushToHcmShow',
    label: 'Push records to HCM.show',
    description: "Push this workbook's records into HCM.show",
    primary: true,
  },
  async (e) => {
    const { spaceId } = e.context;

    post({ path: `/api/v1/sync-space`, body: { spaceId } });
  }
);
