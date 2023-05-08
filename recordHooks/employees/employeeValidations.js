import { vlookup } from '../../common/common';
import { dateFormatting } from '../../common/common';
import { validateContactInformation } from './validate-contact-information';
import { verifyDates } from './verify-dates';
import { employeeHours } from './employee-hours';
import { validateEmail } from './validate-email';
import { blueprintSheets } from '../../blueprint';

// Assuming the blueprint is imported as `blueprintSheets`
const targetSheet = blueprintSheets.find(
  (sheet) => sheet.slug === 'employees-sheet'
); // replace with the desired sheet's slug
const dateFields = targetSheet.fields.filter((field) => field.type === 'date');

export function employeeValidations(record) {
  dateFormatting(record, dateFields);
  validateEmail(record);
  validateContactInformation(record);
  verifyDates(record);
  employeeHours(record);
  vlookup(record, 'jobName', 'jobCode', 'jobCode');

  return record;
}
