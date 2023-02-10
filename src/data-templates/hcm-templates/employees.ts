import * as FF from '@flatfile/configure';
import { SmartDateField } from '../fields/SmartDateField';
import { FlatfileRecord, FlatfileRecords, TPrimitive } from '@flatfile/hooks';
import { emailReg } from '../../validations-plugins/regex/regex';
import { validateRegex } from '../../validations-plugins/common/common';
import {
  isFalsy,
  isNil,
  isNotNil,
} from '../../validations-plugins/common/helpers';
const axios = require('axios');

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

async function executeValidation(event: any) {
  const workbookId = event.context.workbookId;
  const sheetId = event.context.sheetId;

  try {
    await axios.post(
      `v1/workbooks/${workbookId}/sheets/${sheetId}/validate`,
      {}
    );
  } catch (error) {
    console.log(`validation error: ${JSON.stringify(error, null, 2)}`);
  }
}

const executeValidationAction = new FF.Action(
  {
    slug: 'executeValidation',
    label: 'Execute Validation',
    description: 'Executes Validations on the Data in this Sheet',
  },
  async (e) => {
    try {
      await executeValidation(e);
    } catch (error) {
      console.log(
        `executeValidationAction[error]: ${JSON.stringify(error, null, 2)}`
      );
    }
  }
);

