import { FlatfileEvent } from '@flatfile/listener';
import { getUserIdFromSpace } from './utils/flatfile-api';
import { get, post } from './utils/request';

type DepartmentResult = {
  id: string;
  departmentName: string;
  departmentCode: string;
};

export class HcmShowApiService {
  static syncSpace = async (
    event: FlatfileEvent,
    // Temporary solution until react package can open the same space that is saved in HCM.
    workflowType?: string
  ) => {
    console.log('syncSpace in HCM.show | e: ' + JSON.stringify(event));

    // Extracting the spaceId from the event context
    const { spaceId } = event.context;

    // Getting the userId from the space using the getUserIdFromSpace utility function
    const userId = await getUserIdFromSpace(spaceId);

    // Making a POST request to 'hcm.show' API to sync the space
    return await post({
      path: `/api/v1/sync-space`,
      body: { userId, spaceId, workflowType },
      headers: this.headers(event),
    });
  };

  static syncFilefeed = async (event: FlatfileEvent) => {
    console.log('Syncing filefeed in HCM.show.');

    const { spaceId } = event.context;
    const topic = event.topic;

    return await post({
      path: '/api/v1/sync-file-feed',
      body: { spaceId, topic },
      headers: await this.headers(event),
    });
  };

  static fetchDepartments = async (
    event: FlatfileEvent
  ): Promise<DepartmentResult[]> => {
    console.log('Fetching departments from HCM.show');

    let result;
    try {
      result = await get({
        path: '/api/v1/departments',
        params: {},
        headers: await this.headers(event),
      });
    } catch (error) {
      result = [];
    }

    const departments = result as DepartmentResult[];

    console.log('Departments found: ' + JSON.stringify(departments));

    return departments;
  };

  private static headers = async (event: FlatfileEvent) => {
    const serverAuthToken = await this.getServerAuthToken(event);

    return {
      headers: {
        'Content-Type': 'application/json',
        'x-server-auth': serverAuthToken,
      },
    };
  };

  private static getServerAuthToken = async (event: FlatfileEvent) => {
    let serverAuthToken;

    try {
      serverAuthToken = await event.secrets('SERVER_AUTH_TOKEN');
    } catch (e) {
      const message = 'FAILED FETCH SERVER AUTH TOKEN';
      console.error(message);
      throw new Error(message);
    }

    return serverAuthToken;
  };
}
