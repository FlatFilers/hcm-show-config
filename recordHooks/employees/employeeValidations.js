import { vlookup } from '../../common/common';
import { validateContactInformation } from './validate-contact-information';
import { verifyDates } from './verify-dates';
import { employeeHours } from './employee-hours';
import { validateEmail } from './validate-email';

export function employeeValidations(record) {
  //validateEmail(record);
  validateContactInformation(record);
  verifyDates(record);
  employeeHours(record);
  vlookup(record, 'jobName', 'jobCode', 'jobCode');

  return record;
}
