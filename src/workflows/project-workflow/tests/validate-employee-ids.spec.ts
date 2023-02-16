import { SheetTester } from '@flatfile/configure';
import { Workbook } from '@flatfile/configure';

import Jobs from '../../../data-templates/hcm-templates/jobs';
import Employees from '../../../data-templates/hcm-templates/employees';

import { sampleRow } from '../../../utils/testing/sample-row';
import axios from 'axios';

jest.mock('../../../computes/batch/map-hire-reasons', () => {
  return {
    mapHireReasons: jest.fn(),
  };
});

jest.mock('axios', () => {
  return {
    get: jest.fn(),
  };
});

const workbook = new Workbook({
  name: 'HCM Workbook',
  slug: 'HCMWorkbook-2',
  namespace: 'HCM Workbook',
  sheets: {
    Jobs,
    Employees,
  },
});

describe('Workbook tests -> Validate employee IDs ->', () => {
  const testSheet = new SheetTester(workbook, 'Employees');

  test('if the API call fails', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({
      status: 400,
    });

    sampleRow['employeeId'] = 'invalid-id';
    sampleRow['managerId'] = 'invalid-id';

    const res = await testSheet.testMessage(sampleRow);

    // console.log('res', res);
    const employeeId = res.find((row) => row.field === 'employeeId');
    expect(employeeId?.message).toEqual(
      'Error - could not fetch employees from API to verify ID.'
    );

    const managerId = res.find((row) => row.field === 'managerId');
    expect(managerId?.message).toEqual(
      'Error - could not fetch employees from API to verify ID.'
    );
  });

  test('if the API call succeeds', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({
      status: 200,
      data: ['2000', '2001', '2002'],
    });

    sampleRow['employeeId'] = '2000';
    sampleRow['managerId'] = 'invalid-id';

    const res = await testSheet.testMessage(sampleRow);

    const employeeId = res.find((r) => r.field === 'employeeId');
    expect(employeeId?.message).toEqual(
      'This Employee ID already exists in HCM.show - this record will update the existing record on sync.'
    );

    const managerId = res.find((r) => r.field === 'managerId');
    expect(managerId?.message).toEqual(
      'Manager ID does not exist in HCM.show or the imported records.'
    );
  });
});
