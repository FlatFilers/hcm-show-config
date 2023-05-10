import { vlookup } from '../../common/common';
import validateContactInformation from './validate-contact-information';
import { validateJobDates } from './validate-job-dates';
import { employeeHours } from './employee-hours';
import { formatRecordDates } from '../../common/dateFormatting';

export function employeeValidations(record) {
  formatRecordDates(record, 'employees-sheet');
  validateContactInformation(record);
  validateJobDates(record);
  employeeHours(record);
  vlookup(record, 'jobName', 'jobCode', 'jobCode');

  return record;
}
