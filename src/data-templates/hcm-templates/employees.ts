import * as FF from '@flatfile/configure';
import { SmartDateField } from '../fields/SmartDateField';
import { FlatfileRecord } from '@flatfile/hooks';
import { emailReg } from '../../validations-plugins/regex/regex';
import { validateRegex } from '../../validations-plugins/common/common';
import { validateContactInformation } from '../../computes/record/validate-contact-information';
import { verifyDates } from '../../computes/record/verify-dates';
import { employeeHours } from '../../computes/record/employee-hours';
import RetriggerValidations from '../../validations-plugins/reTriggerValidations';
import { pushToWebhook } from '../../validations-plugins/actions/push-to-webhook';
// import { pushToHcmShow } from '../../validations-plugins/actions/push-to-hcm-show';

const Employees = new FF.Sheet(
  'Employees',
  {
    employeeId: FF.TextField({
      label: 'Employee ID',
      description: 'Unique Identifier for a Employee.',
      primary: true,
      required: true,
      unique: true,
    }),

    firstName: FF.TextField({
      label: 'First Name',
      description: 'The First Name (Given Name) for a person. ',
      primary: false,
      required: false,
      unique: false,
    }),

    lastName: FF.TextField({
      label: 'Last Name',
      description: 'The Last Name (Family Name) for a person. ',
      primary: false,
      required: false,
      unique: false,
    }),

    employeeType: FF.OptionField({
      label: 'Employee Type',
      description: "The worker's employee type.",
      primary: false,
      required: true,
      unique: false,
      options: {
        ft:"Full-Time",
        pt:"Part-Time",
        tm:"Temporary",
        ct:"Contract"
      }
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

    endEmploymentDate: SmartDateField({
      label: 'End Employment Date',
      formatString: 'yyyy-MM-dd',
      description:
        'The End Employment Date for the position of fixed term or temporary employees.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Validate that hire date is on or after effective date of Job Code

    jobName: FF.ReferenceField({
      label: 'Job Name',
      description: 'The Job Profile for the Employee.',
      sheetKey: 'Jobs',
      foreignKey: 'jobName',
      relationship: 'has-many',
      primary: false,
      required: false,
      unique: false,
    }),

    // If left blank, will default to department title

    positionTitle: FF.TextField({
      label: 'Position Title',
      description: "The Position Title of the Employee's position.",
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

    phoneNumber: FF.TextField({
      label: 'Phone Number',
      description: '',
      primary: false,
      required: true,
      unique: false,
    }),
  },

  //Sheet Configuration Options

  {
    //Allows the end user to create additional fields from their upload when the incoming column does not match with any existing field for the Sheet.
    allowCustomFields: false,

    recordCompute: (record: FlatfileRecord<any>, _session, logger?: any) => {
      validateContactInformation(record);
      verifyDates(record);
      employeeHours(record);
    },

    actions: {
      RetriggerValidations,
      // pushToHcmShow,
      pushToWebhook,
    },
  }
);

export default Employees;
