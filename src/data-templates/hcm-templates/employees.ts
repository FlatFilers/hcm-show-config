import * as FF from '@flatfile/configure'
import { SmartDateField } from '../fields/SmartDateField'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import { emailReg } from '../../validations-plugins/regex/regex'
import { validateRegex } from '../../validations-plugins/common/common'

const Employees = new FF.Sheet(
  'Employees',
  {
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
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB

    nameCountry: FF.TextField({
      label: 'Country',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on the name_country field, the ID value, and Country Name Requirements.

    title: FF.TextField({
      label: 'Title',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    firstName: FF.TextField({
      label: 'First Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    middleName: FF.TextField({
      label: 'Middle Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    lastName: FF.TextField({
      label: 'Last Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on the name_country field, the ID value, and Country Name Requirements

    socialSuffix: FF.TextField({
      label: 'Social Suffix',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid Employee Type based on the list of Employee Types configured in DB

    employeeType: FF.TextField({
      label: 'Employee Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Hire Reason based on the list of Event Categories and Reasons configured in DB

    hireReason: FF.TextField({
      label: 'Hire Reason',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    //May need to check for dates in future or set a cutoff for dates

    hireDate: SmartDateField({
      label: 'Hire Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // Required if Employee Type = Fixed Term, Cannot be before Hire Date

    endEmploymentDate: SmartDateField({
      label: 'End Employment Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Validate that hire date is on or after effective date of Job Code, Customer file will likely have job name or legacy code - how will we plan to map values using reference field if keys are not aligned?

    jobCode: FF.ReferenceField({
      label: 'Job Code',
      description: '',
      sheetKey: 'Jobs',
      foreignKey: 'jobName',
      relationship: 'has-many',
      primary: false,
      required: true,
      unique: false,
    }),

    // If left blank, will default to job title

    positionTitle: FF.TextField({
      label: 'Position Title',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // If left blank, will default to position title

    businessTitle: FF.TextField({
      label: 'Business Title',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid Business Site based on the list of Locations configured in DB

    location: FF.TextField({
      label: 'Location',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Workspace based on the list of Locations configured in DB (if Location Usage = Business Site and validate that Superior Location = Location)

    workspace: FF.TextField({
      label: 'Workspace',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid time type based on the list of time types configured in DB

    positionTimeType: FF.TextField({
      label: 'Position Time Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be validated based on the ID Value and Workshift Country = Country of Location.

    workShift: FF.TextField({
      label: 'Work Shift',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // May default to Locations hours

    defaultWeeklyHours: FF.NumberField({
      label: 'Default Weekly Hours',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // May default to Locations hours

    scheduledWeeklyHours: FF.NumberField({
      label: 'Scheduled Weekly Hours',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Pay Rate based on the list of Pay Rate Types configured in DB

    payRateType: FF.TextField({
      label: 'Pay Rate Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // Multi-Select field. This will need to be a valid Job Classification based on the list of Job Classifications configured in DB

    additionalJobClassification: FF.TextField({
      label: 'Additional Job Classification',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Multi-Select field. This will need to be a valid Worker Compensation Code based on the list of Worker Compensation Codes configured in DB

    workderCompensationCode: FF.TextField({
      label: 'Worker Compensation Code',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //If empty, system defaults to today

    addressEffectiveDate: SmartDateField({
      label: 'Effective Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, if any address field is provided - this is field is required

    addressCountry: FF.TextField({
      label: 'Country',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Address Line Fields - requirements will be by Country and determined by Countries and their Address Components

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
      description: '',
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
      description: '',
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

    // Must be validated by Country (had previously used npm package)
    postalCode: FF.TextField({
      label: 'Postal Code',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // If Type = Home - Public = False, Type = Work - Public = True

    addressPublic: FF.BooleanField({
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one Address can be primary by type

    addressPrimary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    addressType: FF.OptionField({
      label: 'Type',
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
      label: 'Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //Requirements will be by Country and determined by Countries and their Address Components

    municipalityLocal: FF.TextField({
      label: 'Municipality Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, this becomes required if any other phone field is provided

    phoneCountry: FF.TextField({
      label: 'Country',
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

    // Numbers only, must match format specified by country - have used npm package in the past for this

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
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one phone can be primary by type

    phonePrimary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    phoneType: FF.OptionField({
      label: 'Type',
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
      label: 'Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        BILLING: 'Billing',
        SHIPPING: 'Shipping',
      },
    }),

    //Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com.

    emailAddress: FF.TextField({
      label: 'Email Address',
      description: '',
      primary: false,
      required: false,
      unique: false,
      validate: (v: string) => {
        return validateRegex(
          v,
          emailReg,
          "Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com."
        )
      },
    }),
    emailComment: FF.TextField({
      label: 'Email Comment',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    // If Type = Home - Public = False, Type = Work - Public = True

    emailPublic: FF.BooleanField({
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one email can be primary by type

    emailPrimary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    emailType: FF.OptionField({
      label: 'Type',
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
      label: 'Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
      options: {
        BILLING: 'Billing',
        SHIPPING: 'Shipping',
      },
    }),
  },

  //Sheet Configuration Options

  {
    //Allows the end user to create additional fields from their upload when the incoming column does not match with any existing field for the Sheet.
    allowCustomFields: false,

    //Function that receives a row with all required fields fully present and optional fields typed optional?:string. Best used to compute derived values, can also be used to update existing fields.
    recordCompute: (record: FlatfileRecord<any>, _session, logger?: any) => {
      // Add validation for Address, Phone, or Email is required for creation of Employee
    },

    //Asynchronous function that is best for HTTP/API calls. External calls can be made to fill in values from external services. This takes records so it is easier to make bulk calls.
    batchRecordsCompute: async (payload: FlatfileRecords<any>) => {},
  }
)

export default Employees
