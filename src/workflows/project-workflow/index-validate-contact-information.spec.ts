import { SheetTester } from '@flatfile/configure';
import { Workbook } from '@flatfile/configure';

import Jobs from '../../data-templates/hcm-templates/jobs';
import Employees from '../../data-templates/hcm-templates/employees';

import { sampleRow } from '../../utils/testing/sample-row';

jest.mock('axios', () => {
  return {
    get: jest.fn().mockResolvedValue({
      status: 200,
      data: ['abc123', 'def456'],
    }),
    post: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
          originalString: 'New Hire',
          id: 'abc123',
        },
        {
          originalString: 'New Hire',
          id: 'def456',
        },
      ],
    }),
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

describe('Workbook tests -> Validate contact information ->', () => {
  const testSheet = new SheetTester(workbook, 'Employees');

  test('address, phone, or email is required', async () => {
    sampleRow['addressCountry'] = '    ';
    sampleRow['phoneNumber'] = null;
    sampleRow['emailAddress'] = undefined;

    const res = await testSheet.testMessage(sampleRow);

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
    sampleRow['phoneNumber'] = '(415) 441-7842';
    sampleRow['addressCountry'] = '    ';
    sampleRow['addressLine1'] = '42 Laurel Street';

    const res = await testSheet.testMessage(sampleRow);

    const addressCountry = res.find((row) => row.field === 'addressCountry');
    expect(addressCountry?.message).toEqual(
      'Address Country must be provided if any address fields are present.'
    );
  });

  test('phoneNumber is required if there are any phone fields present', async () => {
    sampleRow['addressCountry'] = 'USA';
    sampleRow['phoneNumber'] = '    ';
    sampleRow['phoneId'] = '12345';

    const res = await testSheet.testMessage(sampleRow);

    const phoneNumber = res.find((row) => row.field === 'phoneNumber');
    expect(phoneNumber?.message).toEqual(
      'Phone Number must be provided if any phone fields are present.'
    );
  });

  test('emailAddress is required if there are any email fields present', async () => {
    sampleRow['addressCountry'] = 'USA';
    sampleRow['emailAddress'] = null;
    sampleRow['emailId'] = '12345';

    const res = await testSheet.testMessage(sampleRow);

    const emailAddress = res.find((row) => row.field === 'emailAddress');
    expect(emailAddress?.message).toEqual(
      'Email Address must be provided if any email fields are present.'
    );
  });

  test('if addressCountry is present addressPublic, addressPrimary, and addressType are required', async () => {
    sampleRow['addressCountry'] = 'USA';
    sampleRow['addressPublic'] = null;
    sampleRow['addressPrimary'] = null;
    sampleRow['addressType'] = null;

    const res = await testSheet.testMessage(sampleRow);

    const addressPublic = res.find((row) => row.field === 'addressPublic');
    expect(addressPublic?.message).toEqual(
      'Address Public must be provided if Address Country is present.'
    );
    const addressPrimary = res.find((row) => row.field === 'addressPrimary');
    expect(addressPrimary?.message).toEqual(
      'Address Primary must be provided if Address Country is present.'
    );
    const addressType = res.find((row) => row.field === 'addressType');
    expect(addressType?.message).toEqual(
      'Address Type must be provided if Address Country is present.'
    );
  });

  test('if phoneNumber is present phonePublic, phonePrimary, phoneType, deviceType, and either phoneCountry or internationalPhoneCode are required', async () => {
    const d = {
      ...sampleRow,
      phoneNumber: '123-123-1234',
      phonePublic: null,
      phonePrimary: null,
      phoneType: null,
      deviceType: null,
      phoneCountry: null,
      internationalPhoneCode: null,
    };

    const res = await testSheet.testMessage(d);

    const phonePublic = res.find((row) => row.field === 'phonePublic');
    expect(phonePublic?.message).toEqual(
      'Phone Public must be provided if Phone Number is present.'
    );
    const phonePrimary = res.find((row) => row.field === 'phonePrimary');
    expect(phonePrimary?.message).toEqual(
      'Phone Primary must be provided if Phone Number is present.'
    );
    const phoneType = res.find((row) => row.field === 'phoneType');
    expect(phoneType?.message).toEqual(
      'Phone Type must be provided if Phone Number is present.'
    );
    const deviceType = res.find((row) => row.field === 'deviceType');
    expect(deviceType?.message).toEqual(
      'Device Type must be provided if Phone Number is present.'
    );
    const phoneCountry = res.find((row) => row.field === 'phoneCountry');
    expect(phoneCountry?.message).toEqual(
      'Phone Country or International Phone Code must be provided if Phone Number is present.'
    );
    const internationalPhoneCode = res.find(
      (row) => row.field === 'internationalPhoneCode'
    );
    expect(internationalPhoneCode?.message).toEqual(
      'Phone Country or International Phone Code must be provided if Phone Number is present.'
    );
  });

  test('if emailAddress is present emailPublic, emailPrimary, emailType are required', async () => {
    sampleRow['emailAddress'] = 'user@example.com';
    sampleRow['emailPublic'] = null;
    sampleRow['emailPrimary'] = null;
    sampleRow['emailType'] = null;

    const res = await testSheet.testMessage(sampleRow);

    const emailPublic = res.find((row) => row.field === 'emailPublic');
    expect(emailPublic?.message).toEqual(
      'Email Public must be provided if Email Address is present.'
    );
    const emailPrimary = res.find((row) => row.field === 'emailPrimary');
    expect(emailPrimary?.message).toEqual(
      'Email Primary must be provided if Email Address is present.'
    );
    const emailType = res.find((row) => row.field === 'emailType');
    expect(emailType?.message).toEqual(
      'Email Type must be provided if Email Address is present.'
    );
  });
});
