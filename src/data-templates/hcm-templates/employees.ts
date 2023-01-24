import * as FF from '@flatfile/configure'
import { SmartDateField } from '../fields/SmartDateField'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'

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
      formatString: 'YYYY-MM-DD',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),

    // Required if Employee Type = Fixed Term, Cannot be before Hire Date

    end_employement_date: SmartDateField({
      label: 'End Employment Date',
      formatString: 'YYYY-MM-DD',
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
  },

  //Sheet Configuration Options

  {
    //Allows the end user to create additional fields from their upload when the incoming column does not match with any existing field for the Sheet.
    allowCustomFields: false,

    //Function that receives a row with all required fields fully present and optional fields typed optional?:string. Best used to compute derived values, can also be used to update existing fields.
    recordCompute: (record: FlatfileRecord<any>, _session, logger?: any) => {},

    //Asynchronous function that is best for HTTP/API calls. External calls can be made to fill in values from external services. This takes records so it is easier to make bulk calls.
    batchRecordsCompute: async (payload: FlatfileRecords<any>) => {},
  }
)

export default Employees