const Employees = new FF.Sheet(
  'Employees',
  {
    //Validations
    //Enter a unique Employee ID. The ID is already in use by [Employee][EmployeeNew].
    //Validate against exisitng Employee in DB - call out the ID already exists & this would be an update and not a create

    employeeId: FF.TextField({
      label: 'Employee ID',
      description: 'Unique Identifier for a Employee.',
      primary: true,
      required: true,
      unique: true,
    }),

    // This will need to be a valid Employee ID from either the DB or the existing dataset.

    managerId: FF.TextField({
      label: 'Manager ID',
      description: "The Employee ID for the Employee's Manager",
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB

    nameCountry: FF.TextField({
      label: 'Name Country',
      description: 'The Country that the name is in reference to.',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validations
    //Title is not set up for this country. (Country Name Requirements)
    //[title] is not a valid title value for [country]. (nameCountry + title)
    //Title is required for this country. (Country Name Requirements)

    title: FF.TextField({
      label: 'Title',
      description: 'Contains the prefixes for a name.',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validations
    //First Name is not set up for this country. (Country Name Requirements)
    //First Name is required for this country. (Country Name Requirements)

    firstName: FF.TextField({
      label: 'First Name',
      description: 'The First Name (Given Name) for a person. ',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validations
    //Middle Name is not set up for this country. (Country Name Requirements)
    //Middle Name is required for this country. (Country Name Requirements)

    middleName: FF.TextField({
      label: 'Middle Name',
      description: 'The Middle Name for a person. ',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validations
    //Last Name is not set up for this country. (Country Name Requirements)
    //Last Name is required for this country. (Country Name Requirements)

    lastName: FF.TextField({
      label: 'Last Name',
      description: 'The Last Name (Family Name) for a person. ',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validations
    //Social Suffix is not set up for this country. (Country Name Requirements)
    //[social suffix] is not a valid social suffix value for [country]. (nameCountry + title)
    //Social Suffix is required for this country. (Country Name Requirements)

    socialSuffix: FF.TextField({
      label: 'Social Suffix',
      description: 'Contains the suffixes for a name.',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid Employee Type based on the list of Employee Types configured in DB

    employeeType: FF.TextField({
      label: 'Employee Type',
      description: "The worker's employee type.",
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Hire Reason based on the list of Event Categories and Reasons configured in DB

    hireReason: FF.TextField({
      label: 'Hire Reason',
      description: 'The reason for hiring the worker.',
      primary: false,
      required: true,
      unique: false,
    }),

    //May need to check for dates in future or set a cutoff for dates

    hireDate: SmartDateField({
      label: 'Hire Date',
      formatString: 'yyyy-MM-dd',
      description:
        "The worker's Hire Date. The Hire Date must be on or after the effective date of any changes to the position or location.",
      primary: false,
      required: true,
      unique: false,
    }),

    // Validations
    //End Employment Date must be after Hire Date.
    //The end employment date is required for Fixed Term employees types and cannot be entered for non-fixed term employee types.

    endEmploymentDate: SmartDateField({
      label: 'End Employment Date',
      formatString: 'yyyy-MM-dd',
      description:
        'The End Employment Date for the position of fixed term or temporary employees.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Validate that hire date is on or after effective date of Job Code, Customer file will likely have job name or legacy code - how will we plan to map values using reference field if keys are not aligned?

    jobCode: FF.ReferenceField({
      label: 'Job Code',
      description: 'The Job Profile for the Employee.',
      sheetKey: 'Jobs',
      foreignKey: 'jobName',
      relationship: 'has-many',
      primary: false,
      required: true,
      unique: false,
    }),

    // If left blank, will default to job code title

    positionTitle: FF.TextField({
      label: 'Position Title',
      description: "The Position Title of the Employee's position.",
      primary: false,
      required: false,
      unique: false,
    }),

    // If left blank, will default to position title

    businessTitle: FF.TextField({
      label: 'Business Title',
      description: "The Position Title of the Employee's position.",
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid Business Site based on the list of Locations configured in DB

    location: FF.TextField({
      label: 'Location',
      description: 'The Location of the Employee.',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validation
    //Select another location. The work space isn't valid for this location: [work space1][work space2]
    //Work space must be active.
    //The field is required for location and can't be blank: Work Space. Specify a value for the field.
    //This will need to be a valid Workspace based on the list of Locations configured in DB (if Location Usage = Business Site and validate that Superior Location = Location)

    workspace: FF.TextField({
      label: 'Workspace',
      description: "The physical location of the worker's position.",
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid time type based on the list of time types configured in DB

    positionTimeType: FF.TextField({
      label: 'Position Time Type',
      description:
        'The time type for the Employee. Example: part time or full time.',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validation
    //Work shift is not valid for the location.
    //This will need to be validated based on the ID Value and Workshift Country = Country of Location.

    workShift: FF.TextField({
      label: 'Work Shift',
      description: 'The Work Shift of the Employee',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validation
    //May default to Locations hours
    //Enter a value of 168 hours or fewer.

    defaultWeeklyHours: FF.NumberField({
      label: 'Default Weekly Hours',
      description: 'The default weekly hours of the Employee',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validation
    //May default to Locations hours
    //FTE must be 999 or less.
    //The scheduled weekly hours cannot be negative.
    //Enter a value of 168 hours or fewer.

    scheduledWeeklyHours: FF.NumberField({
      label: 'Scheduled Weekly Hours',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validation
    //This will need to be a valid Pay Rate based on the list of Pay Rate Types configured in DB
    //Enter an active Pay Rate Type.

    payRateType: FF.TextField({
      label: 'Pay Rate Type',
      description:
        'Contains a reference that identifies a specific instance of Pay Rate Type to retrieve for the Employee',
      primary: false,
      required: true,
      unique: false,
    }),

    //Validation
    //Multi-Select field. This will need to be a valid Job Classification based on the list of Job Classifications configured in DB
    //Additional Job Classifications are not valid for the Location

    additionalJobClassification: FF.TextField({
      label: 'Additional Job Classification',
      description: 'The Job Classifications that can be used for the position',
      primary: false,
      required: false,
      unique: false,
    }),

    // Multi-Select field. This will need to be a valid Worker Compensation Code based on the list of Worker Compensation Codes configured in DB

    workerCompensationCode: FF.TextField({
      label: 'Worker Compensation Code',
      description:
        "The worker's Compensation Code Override. The Compensation Code Override replaces the worker's compensation code. If a value is never entered, Workday will use the value from the Job Profile.",
      primary: false,
      required: false,
      unique: false,
    }),

    //If empty, system defaults to today

    addressEffectiveDate: SmartDateField({
      label: 'Effective Date',
      formatString: 'yyyy-MM-dd',
      description: 'Effective date of address.',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, if any address field is provided - this is field is required

    addressCountry: FF.TextField({
      label: 'Address Country',
      description: 'Country for the address.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Address Line Fields - requirements will be by Country and determined by Countries and their Address Components
    // Address Line Fields - Accepted fields will be by Country and determined by Countries and their Address Components

    addressLine1: FF.TextField({
      label: 'Address Line 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    addressLine2: FF.TextField({
      label: 'Address Line 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine3: FF.TextField({
      label: 'Address Line 3',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine4: FF.TextField({
      label: 'Address Line 4',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine5: FF.TextField({
      label: 'Address Line 5',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine6: FF.TextField({
      label: 'Address Line 6',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine7: FF.TextField({
      label: 'Address Line 7',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine8: FF.TextField({
      label: 'Address Line 8',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine9: FF.TextField({
      label: 'Address Line 9',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    addressLine1Local: FF.TextField({
      label: 'Address Line 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    addressLine2Local: FF.TextField({
      label: 'Address Line 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine3Local: FF.TextField({
      label: 'Address Line 3 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine4Local: FF.TextField({
      label: 'Address Line 4 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine5Local: FF.TextField({
      label: 'Address Line 5 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine6Local: FF.TextField({
      label: 'Address Line 6 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine7Local: FF.TextField({
      label: 'Address Line 7 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine8Local: FF.TextField({
      label: 'Address Line 8 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    addressLine9Local: FF.TextField({
      label: 'Address Line 9 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    municipality: FF.TextField({
      label: 'Municipality',
      description: 'City part of the address.',
      primary: false,
      required: false,
      unique: false,
    }),
    citySubdivision1: FF.TextField({
      label: 'City Subdivision 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    citySubdivision2: FF.TextField({
      label: 'City Subdivision 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    citySubdivision1Local: FF.TextField({
      label: 'City Subdivision 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    citySubdivision2Local: FF.TextField({
      label: 'City Subdivision 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country region based on the list of Country Regions configured in DB, the region must also be valid for the Country (ex: USA-CA is valid for USA, USA-CA is not valid for CAN)

    countryRegion: FF.TextField({
      label: 'Country Region',
      description:
        'The region part of the address. Typically this contains the state/province information.',
      primary: false,
      required: false,
      unique: false,
    }),
    RegionSubdivision1: FF.TextField({
      label: 'Region Subdivision 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    regionSubdivision2: FF.TextField({
      label: 'Region Subdivision 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    regionSubdivision1Local: FF.TextField({
      label: 'Region Subdivision 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    regionSubdivision2Local: FF.TextField({
      label: 'Region Subdivision 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validations
    //Must be validated by Country (had previously used npm package)
    //[postal code] is not a valid postal code for [region]
    //Enter a postal code in the valid format: [PostalCodeValidationMessage]
    // Postal Code is required for [countryWithMustHavePostalCode]
    postalCode: FF.TextField({
      label: 'Postal Code',
      description: 'The postal code part of the address. ',
      primary: false,
      required: false,
      unique: false,
    }),

    // If Type = Home - Public = False, Type = Work - Public = True

    addressPublic: FF.BooleanField({
      label: 'Address Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one Address can be primary by type

    addressPrimary: FF.BooleanField({
      label: 'Address Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    addressType: FF.OptionField({
      label: 'Address Type',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        HOME: 'Home',
        WORK: 'Work',
      },
    }),

    // Sourced from Communication Usage Behavior Type in DB, Valid values are driven by Type (ex: Other - Home can only be used for Home types & Other - Work can only be used for Work types)

    addressUseFor: FF.TextField({
      label: 'Address Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //Requirements will be by Country and determined by Countries and their Address Components

    municipalityLocal: FF.TextField({
      label: 'Municipality Local',
      description: 'City in local script part of the address.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Will need to check against DB and / or Autogenerated

    addressId: FF.TextField({
      label: 'Address ID',
      description:
        'New ID value used in address updates. The ID cannot already be in use by another address.',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, this becomes required if any other phone field is provided

    phoneCountry: FF.TextField({
      label: 'Phone Country',
      description:
        'Country ISO code. If the Country ISO code is specified, then this ISO code will be used to determine the Country Phone Code for (eliminate space between f and o) the phone. Pass this ISO code to distinguish between multiple countries sharing the same Country Phone Code. (For example, 1 is the Country Phone Code that is shared by USA, Canada, Dominican Republic, Bermuda, Jamaica, and Puerto Rico.) ',
      primary: false,
      required: false,
      unique: false,
    }),

    // May be a lookup field based on Country

    internationalPhoneCode: FF.NumberField({
      label: 'International Phone Code',
      description: 'International phone code number. ',
      primary: false,
      required: false,
      unique: false,
    }),

    //Validation
    //Numbers only, must match format specified by country - have used npm package in the past for this
    //Can we "clean" this field to remove all foreign characters, but present the original value in an info message?

    phoneNumber: FF.NumberField({
      label: 'Phone Number',
      description: 'Full phone number.',
      primary: false,
      required: false,
      unique: false,
    }),
    phoneExtension: FF.TextField({
      label: 'Phone Extension',
      description: 'Phone extension.',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid device type based on the list of Phone Device Types configured in DB, this becomes required if any other phone field is provided

    deviceType: FF.TextField({
      label: 'Device Type',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    // If Type = Home - Public = False, Type = Work - Public = True

    phonePublic: FF.BooleanField({
      label: 'Phone Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one phone can be primary by type

    phonePrimary: FF.BooleanField({
      label: 'Phone Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    phoneType: FF.OptionField({
      label: 'Phone Type',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        HOME: 'Home',
        WORK: 'Work',
      },
    }),

    // Can only be Billing or Shipping regardless of type

    phoneUseFor: FF.OptionField({
      label: 'Phone Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        BILLING: 'Billing',
        SHIPPING: 'Shipping',
      },
    }),

    // Will need to check against DB and / or Autogenerated

    phoneId: FF.TextField({
      label: 'Phone ID',
      description:
        'New ID value used in phone updates. The ID cannot already be in use by another phone.',
      primary: false,
      required: false,
      unique: false,
    }),

    //Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com.

    emailAddress: FF.TextField({
      label: 'Email Address',
      description: '	Email Address Information ',
      primary: false,
      required: false,
      unique: false,
      validate: (v: string) => {
        return validateRegex(
          v,
          emailReg,
          "Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com."
        );
      },
    }),
    emailComment: FF.TextField({
      label: 'Email Comment',
      description: 'Email comments.',
      primary: false,
      required: false,
      unique: false,
    }),
    // If Type = Home - Public = False, Type = Work - Public = True

    emailPublic: FF.BooleanField({
      label: 'Email Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one email can be primary by type

    emailPrimary: FF.BooleanField({
      label: 'Email Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    emailType: FF.OptionField({
      label: 'Email Type',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        HOME: 'Home',
        WORK: 'Work',
      },
    }),

    // Can only be Billing or Shipping regardless of type

    emailUseFor: FF.OptionField({
      label: 'Email Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        BILLING: 'Billing',
        SHIPPING: 'Shipping',
      },
    }),

    // Will need to check against DB and / or Autogenerated

    emailId: FF.TextField({
      label: 'Email ID',
      description:
        'New ID value used in email address updates. The ID cannot already be in use by another email address.',
      primary: false,
      required: false,
      unique: false,
    }),
  },

  //Sheet Configuration Options

  {
    //Allows the end user to create additional fields from their upload when the incoming column does not match with any existing field for the Sheet.
    allowCustomFields: false,

    //Function that receives a row with all required fields fully present and optional fields typed optional?:string. Best used to compute derived values, can also be used to update existing fields.
    recordCompute: (record: FlatfileRecord<any>, _session, logger?: any) => {
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
      const hasOtherAddressFields = addressFieldsMinusCountry.some(
        (fieldName) => isNotNil(record.get(fieldName))
      );

      if (hasOtherAddressFields && isNil(record.get('addressCountry'))) {
        record.addError(
          'addressCountry',
          'Address Country must be provided if any address fields are present.'
        );
      }

      //Add validation for phoneNumber to be required if any other phone field is provided
      const phoneFieldsMinusNumber = phoneFields.filter(
        (f) => f !== 'phoneNumber'
      );
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
    },

    //Add Validation that endEmploymentDate must be after hireDate.
    //Add Validation for nameCountry to be required if any other name field is provided

    //Add Transformation for when addressType = Home, addressPublic = True. Add info message saying "Address Public was set to True when Address Type is Home." If addressType is cleared, should also clear out addressPublic.

    //Asynchronous function that is best for HTTP/API calls. External calls can be made to fill in values from external services. This takes records so it is easier to make bulk calls.
    batchRecordsCompute: async (payload: FlatfileRecords<any>) => {},
    //Use for API based validations (ex: employeeId)
    actions: {
      executeValidationAction,
    },
  }
);

export default Employees;
