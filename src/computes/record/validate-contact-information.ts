import { FlatfileRecord } from '@flatfile/hooks';
import {
  isNil,
  isNotNil,
  isFalsy,
} from '../../validations-plugins/common/helpers';

const phoneFields = [
  'phoneCountry',
  'internationalPhoneCode',
  'phoneNumber',
  'phoneExtension',
  'deviceType',
  'phonePublic',
  'phonePrimary',
  'phoneType',
  'phoneUseFor',
  'phoneId',
];

const emailFields = [
  'emailAddress',
  'emailComment',
  'emailPublic',
  'emailPrimary',
  'emailType',
  'emailUseFor',
  'emailId',
];

const addressFields = [
  'addressId',
  'addressEffectiveDate',
  'addressCountry',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'addressLine4',
  'addressLine5',
  'addressLine6',
  'addressLine7',
  'addressLine8',
  'addressLine9',
  'addressLine1Local',
  'addressLine2Local',
  'addressLine3Local',
  'addressLine4Local',
  'addressLine5Local',
  'addressLine6Local',
  'addressLine7Local',
  'addressLine8Local',
  'addressLine9Local',
  'municipality',
  'citySubdivision1',
  'citySubdivision2',
  'citySubdivision1Local',
  'citySubdivision2Local',
  'countryRegion',
  'RegionSubdivision1',
  'regionSubdivision2',
  'regionSubdivision1Local',
  'regionSubdivision2Local',
  'postalCode',
  'addressPublic',
  'addressPrimary',
  'addressType',
  'addressUseFor',
  'municipalityLocal',
];

export const validateContactInformation = (record: FlatfileRecord<any>) => {
  //Add validation for addressCountry, phoneNumber, or emailAddress is required for creation of Employee
  if (
    isNil(record.get('addressCountry')) &&
    isNil(record.get('phoneNumber')) &&
    isNil(record.get('emailAddress'))
  ) {
    const message =
      'One of the following contact methods is required: Address Country, Phone Number, or Email Address!';
    record.addError('addressCountry', message);
    record.addError('phoneNumber', message);
    record.addError('emailAddress', message);
  }
  //Add validation for addressCountry to be required if any other address field is provided
  const addressFieldsMinusCountry = addressFields.filter(
    (f) => f !== 'addressCountry'
  );
  const hasOtherAddressFields = addressFieldsMinusCountry.some((fieldName) =>
    isNotNil(record.get(fieldName))
  );

  if (hasOtherAddressFields && isNil(record.get('addressCountry'))) {
    record.addError(
      'addressCountry',
      'Address Country must be provided if any address fields are present.'
    );
  }

  //Add validation for phoneNumber to be required if any other phone field is provided
  const phoneFieldsMinusNumber = phoneFields.filter((f) => f !== 'phoneNumber');
  const hasOtherPhoneFields = phoneFieldsMinusNumber.some((fieldName) =>
    isNotNil(record.get(fieldName))
  );

  if (hasOtherPhoneFields && isFalsy(record.get('phoneNumber'))) {
    record.addError(
      'phoneNumber',
      'Phone Number must be provided if any phone fields are present.'
    );
  }

  //Add validation for emailAddress to be required if any other email field is provided
  const emailFieldsMinusAddress = emailFields.filter(
    (f) => f !== 'emailAddress'
  );
  const hasOtherEmailFields = emailFieldsMinusAddress.some((fieldName) =>
    isNotNil(record.get(fieldName))
  );

  if (hasOtherEmailFields && isNil(record.get('emailAddress'))) {
    record.addError(
      'emailAddress',
      'Email Address must be provided if any email fields are present.'
    );
  }

  //Add validation for addressPublic, addressPrimary, addressType to be required if addressCountry is provided
  if (isNotNil(record.get('addressCountry'))) {
    if (isNil(record.get('addressPublic'))) {
      record.addError(
        'addressPublic',
        'Address Public must be provided if Address Country is present.'
      );
    }
    if (isNil(record.get('addressPrimary'))) {
      record.addError(
        'addressPrimary',
        'Address Primary must be provided if Address Country is present.'
      );
    }
    if (isNil(record.get('addressType'))) {
      record.addError(
        'addressType',
        'Address Type must be provided if Address Country is present.'
      );
    }
  }

  //Add validation for phonePublic, phonePrimary, phoneType, deviceType, and either phoneCountry or internationalPhoneCode to be required if phoneNumber is provided
  if (isNotNil(record.get('phoneNumber'))) {
    if (isNil(record.get('phonePublic'))) {
      record.addError(
        'phonePublic',
        'Phone Public must be provided if Phone Number is present.'
      );
    }
    if (isNil(record.get('phonePrimary'))) {
      record.addError(
        'phonePrimary',
        'Phone Primary must be provided if Phone Number is present.'
      );
    }
    if (isNil(record.get('phoneType'))) {
      record.addError(
        'phoneType',
        'Phone Type must be provided if Phone Number is present.'
      );
    }
    if (isNil(record.get('deviceType'))) {
      record.addError(
        'deviceType',
        'Device Type must be provided if Phone Number is present.'
      );
    }
    if (
      isNil(record.get('phoneCountry')) &&
      isNil(record.get('internationalPhoneCode'))
    ) {
      record.addError(
        'phoneCountry',
        'Phone Country or International Phone Code must be provided if Phone Number is present.'
      );
      record.addError(
        'internationalPhoneCode',
        'Phone Country or International Phone Code must be provided if Phone Number is present.'
      );
    }
  }

  //Add validation for emailPublic, emailPrimary, emailType to be required if emailAddress is provided
  if (isNotNil(record.get('emailAddress'))) {
    if (isNil(record.get('emailPublic'))) {
      record.addError(
        'emailPublic',
        'Email Public must be provided if Email Address is present.'
      );
    }
    if (isNil(record.get('emailPrimary'))) {
      record.addError(
        'emailPrimary',
        'Email Primary must be provided if Email Address is present.'
      );
    }
    if (isNil(record.get('emailType'))) {
      record.addError(
        'emailType',
        'Email Type must be provided if Email Address is present.'
      );
    }
  }
};
