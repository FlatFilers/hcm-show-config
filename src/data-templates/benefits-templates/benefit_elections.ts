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
