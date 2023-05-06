// Import FlatfileRecord from Flatfile Hooks and isNil helper function from common helpers
import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

// Define a function that checks if a given value is a number and not NaN
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

// Define a function that validates and calculates weekly hours for an employee
function validateWeeklyHours(record) {
  // Get relevant fields from the Flatfile record
  const empType = record.get('employeeType');
  const defHours = record.get('defaultWeeklyHours');
  const schedHours = record.get('scheduledWeeklyHours');
  const message = 'Scheduled Weekly Hours calculated based on Employee Type';

  // Validations: check if scheduled weekly hours or default weekly hours exceed 168
  if (isNumber(schedHours) && schedHours > 168) {
    record.addError(
      'scheduledWeeklyHours',
      'Scheduled Hours cannot exceed 168 hours'
    );
  }

  if (isNumber(defHours) && defHours > 168) {
    record.addError(
      'defaultWeeklyHours',
      'Default Weekly Hours cannot exceed 168 hours'
    );
  }

  // Transformations: set scheduled weekly hours based on employee type if it is null or undefined
  if (isNil(schedHours)) {
    switch (empType) {
      case 'ft':
        record.set('scheduledWeeklyHours', 40);
        break;
      case 'pt':
        record.set('scheduledWeeklyHours', 20);
        break;
      case 'tm':
        record.set('scheduledWeeklyHours', 40);
        break;
      case 'ct':
        record.set('scheduledWeeklyHours', 0);
        break;
    }
    record.addInfo('scheduledWeeklyHours', message);
  }

  // Check if scheduled weekly hours exceed default weekly hours and add a warning if they do
  if (schedHours > defHours) {
    record.addWarning(
      'scheduledWeeklyHours',
      'Scheduled Hours exceeds Default Hours'
    );
  }

  // Calculations: calculate FTE (full-time equivalent) and add an error if it exceeds 999
  if (isNumber(defHours) && isNumber(schedHours)) {
    const fte = schedHours / defHours;
    if (fte > 999) {
      record.addError(
        'scheduledWeeklyHours',
        `FTE must be 999 or less. FTE is calculated by dividing Scheduled Weekly Hours by Default Weekly Hours. Current FTE is ${fte}.`
      );
    }
  }
}

// Export the validateWeeklyHours function as employeeHours
export const employeeHours = validateWeeklyHours;
