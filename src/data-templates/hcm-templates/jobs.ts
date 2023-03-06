import * as FF from '@flatfile/configure';
import { SmartDateField } from '../fields/SmartDateField';
import { FlatfileRecord } from '@flatfile/hooks';

const Jobs = new FF.Sheet(
  'Jobs',
  {
    //Validate against exisitng Job Codes in DB - call out the ID already exists & this would be an update and not a create

    jobCode: FF.TextField({
      label: 'Job Code',
      description: 'Unique Identifier for a Job. Also known as Job ID.',
      primary: true,
      required: true,
      unique: true,
    }),

    jobName: FF.TextField({
      label: 'Job Name',
      description: 'The name of the job.',
      primary: false,
      required: true,
      unique: false,
    }),

    jobDept: FF.TextField({
      label: 'Job Department',
      description: 'The department of the job.',
      primary: false,
      required: false,
      unique: false,
    }),

    // May want to throw a warning if missing to say this will default to today. May also want to default to 01-01-1900

    effectiveDate: SmartDateField({
      label: 'Effective Date',
      formatString: 'yyyy-MM-dd',
      description:
        'On update of a job, this is the date the change to the Job will take effect. Will default to today if not submitted. During implementation, we recommend using a date of 01-01-1900 for the initial entry.',
      primary: false,
      required: false,
      unique: false,
    }),

    // May want to default this to True or allow this to be specified dynamically

    inactive: FF.BooleanField({
      label: 'Inactive',
      description:
        'Boolean attribute indicates if the Job Profile is inactive.',
      primary: false,
      required: false,
      unique: false,
      default: false
    }),
  },
  {
    recordCompute: (record: FlatfileRecord<any>, _session, logger?: any) => {},
  }
);

export default Jobs;
