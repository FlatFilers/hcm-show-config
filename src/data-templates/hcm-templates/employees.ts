import * as FF from '@flatfile/configure'
import { SmartDateField } from '../fields/SmartDateField'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import { emailReg } from '../../validations-plugins/regex/regex'
import { validateRegex } from '../../validations-plugins/common/common'

const Employees = new FF.Sheet(
  'Employees',
  {
    //Validate against exisitng Employee in DB - call out the ID already exists & this would be an update and not a create

    employee_id: FF.TextField({
      label: 'Employee ID',
      description: 'Unique Identifier for a Employee.',
      primary: true,
      required: true,
      unique: true,
    }),

    // This will need to be a valid Employee ID from either the DB or the existing dataset.

    manager_id: FF.TextField({
      label: 'Manager ID',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB

    name_country: FF.TextField({
      label: 'Country',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on the name_country field, the ID value, and Country Name Requirements.

    name_title: FF.TextField({
      label: 'Title',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    name_first_name: FF.TextField({
      label: 'First Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    name_middle_name: FF.TextField({
      label: 'Middle Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on Country Name Requirements

    name_last_name: FF.TextField({
      label: 'Last Name',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be validated based on the name_country field, the ID value, and Country Name Requirements

    name_social_suffix: FF.TextField({
      label: 'Social Suffix',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid Employee Type based on the list of Employee Types configured in DB

    employee_type: FF.TextField({
      label: 'Employee Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Hire Reason based on the list of Event Categories and Reasons configured in DB

    hire_reason: FF.TextField({
      label: 'Hire Reason',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    //May need to check for dates in future or set a cutoff for dates

    hire_date: SmartDateField({
      label: 'Hire Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // Required if Employee Type = Fixed Term, Cannot be before Hire Date

    end_employement_date: SmartDateField({
      label: 'End Employment Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Validate that hire date is on or after effective date of Job Code, Customer file will likely have job name or legacy code - how will we plan to map values using reference field if keys are not aligned?

    job_code: FF.ReferenceField({
      label: 'Job Code',
      description: '',
      sheetKey: 'Jobs',
      foreignKey: 'job_name',
      relationship: 'has-many',
      primary: false,
      required: true,
      unique: false,
    }),

    // If left blank, will default to job title

    position_title: FF.TextField({
      label: 'Position Title',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // If left blank, will default to position title

    business_title: FF.TextField({
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

    position_time_type: FF.TextField({
      label: 'Position Time Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be validated based on the ID Value and Workshift Country = Country of Location.

    work_shift: FF.TextField({
      label: 'Work Shift',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // May default to Locations hours

    default_weekly_hours: FF.NumberField({
      label: 'Default Weekly Hours',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // May default to Locations hours

    scheduled_weekly_hours: FF.NumberField({
      label: 'Scheduled Weekly Hours',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // This will need to be a valid Pay Rate based on the list of Pay Rate Types configured in DB

    pay_rate_type: FF.TextField({
      label: 'Pay Rate Type',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // Multi-Select field. This will need to be a valid Job Classification based on the list of Job Classifications configured in DB

    additional_job_classification: FF.TextField({
      label: 'Additional Job Classification',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Multi-Select field. This will need to be a valid Worker Compensation Code based on the list of Worker Compensation Codes configured in DB

    worker_compensation_code: FF.TextField({
      label: 'Worker Compensation Code',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //If empty, system defaults to today

    address_effective_date: SmartDateField({
      label: 'Effective Date',
      formatString: 'yyyy-MM-dd',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, if any address field is provided - this is field is required

    address_country: FF.TextField({
      label: 'Country',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Address Line Fields - requirements will be by Country and determined by Countries and their Address Components

    address_line_1: FF.TextField({
      label: 'Address Line 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    address_line_2: FF.TextField({
      label: 'Address Line 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_3: FF.TextField({
      label: 'Address Line 3',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_4: FF.TextField({
      label: 'Address Line 4',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_5: FF.TextField({
      label: 'Address Line 5',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_6: FF.TextField({
      label: 'Address Line 6',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_7: FF.TextField({
      label: 'Address Line 7',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_8: FF.TextField({
      label: 'Address Line 8',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_9: FF.TextField({
      label: 'Address Line 9',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    address_line_1_local: FF.TextField({
      label: 'Address Line 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    address_line_2_local: FF.TextField({
      label: 'Address Line 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_3_local: FF.TextField({
      label: 'Address Line 3 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_4_local: FF.TextField({
      label: 'Address Line 4 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_5_local: FF.TextField({
      label: 'Address Line 5 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_6_local: FF.TextField({
      label: 'Address Line 6 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_7_local: FF.TextField({
      label: 'Address Line 7 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_8_local: FF.TextField({
      label: 'Address Line 8 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    address_line_9_local: FF.TextField({
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
    city_subdivision_1: FF.TextField({
      label: 'City Subdivision 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    city_subdivision_2: FF.TextField({
      label: 'City Subdivision 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    city_subdivision_1_local: FF.TextField({
      label: 'City Subdivision 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    city_subdivision_2_local: FF.TextField({
      label: 'City Subdivision 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country region based on the list of Country Regions configured in DB, the region must also be valid for the Country (ex: USA-CA is valid for USA, USA-CA is not valid for CAN)

    country_region: FF.TextField({
      label: 'Country Region',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    regionsubdivision_1: FF.TextField({
      label: 'Region Subdivision 1',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    region_subdivision_2: FF.TextField({
      label: 'Region Subdivision 2',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    region_subdivision_1_local: FF.TextField({
      label: 'Region Subdivision 1 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    region_subdivision_2_local: FF.TextField({
      label: 'Region Subdivision 2 - Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Must be validated by Country (had previously used npm package)
    postal_code: FF.TextField({
      label: 'Postal Code',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // If Type = Home - Public = False, Type = Work - Public = True

    address_public: FF.BooleanField({
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one Address can be primary by type

    address_primary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    address_type: FF.OptionField({
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

    address_use_for: FF.TextField({
      label: 'Use For',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    //Requirements will be by Country and determined by Countries and their Address Components

    municipality_local: FF.TextField({
      label: 'Municipality Local',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid country based on the list of Countries configured in DB, this becomes required if any other phone field is provided

    phone_country: FF.TextField({
      label: 'Country',
      description:
        'Country ISO code. If the Country ISO code is specified, then this ISO code will be used to determine the Country Phone Code for (eliminate space between f and o) the phone. Pass this ISO code to distinguish between multiple countries sharing the same Country Phone Code. (For example, 1 is the Country Phone Code that is shared by USA, Canada, Dominican Republic, Bermuda, Jamaica, and Puerto Rico.) ',
      primary: false,
      required: false,
      unique: false,
    }),

    // May be a lookup field based on Country

    international_phone_code: FF.NumberField({
      label: 'International Phone Code',
      description: 'International phone code number. ',
      primary: false,
      required: false,
      unique: false,
    }),

    // Numbers only, must match format specified by country - have used npm package in the past for this

    phone_number: FF.NumberField({
      label: 'Phone Number',
      description: 'Full phone number.',
      primary: false,
      required: false,
      unique: false,
    }),
    phone_extension: FF.TextField({
      label: 'Phone Extension',
      description: 'Phone extension.',
      primary: false,
      required: false,
      unique: false,
    }),

    // This will need to be a valid device type based on the list of Phone Device Types configured in DB, this becomes required if any other phone field is provided

    device_type: FF.TextField({
      label: 'Device Type',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    // If Type = Home - Public = False, Type = Work - Public = True

    phone_public: FF.BooleanField({
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one phone can be primary by type

    phone_primary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // Sourced from Communication Types in DB, only two valid values: Home or Work

    phone_type: FF.OptionField({
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

    phone_use_for: FF.OptionField({
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

    email_address: FF.TextField({
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
    email_comment: FF.TextField({
      label: 'Email Comment',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    // If Type = Home - Public = False, Type = Work - Public = True

    email_public: FF.BooleanField({
      label: 'Public',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),

    // One and only one email can be primary by type

    email_primary: FF.BooleanField({
      label: 'Primary',
      description: '',
      primary: false,
      required: false,
      unique: false,
    }),
    email_type: FF.OptionField({
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

    email_use_for: FF.OptionField({
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
