import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener';
import { post } from '../utils/request';
import { getAccessToken } from '../utils/flatfile-api';

const SHEET_NAME = 'sheet(Employees)';

const UploadListener = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */
  client.on(
    'records:*',
    { target: SHEET_NAME },
    async (event: FlatfileEvent) => {
      // console.log('record event: ' + JSON.stringify(event));

      const { spaceId, sheetId } = event.context;
      const topic = event.topic;

      console.log('LISTENER');
      // const apiToken = await event.api.getAccessToken({
      //   apiCredentials: {
      //     clientId: testParams.clientId,
      //     secret: testParams.secret,
      //   },
      // });
      // console.log('api token: ' + apiToken);
      console.log('access token: ' + JSON.stringify(await getAccessToken()));
      // console.log('sheetId: ' + sheetId);
      // console.log('workbookId: ' + workbookId);

      // post({
      //   hostname: '9a6d215ded38.ngrok.app',
      //   path: '/api/v1/sync-file-feed',
      //   body: { spaceId, topic },
      // });

      // const records = await event.api.getRecords({ sheetId });

      // console.log('Records are: ', JSON.stringify(records));

      // if (topic === 'records:created' || topic === 'records:updated') {
      //   console.log('create or update event');
      //   const recordIds = [];

      //   event.payload.records.forEach((record) => {
      //     if (record.valid) {
      //       recordIds.push(record.id);
      //     }
      //   });

      //   console.log('Deleting valid records: ', recordIds.length);

      //   // event.api.deleteRecords({
      //   //   workbookId,
      //   //   sheetId,
      //   //   ids: recordIds,
      //   // });
      //   // //do something here
      // }
    }
  );

  client.on(
    'upload:*', //listens for upload:completed
    (event: FlatfileEvent) => {
      console.log('upload completed: ' + JSON.stringify(event));
      //do something here
    }
  );

  /**
   * This deploys the agent to the Environment.
   * Note it will override agents/custom actions in your environment.
   * Suggest using isolated Environment when using listener
   */
  client.on('client:init', async (event) => {
    //deploys the agent
    console.log(
      'Deployed Agent to environment: ' + JSON.stringify(event.context)
    );
  });
});

const FlatfileVM = new FlatfileVirtualMachine();

UploadListener.mount(FlatfileVM);

export default UploadListener;
