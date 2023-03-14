import {
  ValidationMessageSourceEnum,
  ValidationMessageTypeEnum,
} from '@flatfile/api';
import { Action } from '@flatfile/configure';
import https from 'https';

export const validateEmployeeIds = new Action(
  {
    slug: 'validateEmployeeIds',
    label: 'Validate Employee IDs',
    description: 'Validate Employee IDs with those in HCM.show',
  },
  async (e) => {
    const { workbookId, spaceId, sheetId } = e.context;

    const recordsResponse = await e.api.getRecords({
      workbookId,
      sheetId,
    });

    if (!recordsResponse.data?.records) {
      console.log('No records found in sheet');
      return;
    }

    const employeeIds = await fetchEmployeeIds(spaceId);

    recordsResponse.data.records.forEach((record) => {
      console.log(record);

      if (employeeIds.includes(record.values.employeeId.value as string)) {
        const message = {
          message:
            'Employee ID already exists in HCM.show. This record will be updated.',
          type: ValidationMessageTypeEnum.Warn,
          source: ValidationMessageSourceEnum.CustomLogic,
        };

        record.values['employeeId'] = {
          value: 'Pending',
          messages: [message],
        };
      }
    });
  }
);

const fetchEmployeeIds = async (spaceId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'GET',
      protocol: 'https:',
      hostname: 'hcm.show',
      path: `/api/v1/employees?spaceId=${spaceId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    req.on('response', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};
