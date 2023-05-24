// import { Blueprint } from '@flatfile/api';

export const blueprint = ({ blueprintSlug }: { blueprintSlug: string }) => {
  return {
    name: 'HCM.show Benefits',
    slug: 'benefits-blueprint',
    blueprints: [
      {
        name: 'Benefits Workbook',
        slug: 'benefits-workbook',
        primary: false,
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
                      value:
                        'Health_Care_Coverage_Type_Supplementary_Retirement',
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
                      value:
                        'Additional_Benefits_Coverage_Type_Fringe_Benefits',
                      label: 'Fringe Benefits',
                    },
                  ],
                },
              },
            ],
          },
        ],
      }, //as Blueprint,
    ],
  };
};
