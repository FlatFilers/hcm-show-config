import {
  Client,
  FlatfileVirtualMachine,
  FlatfileEvent,
} from '@flatfile/listener';
import { post } from '../utils/request';

const SHEET_NAME = 'sheet(Employees)';

const UploadListener = Client.create((client) => {
  /**
   * This is a basic hook on events with no sugar on top
   */
  client.on('records:*', { target: SHEET_NAME }, (event: FlatfileEvent) => {
    console.log('record event: ' + JSON.stringify(event));

    const { spaceId } = event.context;
    const topic = event.topic;

    post({
      hostname: 'f9202822117b.ngrok.app',
      path: '/api/v1/sync-file-feed',
      body: { spaceId, topic },
    });
  });

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
