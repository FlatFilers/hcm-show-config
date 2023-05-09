import { vlookup } from '../../common/common';
import { validateContactInformation } from './validate-contact-information';
import { verifyDates } from './verify-dates';
import { employeeHours } from './employee-hours';
import validateEmail from './validate-email';
import { formatRecordDates } from '../../common/dateFormatting';

export function employeeValidations(record) {
  formatRecordDates(record, 'employees-sheet');
  validateEmail(record);
  validateContactInformation(record);
  verifyDates(record);
  employeeHours(record);
  vlookup(record, 'jobName', 'jobCode', 'jobCode');

  return record;
}
