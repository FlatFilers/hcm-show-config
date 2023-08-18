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
    // Logging the event for debugging purposes
    console.log('syncSpace | e: ' + JSON.stringify(event));

    // Extracting the spaceId from the event context
    const { spaceId } = event.context;

    // Getting the userId from the space using the getUserIdFromSpace utility function
    const userId = await getUserIdFromSpace(spaceId);

    // Making a POST request to 'hcm.show' API to sync the space
    return await post({
      path: `/api/v1/sync-space`,
      body: { userId, spaceId, workflowType },
      event,
    });
  };

  static fetchDepartments = async (
    event: FlatfileEvent
  ): Promise<DepartmentResult[]> => {
    let result;
    try {
      result = await get({
        path: '/api/v1/departments',
        params: {},
        event,
      });
    } catch (error) {
      result = [];
    }

    const departments = result as DepartmentResult[];

    console.log('Departments found: ' + JSON.stringify(departments));

    return departments;
  };
}
