import * as FF from '@flatfile/configure';
import { SmartDateField } from '../fields/SmartDateField';
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks';

const benefitElections = new FF.Sheet(
  'Benefit Elections',
  {
    //Validate against exisitng Employess in DB. If not found, throw an error in Flatfile. Open question around whether this could be a ReferenceField with a lookup to the Employee table.  What should happen if an Emplpyee is not found?  Should we create a new Employee record in Flatfile or should that occur in HCM.Show?

    employeeId: FF.TextField({
      label: 'Employee ID',
      description: 'Employee ID for existing Employee in HCM.Show.',
      primary: true,
      required: true,
    }),

    // Validate against exisitng benefit plans in DB. If not found, throw an error in Flatfile. Open question around whether this could be a ReferenceField with a lookup to the Benefit Plan table.  What should happen if a Benefit Plan is not found?  Should we create a new Benefit Plan record in Flatfile or should that occur in HCM.Show?

    benefitPlan: FF.TextField({
      label: 'Benefit Plan',
      description: 'Benefit Plan for existing Benefit Plan in HCM.Show.',
      primary: false,
      required: true,
    }),

    //Required checkbox → “required: true” validation

    currentlyEnrolled: FF.BooleanField({
      label: 'Currently Enrolled',
      description: 'Is the employee currently enrolled in this benefit plan?',
      primary: false,
      required: true,
    }),

    //Date fields have a date format selection → updated target date format for SmartDateField

    coverageStartDate: SmartDateField({
      label: 'Coverage Start Date',
      description: 'Date coverage begins for this benefit plan.',
      formatString: 'yyyy-MM-dd',
      primary: false,
      required: true,
    }),

    //Number decimal places → validation / compute on Number fields for decimal places (trim and validate)

    employerContribution: FF.NumberField({
      label: 'Employer Contribution',
      description:
        'Employer contribution for this benefit plan per plan frequency .',
      primary: false,
      required: true,
      annotations: {
        compute: true,
        computeMessage:
          'This value was automatically reformatted to two decimal places. Original value was: ',
      },
      compute: (v: number) => {
        return Number(v.toFixed(2));
      },
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
);

export default benefitElections;
