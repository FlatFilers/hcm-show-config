import { Blueprint } from '@flatfile/api';
import { RecordHook } from '@flatfile/configure';
import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener';
import { blueprintRaw as blueprint } from '../../blueprints/benefitsBlueprint';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';
import { post } from '../../utils/request';

const SHEET = 'sheet(benefit-elections-sheet)';

const demo = Client.create((client) => {
  client.on('client:init', async (event) => {
    // creates a shell spaceConfig - this will change to 'namespace'
    const spaceConfig = await client.api.addSpaceConfig({
      spacePatternConfig: blueprint,
    });
  });

  client.on('records:*', { target: SHEET }, async (event: FlatfileEvent) => {
    console.log('LISTENER | ');
    console.log('record event: ' + JSON.stringify(event));

    const { spaceId } = event.context;
    const topic = event.topic;

    // const apiToken = await event.api.getAccessToken({
    //   apiCredentials: {
    //     clientId: testParams.clientId,
    //     secret: testParams.secret,
    //   },
    // });
    // console.log('api token: ' + apiToken);
    // console.log('access token: ' + JSON.stringify(await getAccessToken()));
    // console.log('sheetId: ' + sheetId);
    // console.log('workbookId: ' + workbookId);

    post({
      hostname: 'hcm.show',
      // hostname: '7dc0-64-145-94-253.ngrok-free.app',
      path: '/api/v1/sync-file-feed',
      body: { spaceId, topic },
    });

    console.log('Posted to HCM.show');

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
  });

  client.on(
    'upload:*', //listens for upload:completed
    (event: FlatfileEvent) => {
      console.log('upload completed: ' + JSON.stringify(event));
      //do something here
    }
  );

  // workflow assumes file is loaded via API: POST v1/files
  client.on('upload:*', async (event) => {
    return new ExcelExtractor(event as any, {
      rawNumbers: true,
    }).runExtraction();
  });
});

const FlatfileVM = new FlatfileVirtualMachine();
demo.mount(FlatfileVM);
export default demo;
