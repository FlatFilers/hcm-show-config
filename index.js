import { recordHook } from '@flatfile/plugin-record-hook';
import { FlatfileClient } from '@flatfile/api';
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor';

process.env.FLATFILE_API_KEY = 'sk_UrerfpfQAhDHaH1qBwj6ah42MrZCcx8l';

const api = new FlatfileClient();

export default function (listener) {
  listener.on('**', (event) => {
    console.log('> event.topic: ' + event.topic);
  });

  listener.on('space:created', async (event) => {
    const { spaceId, environmentId } = event.context;

    console.log('env: ' + environmentId + 'space: ' + spaceId);

    const workbook = await api.workbooks.create({
      name: 'My Workbook',
      spaceId: spaceId,
      environmentId: environmentId,
      sheets: [
        {
          name: 'Benefit Elections',
          slug: 'benefit-elections-sheet',
          readonly: false,
          fields: [
            //Validate against exisitng Employess in DB. If not found, throw an error in Flatfile. Open question around whether this could be a ReferenceField with a lookup to the Employee table.  What should happen if an Emplpyee is not found?  Should we create a new Employee record in Flatfile or should that occur in HCM.Show?

            {
              key: 'employeeId',
              label: 'Employee ID',
              description: 'Employee ID for existing Employee in HCM.Show.',
              type: 'string',
              constraints: [{ type: 'required', primary: true }],
            },

            // Validate against exisitng benefit plans in DB. If not found, throw an error in Flatfile. Open question around whether this could be a ReferenceField with a lookup to the Benefit Plan table.  What should happen if a Benefit Plan is not found?  Should we create a new Benefit Plan record in Flatfile or should that occur in HCM.Show?

            {
              key: 'benefitPlan',
              label: 'Benefit Plan',
              description:
                'Benefit Plan for existing Benefit Plan in HCM.Show.',
              type: 'string',
              constraints: [{ type: 'required' }],
            },

            //Required checkbox → “required: true” validation

            {
              key: 'currentlyEnrolled',
              label: 'Currently Enrolled',
              description:
                'Is the employee currently enrolled in this benefit plan?',
              type: 'boolean',
              constraints: [{ type: 'required' }],
            },

            //Date fields have a date format selection → updated target date format for SmartDateField

            {
              key: 'coverageStartDate',
              label: 'Coverage Start Date',
              description:
                'Date coverage begins for this benefit plan. Must be formatted as yyyy-MM-dd',
              type: 'date',
              constraints: [{ type: 'required' }],
            },

            //Round to two decimal places → validation / compute on Number fields for decimal places (trim and validate)

            {
              key: 'employerContribution',
              label: 'Employer Contribution',
              type: 'number',
              description:
                'Employer contribution for this benefit plan per plan frequency.',
              constraints: [{ type: 'required' }],
            },

            {
              key: 'benefitCoverageType',
              label: 'Benefit Coverage Type',
              type: 'enum',
              description:
                'Indicates the type of insurance, retirement savings, or other benefits that are provided by an employer to an employee.',
              constraints: [{ type: 'required' }],
              config: {
                options: [
                  {
                    value: 'Insurance_Coverage_Type_Pension',
                    label: 'Pension',
                  },
                  {
                    value: 'Insurance_Coverage_Type_Basic_Group_Life',
                    label: 'Basic Group Life',
                  },
                  {
                    value: 'Insurance_Coverage_Type_Long_Term_Disability',
                    label: 'Long Term Disability',
                  },
                  {
                    value: 'Insurance_Coverage_Type_Short_Term_Disability',
                    label: 'Short Term Disability',
                  },
                  {
                    value: 'Insurance_Coverage_Type_Voluntary_ADandD',
                    label: 'Voluntary AD&D',
                  },
                  {
                    value:
                      'Insurance_Coverage_Type_Voluntary_Supplemental_Life',
                    label: 'Voluntary Supplemental Life',
                  },
                  {
                    value: 'Insurance_Coverage_Type_Spouse_Life',
                    label: 'Spouse Life',
                  },
                  {
                    value: 'Health_Care_Coverage_Type_Medical',
                    label: 'Medical',
                  },
                  {
                    value: 'Health_Care_Coverage_Type_Dental',
                    label: 'Dental',
                  },
                  {
                    value: 'Health_Care_Coverage_Type_Contingency_Fund',
                    label: 'Contingency Fund',
                  },
                  {
                    value: 'Health_Care_Coverage_Type_Health',
                    label: 'Health',
                  },
                  {
                    value: 'Health_Care_Coverage_Type_Supplementary_Retirement',
                    label: 'Supplementary Retirement',
                  },
                  {
                    value: 'Spending_Account_Type_Childcare_Vouchers',
                    label: 'Childcare Vouchers',
                  },
                  {
                    value: 'Retirement_Savings_Coverage_Type_401k',
                    label: '401(k)',
                  },
                  {
                    value: 'Retirement_Savings_Coverage_Type_RRSP',
                    label: 'RRSP',
                  },
                  {
                    value: 'Retirement_Savings_Coverage_Type_NQDC',
                    label: 'NQDC',
                  },
                  {
                    value: 'Retirement_Savings_Coverage_Type_Deferred_Stock',
                    label: 'Deferred Stock',
                  },
                  {
                    value:
                      'Retirement_Savings_Coverage_Type_Defined_Contribution',
                    label: 'Defined Contribution',
                  },
                  {
                    value: 'Retirement_Savings_Coverage_Type_Swedish',
                    label: 'Swedish',
                  },
                  {
                    value:
                      'Retirement_Savings_Coverage_Type_New_Zealand_Pension',
                    label: 'New Zealand Pension',
                  },
                  {
                    value:
                      'Health_Savings_Account_Coverage_Type_Health_Savings_Account',
                    label: 'Health Savings Account',
                  },
                  {
                    value: 'Additional_Benefits_Coverage_Type_Gym_Membership',
                    label: 'Gym Membership',
                  },
                  {
                    value:
                      'Additional_Benefits_Coverage_Type_Commuter_Spending',
                    label: 'Commuter Spending',
                  },
                  {
                    value:
                      'Additional_Benefits_Coverage_Type_Charitable_Giving',
                    label: 'Charitable Giving',
                  },
                  {
                    value: 'Additional_Benefits_Coverage_Type_Meal_Vouchers',
                    label: 'Meal Vouchers',
                  },
                  {
                    value: 'Additional_Benefits_Coverage_Type_Fringe_Benefits',
                    label: 'Fringe Benefits',
                  },
                ],
                allowCustom: false,
              },
            },
          ],
        },
      ],
    });
    console.log(`-> My event + ${JSON.stringify(workbook)}`);
  });

  listener.on('job:created', async (event) => {
    const { jobId } = event.context;
    console.log(jobId);
  });

  listener.on('job:updated', async (event) => {
    const { jobId } = event.context;
    const job = await api.jobs.get(jobId);
    console.log(job);
  });

  listener.use(
    recordHook('benefit-elections-sheet', (record) => {
      // if employeeId contains any non-numbers
      // then.. set benefitCoverageType to Retirement_Savings_Coverage_Type_Swedish
      record.compute('employeeId', () => 'Eric', 'Computed value');

      // if benefitPlan is not null
      // then.. set benefitCoverageType to Additional_Benefits_Coverage_Type_Fringe_Benefits
      record.computeIfPresent(
        'employeeId',
        () => 'Eric',
        'Computed if present value'
      );

      // if coverageStartDate is after today
      // then.. set coverageStartDate to invalid
      record.validate('employeeId', () => false, 'Validated value');

      return record;
    })
  );

  listener.use(
    recordHook('employees-sheet', (FlatfileRecord) => {
      const results = employeeValidations(record);
      console.log(JSON.stringify(results));
      return FlatfileRecord;
    })
  );

  // Run actions
  listener.on('action:triggered', async (event) => {
    const action = event.context.actionName;
    const sheet = event.context.sheetSlug;

    // run actions on employees sheet

    if (sheet === 'employees-sheet') {
      // Run RetriggerValidations action

      if (action === 'employees-sheet:RetriggerValidations') {
        await RetriggerValidations(event);
        console.log(JSON.stringify(action));
      }
    }

    // Run pushToHcmShow action
    if (action === 'employees-sheet:pushToHcmShow') {
      await pushToHcmShow(event);
      console.log(JSON.stringify(action));
    }
  });

  // workflow assumes file is loaded via API: POST v1/files
  listener.on('upload:completed', async (event) => {
    return new ExcelExtractor(event, {
      rawNumbers: true,
    }).runExtraction();
  });
}
