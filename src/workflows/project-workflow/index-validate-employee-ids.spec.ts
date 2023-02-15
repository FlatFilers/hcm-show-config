import { SheetTester } from '@flatfile/configure';
import { Workbook } from '@flatfile/configure';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// jest.mock('axios');
// const mock = new MockAdapter(axios);

const inputRow: { [key: string]: string | number | null | undefined } = {
  employeeId: null,
  managerId: '21431',
  nameCountry: 'United States of America',
  title: null,
  firstName: 'Logan',
  middleName: null,
  lastName: 'McNeil',
  socialSuffix: null,
  employeeType: null,
  hireReason: null,
  hireDate: '1/1/2000',
  endEmploymentDate: null,
  jobCode: null,
  positionTitle: 'Vice President, Human Resources',
  businessTitle: 'Vice President, Human Resources',
  location: null,
  workspace: null,
  positionTimeType: null,
  workShift: null,
  defaultWeeklyHours: 40,
  scheduledWeeklyHours: 40,
  payRateType: null,
  additionalJobClassification: null,
  workerCompensationCode: null,
  addressId: null,
  addressEffectiveDate: '3/25/2008',
  addressCountry: null,
  addressLine1: null,
  // addressLine1: '42 Laurel Street',
  addressLine2: null,
  addressLine3: null,
  addressLine4: null,
  addressLine5: null,
  addressLine6: null,
  addressLine7: null,
  addressLine8: null,
  addressLine9: null,
  addressLine1Local: null,
  addressLine2Local: null,
  addressLine3Local: null,
  addressLine4Local: null,
  addressLine5Local: null,
  addressLine6Local: null,
  addressLine7Local: null,
  addressLine8Local: null,
  addressLine9Local: null,
  addressPublic: null,
  addressPrimary: null,
  addressType: null,
  municipality: null,
  citySubdivision1: null,
  citySubdivision2: null,
  citySubdivision1Local: null,
  citySubdivision2Local: null,
  countryRegion: 'California',
  RegionSubdivision1: null,
  regionSubdivision2: null,
  regionSubdivision1Local: null,
  regionSubdivision2Local: null,
  postalCode: '94118',
  addressUseFor: null,
  municipalityLocal: null,
  phoneId: null,
  phoneCountry: null,
  internationalPhoneCode: null,
  // phoneNumber: '(415) 441-7842',
  phoneNumber: null,
  phoneExtension: null,
  deviceType: null,
  phonePublic: null,
  phonePrimary: null,
  phoneType: null,
  phoneUseFor: null,
  emailId: null,
  // emailAddress: 'lmcneil@workday.net',
  emailAddress: null,
  emailComment: null,
  emailPublic: null,
  emailPrimary: null,
  emailType: null,
  emailUseFor: null,
};

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

  // test('if the API call fails', async () => {
  //   const mock = {
  //     status: 400,
  //   };

  //   // @ts-ignore
  //   axios.get.mockResolvedValue(mock);

  //   expect(testSheet.testMessage(inputRow)).rejects.toThrow(
  //     'Error fetching employees'
  //   );
  // });

  test('if the API call succeeds', async () => {
    const m = new MockAdapter(axios);
    m.onPost('https://hcm.show/api/v1/hire-reasons').reply(200, [
      {
        originalString: 'New Hire',
        id: 'abc123',
      },
      {
        originalString: 'Hire Employee > New Hire > New Position',
        id: 'def456',
      },
    ]);

    // @ts-ignore
    // axios.get.mockResolvedValue(mock);
    m.onGet('https://hcm.show/api/v1/employees').reply(200, [
      '2000',
      '2001',
      '2002',
    ]);

    inputRow['employeeId'] = '2000';
    inputRow['managerId'] = 'invalid-id';

    const res = await testSheet.testMessage(inputRow);

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
