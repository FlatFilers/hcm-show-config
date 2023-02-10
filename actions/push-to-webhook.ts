import { Action } from '@flatfile/configure';
import https from 'https';

export const pushToWebhook = new Action(
  {
    slug: 'pushToWebhook',
    label: 'Push records to webhook site',
    description: "Push the ID of the space to a webhook listener",
  },
  async (e) => {
    try {
      const req = https.request({
        method: 'POST',
        protocol: 'https:',
        hostname: 'webhook.site',
        path: `/83498c47-9dd1-4351-b7af-59f767d66762`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = JSON.stringify({ e },null,2);
      req.write(body);
      req.end();
    } catch (err: unknown) {
      console.error(`Fetch error: ${JSON.stringify(err, null, 2)}`);
    }
  }
);
