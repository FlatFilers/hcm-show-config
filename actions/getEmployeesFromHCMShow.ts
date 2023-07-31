import { get } from '../common/utils/request';
import { getUserIdFromSpace } from '../common/utils/flatfile-api';
import { FlatfileEvent } from '@flatfile/listener';

// Function to get list of Employees from HcmShow
export const getEmployeesFromHCMShow = async (event: FlatfileEvent) => {
  // Logging the event for debugging purposes
  console.log('getEmployeesFromHCMShow | e: ' + JSON.stringify(event));

  // Extracting the spaceId from the event context
  const { spaceId } = event.context;

  // Getting the userId from the space using the getUserIdFromSpace utility function
  const userId = await getUserIdFromSpace(spaceId);

  // Making a GET request to 'hcm.show' API to get a list of employees for the input user
  return await get({
    hostname: 'hcm.show',
    path: `/api/v1/list-employees`,
    params: { userId },
  });
};
