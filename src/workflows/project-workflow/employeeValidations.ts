import { FlatfileRecord } from '@flatfile/hooks';
import { vlookup } from '../../validations-plugins/common/common';
import { validateContactInformation } from '../../computes/record/validate-contact-information';
import { verifyDates } from '../../computes/record/verify-dates';
import { employeeHours } from '../../computes/record/employee-hours';

export default function employeeValidations(record: FlatfileRecord) {
  validateContactInformation(record);
  verifyDates(record);
  employeeHours(record);
  vlookup(record, 'jobName', 'jobCode', 'jobCode');

  return record;
}
