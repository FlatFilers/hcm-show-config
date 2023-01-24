import * as FF from '@flatfile/configure'
import { SmartDateField } from '../fields/SmartDateField'
import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'

const Jobs = new FF.Sheet(
  'Jobs',
  {
    //Validate against exisitng Job Codes in DB - call out the ID already exists & this would be an update and not a create

    job_code: FF.TextField({
      label: 'Job Code',
      description: 'Unique Identifier for a Job. Also known as Job ID. ',
      primary: true,
      required: true,
      unique: true,
    }),

    // May want to throw a warning if missing to say this will default to today. May also want to default to 01-01-1900

    effective_date: SmartDateField({
      label: 'Effective Date',
      formatString: 'YYYY-MM-DD',
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
    }),

    job_name: FF.TextField({
      label: 'Job Name',
      description: 'The name of the job.',
      primary: false,
      required: true,
      unique: false,
    }),

    // May want to default this to True or allow this to be specified dynamically

    include_job_code_in_name: FF.BooleanField({
      label: 'Include Job Code in Name',
      description:
        'Boolean attribute identifying whether Job Code should be included in Name (Display ID within HCM.Show).',
      primary: false,
      required: false,
      unique: false,
    }),

    private_title: FF.TextField({
      label: 'Private Title',
      description:
        'Private Job Title. This field is the same as Job Title Default in the HCM.Show',
      primary: false,
      required: false,
      unique: false,
    }),

    job_summary: FF.TextField({
      label: 'Job Summary',
      description: 'Text attribute identifying Job Profile Summary.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Will Flatfile support Rich Text formatting?

    job_description: FF.TextField({
      label: 'Job Description',
      description: 'Rich text attribute identifying Job Description.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Will Flatfile support Rich Text formatting?

    additional_job_description: FF.TextField({
      label: 'Additional Job Description',
      description:
        'The Additional Job Description is only available when the Recruiting functional area is enabled. Use job posting templates to control where the Additional Job Description displays. Example: Define a Job Description for external job postings and an Additional Job Description for internal job postings. ',
      primary: false,
      required: false,
      unique: false,
    }),

    // May want to default this to True or allow this to be specified dynamically

    work_shift_required: FF.BooleanField({
      label: 'Work Shift Required',
      description:
        'Boolean attribute indicating whether a work shift is required for workers in this job.',
      primary: false,
      required: false,
      unique: false,
    }),

    // May want to default this to True or allow this to be specified dynamically

    public_job: FF.BooleanField({
      label: 'Public Job',
      description:
        'Boolean attribute indicating whether the job profile is considered a public job.',
      primary: false,
      required: false,
      unique: false,
    }),

    // Will need to validate against a list of Job Family IDs in the DB. The Name will make sense to the user - will we want to use this for mapping?  The ID will be required for loading to the system. How can we handle this? Will we have the ability to refresh the list ad-hoc?

    job_family: FF.TextField({
      label: 'Job Family',
      description: 'Element containing the Job Family data for a job.',
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

    batchRecordsCompute: async (payload: FlatfileRecords<any>) => {
      // Sends records to an imaginary API endpoint that validates linkedIn urls
      // and writes the valid / invalid status to the record
      const urlsToValidate = await payload.records.map(
        async (record: FlatfileRecord) => {
          return record.get('linkedIn')
        }
      )
      const response = await fetch('your-api-to-check-linkedin-urls', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify(urlsToValidate),
      })
      // Suppose response has the format:
      // {
      //    'https://linkedin.com/valid-url': 'valid',
      //    'https://linkedin.com/invalid-url': 'invalid',
      //    ...
      // }
      if (response.ok) {
        const result = await response.json()
        payload.records.map(async (record: FlatfileRecord) => {
          const linkedInValid =
            result[record.get('linkedIn') as string] === 'valid'
          record.set('linkedInValid', linkedInValid)
          record.addWarning('linkedInValid'], "Record set based on API response");
        })
      }
    },
  }
)

export default Jobs
