import { SheetTester } from '@flatfile/configure';
import { Workbook } from '@flatfile/configure';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';

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

describe('Workbook tests ->', () => {
  const testSheet = new SheetTester(workbook, 'Employees');

  test('address, phone, or email is required', async () => {
    inputRow['addressCountry'] = '    ';
    inputRow['phoneNumber'] = null;
    inputRow['emailAddress'] = undefined;

    const res = await testSheet.testMessage(inputRow);

    const addressCountry = res.find((row) => row.field === 'addressCountry');
    expect(addressCountry?.message).toEqual(
      'One of the following contact methods is required: Address Country, Phone Number, or Email Address!'
    );
    const phoneNumber = res.find((row) => row.field === 'phoneNumber');
    expect(phoneNumber?.message).toEqual(
      'One of the following contact methods is required: Address Country, Phone Number, or Email Address!'
    );
    const emailAddress = res.find((row) => row.field === 'emailAddress');
    expect(emailAddress?.message).toEqual(
      'One of the following contact methods is required: Address Country, Phone Number, or Email Address!'
    );
  });

  test('addressCountry is required if there are any address fields present', async () => {
    inputRow['phoneNumber'] = '(415) 441-7842';
    inputRow['addressCountry'] = '    ';
    inputRow['addressLine1'] = '42 Laurel Street';

    const res = await testSheet.testMessage(inputRow);

    const addressCountry = res.find((row) => row.field === 'addressCountry');
    expect(addressCountry?.message).toEqual(
      'Address Country must be provided if any address fields are present.'
    );
  });

  test('phoneNumber is required if there are any phone fields present', async () => {
    inputRow['addressCountry'] = 'USA';
    inputRow['phoneNumber'] = '    ';
    inputRow['phoneId'] = '12345';

    const res = await testSheet.testMessage(inputRow);

    const phoneNumber = res.find((row) => row.field === 'phoneNumber');
    expect(phoneNumber?.message).toEqual(
      'Phone Number must be provided if any phone fields are present.'
    );
  });

  test('emailAddress is required if there are any email fields present', async () => {
    inputRow['addressCountry'] = 'USA';
    inputRow['emailAddress'] = null;
    inputRow['emailId'] = '12345';

    const res = await testSheet.testMessage(inputRow);

    const emailAddress = res.find((row) => row.field === 'emailAddress');
    expect(emailAddress?.message).toEqual(
      'Email Address must be provided if any email fields are present.'
    );
  });
});
