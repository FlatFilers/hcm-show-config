import { Action } from '@flatfile/configure';
import https from 'https';

export const pushToHcmShow = new Action(
  {
    slug: 'pushToHcmShow',
    label: 'Push records to HCM.show',
    description: "Push this workbook's records into HCM.show",
  },
  async (e) => {
    const { spaceId } = e.context;
    try {
      const req = https.request({
        method: 'POST',
        protocol: 'https:',
        hostname: 'hcm.show',
        path: `/api/v1/sync-space`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = JSON.stringify({ spaceId });
      req.write(body);
      req.end();
    } catch (err: unknown) {
      console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
    }
  }
);
