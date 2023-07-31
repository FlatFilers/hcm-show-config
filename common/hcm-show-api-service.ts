import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';

type DepartmentResult = {
  id: string;
  departmentName: string;
  departmentCode: string;
};

export class HcmShowApiService {
  static BASE_URL = 'https://hcm.show';
  // static BASE_URL = 'https://206d-205-185-214-250.ngrok-free.app';

  static fetchDepartments = async (
    event: FlatfileEvent
  ): Promise<DepartmentResult[]> => {
    let response;

    try {
      response = await axios.get(`${this.BASE_URL}/api/v1/departments`, {
        headers: {
          'x-server-auth': await event.secrets('SERVER_AUTH_TOKEN'),
        },
      });
    } catch (error) {
      console.error(
        'Error fetching departments from HCM.show: ' + JSON.stringify(error)
      );
      return [];
    }

    if (response.status !== 200) {
      console.error(
        'Request to fetching departments from HCM.show was not successful: ' +
          JSON.stringify(response)
      );
      return [];
    }

    const departments = response.data as DepartmentResult[];

    console.log('Departments found: ' + JSON.stringify(departments));

    return departments;
  };
}
